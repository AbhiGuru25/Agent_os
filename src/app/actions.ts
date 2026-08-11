"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import FirecrawlApp from '@mendable/firecrawl-js';
import Groq from 'groq-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function updateProposal(id: string, title: string, content: string, price_estimate: string) {
  try {
    const { error } = await supabase
      .from('agent_proposals')
      .update({ title, content, price_estimate })
      .eq('id', id);

    if (error) throw error;
    
    // Revalidate the proposals page so the UI updates instantly
    revalidatePath('/proposals');
    return { success: true };
  } catch (error: any) {
    console.error("Error updating proposal:", error);
    return { success: false, error: error.message };
  }
}

export async function approveAndSendProposal(id: string) {
  try {
    // 1. Fetch the Proposal data
    const { data: proposal, error: fetchError } = await supabase
      .from('agent_proposals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !proposal) throw new Error("Proposal not found");

    // 2. Fetch the Lead data to get the phone number
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', proposal.lead_id)
      .single();

    if (leadError || !lead) throw new Error("Lead not found");

    // 3. Fire the Webhook to n8n
    const webhookUrl = "http://localhost:5678/webhook-test/f65fbdc4-a00f-4bfa-bb44-71e061558c62";
    
    const payload = {
      lead_id: lead.id,
      lead_name: lead.name,
      phone: lead.phone,
      business_name: lead.business_name,
      proposal_title: proposal.title,
      price: proposal.price_estimate,
      content: proposal.content
    };

    console.log("Sending payload to n8n:", payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Webhook failed:", response.statusText);
      throw new Error(`Failed to send to n8n: ${response.statusText}`);
    }

    // 4. Update status to approved (if it wasn't already)
    const { error: updateError } = await supabase
      .from('agent_proposals')
      .update({ status: 'approved' })
      .eq('id', id);

    if (updateError) throw updateError;

    revalidatePath('/proposals');
    revalidatePath(`/leads/${lead.id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error approving proposal:", error);
    return { success: false, error: error.message };
  }
}

export async function generateAIProposal(leadId: string, leadName: string, requirement: string, websiteUrl: string) {
  try {
    // 1. Scrape the website with Firecrawl
    const crawlResponse: any = await firecrawl.scrapeUrl(websiteUrl, {
      formats: ['markdown'],
    });

    if (!crawlResponse.success) {
      throw new Error(`Firecrawl failed: ${crawlResponse.error}`);
    }

    const websiteContext = crawlResponse.markdown || "No markdown extracted.";

    // 2. Generate Proposal with Groq
    const prompt = `
You are Zynteq's elite AI Proposal Architect.
We need to generate a proposal for a lead named "${leadName}".
Their requirements: "${requirement || 'Wants AI automation solutions.'}"

Here is the markdown context from their business website:
<website_context>
${websiteContext.slice(0, 15000)}
</website_context>

Based on their website and requirements, draft a highly compelling, personalized proposal offering Zynteq's AI services (like voice agents, WhatsApp bots, or RAG systems) that would directly solve their pain points or improve their business.

Return EXACTLY a JSON object with this shape, and absolutely NO other text:
{
  "title": "A catchy, professional proposal title",
  "price_estimate": "A realistic premium price range (e.g. '₹1,00,000 - ₹1,50,000')",
  "content": "The full proposal content in clean markdown formatting. Include sections for their specific pain points, the proposed AI solution, and the ROI."
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error("Groq returned empty response");

    const parsed = JSON.parse(responseContent);

    // 3. Save to Supabase
    const { error: insertError } = await supabase
      .from('agent_proposals')
      .insert([
        {
          lead_id: leadId,
          lead_name: leadName,
          title: parsed.title,
          content: parsed.content,
          price_estimate: parsed.price_estimate,
          status: 'draft'
        }
      ]);

    if (insertError) throw insertError;

    // 4. Update the lead status
    await supabase.from('leads').update({ status: 'proposal_ready' }).eq('id', leadId);

    revalidatePath('/proposals');
    revalidatePath(`/leads/${leadId}`);
    return { success: true };

  } catch (error: any) {
    console.error("Error generating AI proposal:", error);
    return { success: false, error: error.message };
  }
}

export async function autonomouslyFindLeads(directive: string) {
  try {
    // 1. Query Expansion (The Strategist Agent)
    const queryPrompt = `
You are an expert lead generation strategist. The CEO has issued this directive: "${directive}"
Convert this into a highly targeted, specific search query (like a Google Dork) to find REAL businesses that need AI automation.
For example, instead of "find dentists", use "contact us" "dental clinic" "booking" or site:linkedin.com/company "customer service" "AI".
Return EXACTLY a JSON object: { "searchQuery": "your optimized query string" }
`;
    const queryCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: queryPrompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    
    const queryParsed = JSON.parse(queryCompletion.choices[0]?.message?.content || '{"searchQuery": ""}');
    const optimizedQuery = queryParsed.searchQuery || directive;
    console.log(`[Sales Agent] Optimized Query: ${optimizedQuery}`);

    // 2. Deep Scraping (The Hunter)
    const searchResponse: any = await firecrawl.search(optimizedQuery, {
      limit: 10, // DEEP SEARCH: Pull up to 10 sources
      scrapeOptions: { formats: ['markdown'] }
    });

    if (!searchResponse || !searchResponse.web) {
      throw new Error(`Firecrawl search failed: No results returned`);
    }

    // Combine all markdown from search results
    const combinedMarkdown = searchResponse.web.map((result: any) => 
      `URL: ${result.url}\nTitle: ${result.title}\nContent:\n${result.markdown}\n---`
    ).join('\n');

    // 3. Strict Qualification (The Analyst)
    const prompt = `
You are Zynteq's elite Autonomous Lead Discovery Agent.
I have scraped deep web results for: "${optimizedQuery}".

<search_results>
${combinedMarkdown.slice(0, 30000)}
</search_results>

Your job is to extract HIGH-QUALITY, REAL businesses from this data.
CRITICAL RULES:
1. ONLY return real businesses with actual names and URLs. Do not return fake, test, or generic placeholder names.
2. The business MUST show a genuine need for AI (e.g. outdated websites, negative customer reviews, hiring for repetitive roles, explicit pain points).
3. Ignore listicles or generic directory aggregators; extract the ACTUAL businesses mentioned inside them.

Return EXACTLY a JSON object with this shape:
{
  "leads": [
    {
      "name": "Contact person name (or Business Name)",
      "business_name": "Actual company name",
      "industry": "Specific industry",
      "website": "Valid URL (exclude if missing)",
      "phone": "Phone number (if found)",
      "email": "Email address (if found)",
      "service": "What specific AI service do they need? (Voice AI, Lead Gen Bot, etc)",
      "requirement": "A highly specific, researched reason WHY they need AI based on the scraped data."
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error("Groq returned empty response");

    const parsed = JSON.parse(responseContent);
    if (!parsed.leads || !Array.isArray(parsed.leads)) {
      throw new Error("Groq returned invalid JSON structure");
    }

    const newLeads = parsed.leads;
    console.log(`[Sales Agent] Extracted ${newLeads.length} highly qualified leads.`);

    // 4. Insert into Supabase
    if (newLeads.length > 0) {
      const { error: insertError } = await supabase
        .from('leads')
        .insert(
          newLeads.map((l: any) => ({
            name: l.name || l.business_name,
            business_name: l.business_name,
            industry: l.industry,
            requirement: l.requirement,
            status: 'outbound_draft',
            budget: 'TBD',
            phone: l.phone || 'N/A',
            email: l.email || 'N/A',
            service: l.service || 'AI Automation'
          }))
        );

      if (insertError) throw insertError;
    }

    revalidatePath('/leads');
    
    return { success: true, count: newLeads.length };

  } catch (error: any) {
    console.error("Error finding new leads:", error);
    return { success: false, error: error.message };
  }
}

// --- Swarm Data Store (Supabase) ---

export async function getMarketingDrafts() {
  try {
    const { data, error } = await supabase.from('marketing_drafts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Error fetching marketing drafts:", e);
    return [];
  }
}

export async function getHRSOPs() {
  try {
    const { data, error } = await supabase.from('hr_sops').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Error fetching HR SOPs:", e);
    return [];
  }
}

// --- The Master Swarm Action ---
export async function triggerAgencySwarm(directive: string) {
  try {
    console.log(`[CEO Directive] Initiating Swarm: "${directive}"`);

    // 1. Kick off Sales Agent (Firecrawl Lead Hunter)
    const salesPromise = autonomouslyFindLeads(directive);

    // 2. Kick off Marketing Agent (Generate Content)
    const marketingPromise = groq.chat.completions.create({
      messages: [{ role: 'user', content: `
You are the elite Marketing Agent for Zynteq (an AI Automation Agency).
The CEO just issued this directive: "${directive}"

Draft 2 engaging social media posts to support this campaign.
Return EXACTLY a JSON object with this shape:
{
  "posts": [
    {
      "platform": "LinkedIn or Twitter",
      "content": "The actual post content."
    }
  ]
}
      `}],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    // 3. Kick off HR Agent (Generate SOP)
    const hrPromise = groq.chat.completions.create({
      messages: [{ role: 'user', content: `
You are the HR and Operations Agent for Zynteq.
The CEO just issued this directive: "${directive}"

Create a brief Standard Operating Procedure (SOP) title and summary for how the agency will execute this directive.
Return EXACTLY a JSON object with this shape:
{
  "title": "SOP Title",
  "summary": "2-3 sentences summarizing the operational flow."
}
      `}],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    // Wait for all agents to finish their tasks!
    const [salesResult, marketingRes, hrRes] = await Promise.all([
      salesPromise,
      marketingPromise,
      hrPromise
    ]);

    // Save Marketing Drafts
    if (marketingRes.choices[0]?.message?.content) {
      const parsed = JSON.parse(marketingRes.choices[0].message.content);
      if (parsed.posts && parsed.posts.length > 0) {
        await supabase.from('marketing_drafts').insert(
          parsed.posts.map((p: any) => ({
            platform: p.platform,
            content: p.content,
            status: 'Needs Review'
          }))
        );
      }
    }

    // Save HR SOP
    if (hrRes.choices[0]?.message?.content) {
      const parsed = JSON.parse(hrRes.choices[0].message.content);
      if (parsed.title) {
        await supabase.from('hr_sops').insert([{
          title: parsed.title,
          summary: parsed.summary,
          author: 'HR Agent'
        }]);
      }
    }

    revalidatePath('/departments/marketing');
    revalidatePath('/departments/hr');
    
    return { success: true, salesCount: salesResult.count || 0 };

  } catch (error: any) {
    console.error("Swarm execution failed:", error);
    return { success: false, error: error.message };
  }
}

// --- Spy & Intent Data Store (Supabase) ---
export async function getIntelReports() {
  try {
    const { data, error } = await supabase.from('intel_reports').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Error fetching Intel:", e);
    return [];
  }
}

export async function getIntentTargets() {
  try {
    const { data, error } = await supabase.from('intent_targets').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Error fetching Intent:", e);
    return [];
  }
}

// --- Competitor Intel Action ---
export async function runCompetitorIntel(url: string) {
  try {
    console.log(`[Spy Agent] Infiltrating competitor: ${url}`);

    const scrapeResponse: any = await firecrawl.scrapeUrl(url, { formats: ['markdown'] });
    if (!scrapeResponse.success) throw new Error(`Firecrawl failed to scrape ${url}`);

    const prompt = `
You are an elite corporate spy for Zynteq (an AI automation agency).
I have scraped a competitor's website: ${url}
Here is their raw markdown content:
<content>
${scrapeResponse.markdown?.slice(0, 15000)}
</content>

Extract exactly three things and return them as a JSON object:
{
  "offerings": "A concise summary of their core services.",
  "pricing": "Their pricing strategy if mentioned, otherwise 'Not publicly listed'.",
  "vulnerabilities": "Where are they weak? How can Zynteq beat them?"
}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    await supabase.from('intel_reports').insert([{
      url,
      offerings: parsed.offerings,
      pricing: parsed.pricing,
      vulnerabilities: parsed.vulnerabilities
    }]);
    
    revalidatePath('/departments/intel');
    
    return { success: true };
  } catch (error: any) {
    console.error("Spy execution failed:", error);
    return { success: false, error: error.message };
  }
}

// --- Intent Hunter Action ---
export async function runIntentHunt(query: string) {
  try {
    console.log(`[Intent Hunter] Scouring web for intent: ${query}`);

    const searchResponse: any = await firecrawl.search(query, {
      scrapeOptions: { formats: ['markdown'] }
    });

    const combined = searchResponse.web?.map((r: any) => r.markdown).join('\n\n---\n\n') || '';

    const prompt = `
You are the Intent Hunter for Zynteq.
I searched the web for: "${query}".
Here are the raw markdown results from forums, directories, and articles:
<content>
${combined.slice(0, 20000)}
</content>

Your job is to find people or businesses actively expressing intent or need for AI services based on this search.
Return EXACTLY a JSON object:
{
  "targets": [
    {
      "name": "Person or Company Name (or just a summary of the group)",
      "intent_signal": "Quote or summary of what they need (e.g. 'Asking how to automate their front desk').",
      "source": "Where did you find this? (e.g. Reddit, Forum, Website)"
    }
  ]
}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    if (parsed.targets && parsed.targets.length > 0) {
      await supabase.from('intent_targets').insert(
        parsed.targets.map((t: any) => ({
          query,
          name: t.name,
          intent_signal: t.intent_signal,
          source: t.source
        }))
      );
    }
    
    revalidatePath('/departments/intel');
    return { success: true };
  } catch (error: any) {
    console.error("Intent Hunt failed:", error);
    return { success: false, error: error.message };
  }
}

// --- Autonomy & Approvals ---
export async function setStandingDirective(directive: string) {
  try {
    const { error } = await supabase
      .from('agency_settings')
      .update({ value: directive, updated_at: new Date().toISOString() })
      .eq('key', 'standing_directive');
      
    if (error) throw error;

    // When a new directive is set, trigger the swarm immediately for the first run
    await triggerAgencySwarm(directive);
    return { success: true };
  } catch (e) {
    console.error("Error setting directive", e);
    return { success: false };
  }
}

export async function getStandingDirective() {
  try {
    const { data, error } = await supabase
      .from('agency_settings')
      .select('value')
      .eq('key', 'standing_directive')
      .single();
      
    if (error || !data) return "No standing directive set.";
    return data.value;
  } catch (e) {
    return "No standing directive set.";
  }
}

export async function approveMarketingDraft(draftId: string) {
  try {
    const { error } = await supabase
      .from('marketing_drafts')
      .update({ status: 'Approved & Published' })
      .eq('id', draftId);
      
    if (error) throw error;
    
    revalidatePath('/departments/ceo');
    revalidatePath('/departments/marketing');
    return { success: true };
  } catch (e) {
    console.error("Error approving draft", e);
    return { success: false };
  }
}

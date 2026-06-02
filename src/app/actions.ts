"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

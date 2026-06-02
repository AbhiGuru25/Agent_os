import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Data Models for Zynteq Agency
export type Lead = {
  id: string;
  name: string;
  business_name: string;
  industry: string;
  requirement: string;
  budget: string;
  phone: string;
  status: 'new' | 'researching' | 'proposal_ready' | 'contacted' | string;
  created_at: string;
}

export type Proposal = {
  id: string;
  lead_id: string;
  lead_name: string;
  title: string;
  content: string;
  price_estimate: string;
  status: 'draft' | 'approved' | 'sent';
  created_at: string;
}

export type Activity = {
  id: string;
  agent_name: string;
  action: string;
  created_at: string;
}

// Live Data Service fetching from your actual Zynteq Supabase Tables
export const mockData = {
  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      if (error || !data) {
        console.error("Supabase Error (leads table missing?):", error.message);
        return [];
      }
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  
  getProposals: async (): Promise<Proposal[]> => {
    try {
      const { data, error } = await supabase.from('agent_proposals').select('*').order('created_at', { ascending: false });
      
      if (error || !data) {
        console.error("Supabase Error (proposals table missing?):", error.message);
        return [];
      }
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  
  getActivities: async (): Promise<Activity[]> => {
    try {
      const { data, error } = await supabase.from('agent_activity').select('*').order('created_at', { ascending: false });
      
      if (error || !data) {
        console.error("Supabase Error (activities table missing?):", error.message);
        return [];
      }
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

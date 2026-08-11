import { mockData } from "@/lib/supabase";
import LeadTableClient from "@/components/LeadTableClient";

export default async function LeadsPage() {
  const leads = await mockData.getLeads();

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <LeadTableClient initialLeads={leads} />
    </div>
  );
}

import { mockData } from "@/lib/supabase";
import { ArrowLeft, User, Phone, Briefcase, Mail, Building, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import GenerateProposalButton from "@/components/GenerateProposalButton";

export default async function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const leads = await mockData.getLeads();
  const lead = leads.find(l => String(l.id) === String(id));

  if (!lead) {
    notFound();
  }

  // Find related data
  const proposals = await mockData.getProposals();
  const leadProposals = proposals.filter(p => p.lead_name === lead.name || p.lead_id === lead.id);
  
  const activities = await mockData.getActivities();
  // We'll just show the last 5 activities generically since we don't have a strict lead_id linking in activities
  // In a real app we'd query by lead_id
  const relatedActivities = activities.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Link href="/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Leads
        </Link>
        <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <User size={32} color="var(--accent-primary)" />
          {lead.name}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 700,
            background: lead.status === 'proposal_ready' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 197, 24, 0.1)',
            color: lead.status === 'proposal_ready' ? '#48BB78' : 'var(--accent-primary)'
          }}>
            {lead.status.replace('_', ' ').toUpperCase()}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Added {new Date(lead.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Left Column: Lead Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--text-secondary)" /> Client Profile
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Company</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={16} color="var(--accent-primary)" /> {lead.business_name || 'Not provided'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Industry</div>
                <div style={{ fontWeight: 600 }}>{lead.industry || 'Unknown'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Budget</div>
                <div style={{ fontWeight: 800, color: '#48BB78', fontSize: '1.1rem' }}>{lead.budget || 'Unknown'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Phone</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} color="var(--text-secondary)" /> {(lead as any).phone || 'No phone'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email</div>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="var(--text-secondary)" /> {(lead as any).email || 'No email'}
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Requirement / Notes</div>
                <div style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  {lead.requirement || 'No additional notes provided.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Proposals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--accent-primary)" /> Prepared Proposals
              </h3>
              <GenerateProposalButton leadId={lead.id} leadName={lead.name} requirement={lead.requirement} />
            </div>
            
            {leadProposals.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                No proposals generated for this lead yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leadProposals.map(proposal => (
                  <div key={proposal.id} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{proposal.title || 'Draft Proposal'}</h4>
                      <div style={{ fontWeight: 800, color: '#48BB78' }}>{proposal.price_estimate}</div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {proposal.content}
                    </div>
                    <Link href={`/proposals`} style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, borderRadius: '8px', fontSize: '0.85rem' }}>
                      Review in Proposals Tab
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--text-secondary)" /> Agent Activity Timeline
            </h3>
            <div style={{ position: 'relative', paddingLeft: '1rem' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {relatedActivities.map((activity, i) => (
                  <div key={activity.id} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: '-1.45rem', top: '0.2rem', width: '12px', height: '12px', borderRadius: '50%', background: i === 0 ? 'var(--accent-primary)' : 'var(--border-color)', border: '2px solid var(--bg-panel)' }}></div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{activity.action}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>By {activity.agent_name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      {new Date(activity.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

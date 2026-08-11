"use client";

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Zap, Briefcase, ChevronRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { setStandingDirective, getStandingDirective, getMarketingDrafts, approveMarketingDraft } from '../../actions';

export default function CEODashboard() {
  const [directive, setDirective] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [marketingQueue, setMarketingQueue] = useState<any[]>([]);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  const loadDashboardData = async () => {
    const standing = await getStandingDirective();
    if (standing !== "No standing directive set.") {
      setDirective(standing);
    }
    const drafts = await getMarketingDrafts();
    setMarketingQueue(drafts.filter((d: any) => d.status.includes('Review')));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateDirective = async () => {
    if (!directive) return;
    setIsPublishing(true);
    
    const result = await setStandingDirective(directive);
    
    setIsPublishing(false);
    
    if (result.success) {
      alert(`Standing Directive updated! The Background Cron will now execute this directive 24/7. (Initial Swarm triggered).`);
      loadDashboardData();
    } else {
      alert(`Failed to set directive.`);
    }
  };

  const handleApprove = async (id: string) => {
    setIsApproving(id);
    await approveMarketingDraft(id);
    setIsApproving(null);
    loadDashboardData();
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F5C518', boxShadow: '0 0 10px rgba(245, 197, 24, 0.5)' }}></div>
            CEO Office
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>High-level agency overview and executive approvals.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(245, 197, 24, 0.3)' }}>
            <Zap size={20} color="#F5C518" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#F5C518', textTransform: 'uppercase', letterSpacing: '1px' }}>Background Engine</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>ACTIVE 24/7</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Standing Directive */}
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #F5C518' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="#F5C518" />
              Standing Global Directive
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              This is the standing order for your agents. The Background Cron engine reads this directive every hour to execute autonomous intent hunting, lead generation, and content creation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                placeholder="e.g., We are pushing heavily into Voice AI for Real Estate agencies this week. Focus all outbound on high-end realtors in NY and LA."
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                style={{ 
                  width: '100%', 
                  minHeight: '120px',
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  color: 'white', 
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                onClick={handleUpdateDirective}
                disabled={isPublishing || !directive}
                style={{ 
                  alignSelf: 'flex-end',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.75rem 2rem', 
                  borderRadius: '12px', 
                  color: 'black', 
                  fontWeight: 800, 
                  background: 'linear-gradient(90deg, #F5C518 0%, #FF8C00 100%)', 
                  cursor: (isPublishing || !directive) ? 'not-allowed' : 'pointer', 
                  opacity: (isPublishing || !directive) ? 0.5 : 1,
                  boxShadow: '0 0 20px rgba(245, 197, 24, 0.2)' 
                }}
              >
                {isPublishing ? 'Updating Matrix...' : 'Update Standing Directive'}
              </button>
            </div>
          </div>

          {/* Department Status */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="var(--accent-primary)" />
              Agent Status Overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Sales Agent (Hunter)</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Background task active. Waiting for cron.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>Healthy</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 8px #8B5CF6' }}></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Marketing Agent (Content)</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Drafting posts pending approval...</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', borderColor: 'rgba(139, 92, 246, 0.2)' }}>Healthy</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Approvals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #EF4444' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
              <ShieldAlert size={20} />
              Executive Approvals
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Big tasks drafted by background agents require your signature before execution.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {marketingQueue.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                  Inbox Zero. No pending tasks.
                </div>
              ) : (
                marketingQueue.map(draft => (
                  <div key={draft.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={16} color="#F5C518" />
                        <span style={{ fontSize: '0.85rem', color: '#F5C518', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Action Required</span>
                      </div>
                      <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Approve {draft.platform} Post</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        "{draft.content.slice(0, 60)}..."
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApprove(draft.id)}
                      disabled={isApproving === draft.id}
                      style={{ width: '100%', padding: '0.75rem', background: '#EF4444', color: 'white', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {isApproving === draft.id ? 'Approving...' : 'Sign & Execute'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

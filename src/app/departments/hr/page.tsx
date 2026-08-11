"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle2, BookOpen, Clock, Activity, RefreshCw } from 'lucide-react';
import { getHRSOPs } from '../../actions';

export default function HRDashboard() {
  const [sops, setSops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSops = async () => {
    setIsLoading(true);
    const data = await getHRSOPs();
    setSops(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSops();
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}></div>
            HR & Operations
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Agent performance monitoring and internal SOP generation.</p>
        </div>
        <button 
          onClick={loadSops}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          className="hover:border-white/30"
        >
          {isLoading ? <Activity size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {isLoading ? 'Syncing...' : 'Sync Latest SOPs'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Agent Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #3B82F6' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#3B82F6" />
              Agent Performance Metrics
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Agent 1 */}
              <div>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                    Sales Agent (Hunter)
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>98% Uptime</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Tasks Completed: 1,245</span>
                  <span>Avg Response: 1.2s</span>
                </div>
              </div>

              {/* Agent 2 */}
              <div>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }}></div>
                    Marketing Agent
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>100% Uptime</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Posts Drafted: 34</span>
                  <span>Avg Response: 2.1s</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Internal SOPs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--text-secondary)" />
              Internal Knowledge Base (SOPs)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {sops.length === 0 ? (
                 <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No SOPs available.</div>
              ) : (
                sops.map(sop => (
                  <div key={sop.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.75rem', borderRadius: '8px' }}>
                      <BookOpen size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>{sop.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{sop.summary}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Autogenerated by HR Agent</div>
                    </div>
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

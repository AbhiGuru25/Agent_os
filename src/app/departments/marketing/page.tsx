"use client";

import React, { useState, useEffect } from 'react';
import { PenTool, Calendar, Share2, MessageSquare, Hash, Link, Check, Loader2, RefreshCw } from 'lucide-react';
import { getMarketingDrafts } from '../../actions';

export default function MarketingDashboard() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDrafts = async () => {
    setIsLoading(true);
    const data = await getMarketingDrafts();
    setDrafts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}></div>
            Marketing Dept
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Autonomous content generation and social media management.</p>
        </div>
        <button 
          onClick={loadDrafts}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-primary)',
            color: 'black',
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            boxShadow: '0 4px 15px rgba(245, 197, 24, 0.3)'
          }}
          className="hover:scale-105"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {isLoading ? 'Syncing...' : 'Sync Latest Drafts'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Drafts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #8B5CF6' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} color="#8B5CF6" />
              Latest AI Drafts
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {drafts.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No drafts available. Issue a directive in the CEO office!</div>
              ) : (
                drafts.map(draft => (
                  <div key={draft.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: draft.platform?.toLowerCase().includes('twitter') ? '#1DA1F2' : '#0A66C2', fontWeight: 600 }}>
                        {draft.platform?.toLowerCase().includes('twitter') ? <Hash size={18} /> : <Link size={18} />} 
                        {draft.platform}
                      </div>
                      <span className="badge" style={{ background: 'rgba(245, 197, 24, 0.1)', color: 'var(--accent-primary)' }}>{draft.status}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem 0', whiteSpace: 'pre-wrap' }}>
                      {draft.content}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'white', color: 'black', fontWeight: 600, border: 'none', cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        <Share2 size={16} /> Publish Now
                      </button>
                      <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', flex: 1 }}>
                        Edit Draft
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Active Campaigns */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--text-secondary)" />
              Content Calendar
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '0.5rem', borderRadius: '8px' }}>
                  <Check size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>"What is RAG?" Blog Post</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Published 2 days ago</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(245, 197, 24, 0.1)', color: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px' }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Real Estate Voice AI Case Study</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scheduled for Tomorrow, 9 AM</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '0.5rem', borderRadius: '8px' }}>
                  <PenTool size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>WhatsApp Bot Demo Video</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drafting in progress...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

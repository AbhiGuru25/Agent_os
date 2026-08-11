"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Target, Loader2, ShieldAlert, Crosshair, AlertTriangle } from 'lucide-react';
import { runCompetitorIntel, runIntentHunt, getIntelReports, getIntentTargets } from '../../actions';

export default function IntelDashboard() {
  const [intelUrl, setIntelUrl] = useState('');
  const [intentQuery, setIntentQuery] = useState('');
  
  const [isSpying, setIsSpying] = useState(false);
  const [isHunting, setIsHunting] = useState(false);
  
  const [reports, setReports] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);

  const loadData = async () => {
    const r = await getIntelReports();
    const t = await getIntentTargets();
    setReports(r);
    setTargets(t);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunIntel = async () => {
    if (!intelUrl) return;
    setIsSpying(true);
    const res = await runCompetitorIntel(intelUrl);
    setIsSpying(false);
    if (res.success) {
      setIntelUrl('');
      loadData();
    } else {
      alert("Spy failed: " + res.error);
    }
  };

  const handleRunHunt = async () => {
    if (!intentQuery) return;
    setIsHunting(true);
    const res = await runIntentHunt(intentQuery);
    setIsHunting(false);
    if (res.success) {
      setIntentQuery('');
      loadData();
    } else {
      alert("Hunt failed: " + res.error);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EC4899', boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)' }}></div>
            Strategy & Intel
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Competitor espionage and intent-based target hunting.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Mode A: Competitor X-Ray */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #EC4899' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={20} color="#EC4899" />
              Competitor X-Ray (Spy Agent)
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input 
                type="text" 
                placeholder="Enter competitor URL (e.g. https://xyz.com)" 
                value={intelUrl}
                onChange={(e) => setIntelUrl(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white' }}
              />
              <button 
                onClick={handleRunIntel}
                disabled={isSpying || !intelUrl}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#EC4899', color: 'white', fontWeight: 600, border: 'none', cursor: (isSpying || !intelUrl) ? 'not-allowed' : 'pointer', opacity: (isSpying || !intelUrl) ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {isSpying ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                Infiltrate
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reports.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No intelligence reports yet. Enter a URL above.</div>
              ) : (
                reports.map(report => (
                  <div key={report.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                    <div style={{ fontWeight: 700, color: '#EC4899', marginBottom: '1rem', fontSize: '1.1rem' }}>{report.url}</div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.25rem' }}>Core Offerings</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{report.offerings}</div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.25rem' }}>Pricing Strategy</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{report.pricing}</div>
                    </div>
                    
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontWeight: 600, marginBottom: '0.5rem' }}>
                        <ShieldAlert size={16} /> Identified Vulnerabilities
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#FECACA' }}>{report.vulnerabilities}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mode B: Intent Hunter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #10B981' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="#10B981" />
              Intent Hunter (Lead Radar)
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input 
                type="text" 
                placeholder="e.g. 'Looking for AI chatbot developers'" 
                value={intentQuery}
                onChange={(e) => setIntentQuery(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white' }}
              />
              <button 
                onClick={handleRunHunt}
                disabled={isHunting || !intentQuery}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#10B981', color: 'white', fontWeight: 600, border: 'none', cursor: (isHunting || !intentQuery) ? 'not-allowed' : 'pointer', opacity: (isHunting || !intentQuery) ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {isHunting ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
                Hunt Intent
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {targets.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No high-intent targets found yet. Run a hunt above.</div>
              ) : (
                targets.map(target => (
                  <div key={target.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{target.name}</div>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>{target.source}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginTop: '1rem' }}>
                      <AlertTriangle size={16} color="#F5C518" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "{target.intent_signal}"
                      </div>
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

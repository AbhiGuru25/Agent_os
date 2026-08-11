"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, X, Plus } from 'lucide-react';
import { autonomouslyFindLeads } from '../app/actions';
import { createPortal } from 'react-dom';

export default function FindNewLeadsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a search query.");
      return;
    }
    
    setIsFinding(true);
    const result = await autonomouslyFindLeads(query);
    setIsFinding(false);

    if (result.success) {
      setIsModalOpen(false);
      alert(`Successfully found and inserted ${result.count} new leads!`);
    } else {
      alert("Failed to find leads: " + result.error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        className="hover:scale-105 hover:border-white/30"
      >
        <Search size={18} />
        Find New Leads
      </button>

      {isModalOpen && mounted && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(8, 14, 26, 0.95)', border: '1px solid var(--border-color)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} color="var(--accent-primary)" />
                Autonomous Lead Discovery
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              Enter a target audience or niche (e.g., "Dental Clinics in Austin TX"). Firecrawl will search the web, and Groq will extract the companies as new targets.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Search Query</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Real Estate Agencies in Miami..."
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '12px', color: 'white', width: '100%', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleSearch}
                disabled={isFinding}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', width: '100%', justifyContent: 'center', borderRadius: '12px', color: 'black', fontWeight: 800, background: 'var(--accent-primary)', cursor: isFinding ? 'not-allowed' : 'pointer', opacity: isFinding ? 0.7 : 1, boxShadow: '0 0 20px rgba(245, 197, 24, 0.2)' }}
              >
                {isFinding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {isFinding ? 'Hunting Web...' : 'Find Targets'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

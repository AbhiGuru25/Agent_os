"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { generateAIProposal } from '../app/actions';
import { createPortal } from 'react-dom';

export default function GenerateProposalButton({ 
  leadId, 
  leadName, 
  requirement 
}: { 
  leadId: string, 
  leadName: string,
  requirement: string 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    if (!websiteUrl) {
      alert("Please enter a website URL for Firecrawl to scrape.");
      return;
    }
    
    setIsGenerating(true);
    const result = await generateAIProposal(leadId, leadName, requirement, websiteUrl);
    setIsGenerating(false);

    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert("Failed to generate proposal: " + result.error);
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
          padding: '0.5rem 1rem',
          background: 'rgba(245, 197, 24, 0.15)',
          color: 'var(--accent-primary)',
          fontWeight: 600,
          borderRadius: '8px',
          border: '1px solid var(--accent-primary)',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
        className="hover:scale-105 transition-all"
      >
        <Sparkles size={16} />
        Generate AI Proposal
      </button>

      {isModalOpen && mounted && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(8, 14, 26, 0.95)', border: '1px solid var(--border-color)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--accent-primary)" />
                AI Proposal Generator
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              Enter the client's business website. <strong>Firecrawl</strong> will scrape the entire site and the <strong>Groq LLM</strong> will use that context to draft a highly personalized AI integration proposal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Business Website URL</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="url" 
                  placeholder="https://example.com"
                  value={websiteUrl} 
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '12px', color: 'white', width: '100%', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', width: '100%', justifyContent: 'center', borderRadius: '12px', color: 'black', fontWeight: 800, background: 'var(--accent-primary)', cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating ? 0.7 : 1, boxShadow: '0 0 20px rgba(245, 197, 24, 0.2)' }}
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? 'Scraping & Generating...' : 'Generate with Groq'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

"use client";

import React, { useState } from 'react';
import { Target, Loader2 } from 'lucide-react';

export default function OutboundButton() {
  const [isFiring, setIsFiring] = useState(false);

  const handleFireCampaign = async () => {
    setIsFiring(true);
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_OUTBOUND_WEBHOOK_URL || 'http://localhost:5678/webhook/zynteq-outbound-campaign';
      
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual_agent_os' })
      });
      
      if (!res.ok) throw new Error('Failed to trigger campaign');
      
      // Wait a moment for n8n to process and insert to Supabase, then refresh
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Error triggering campaign. Check if n8n is active.');
      setIsFiring(false);
    }
  };

  return (
    <button 
      onClick={handleFireCampaign}
      disabled={isFiring}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(90deg, #F5C518 0%, #FF8C00 100%)',
        color: 'black',
        fontWeight: 700,
        borderRadius: '20px',
        border: 'none',
        cursor: isFiring ? 'not-allowed' : 'pointer',
        opacity: isFiring ? 0.7 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(245, 197, 24, 0.3)'
      }}
      className="hover:scale-105"
    >
      {isFiring ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
      {isFiring ? 'Hunting Leads...' : 'Initiate Outbound Campaign'}
    </button>
  );
}

"use client";

import React from 'react';
import { Target, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SalesDashboard() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
            Sales Dept (The Closer)
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Lead generation, outbound campaigns, and AI proposals.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        
        <Link href="/leads" style={{ textDecoration: 'none' }}>
          <div className="glass-panel hover:scale-105" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)', transition: 'transform 0.2s', cursor: 'pointer' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
              <Target size={48} color="#10B981" />
            </div>
            <h2 style={{ color: 'white', margin: 0 }}>Lead Hunter Hub</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
              Access the Autonomous Lead Discovery engine and manage your outbound pipeline.
            </p>
            <div style={{ marginTop: '1rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              Open Hub <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        <Link href="/proposals" style={{ textDecoration: 'none' }}>
          <div className="glass-panel hover:scale-105" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', border: '1px solid rgba(245, 197, 24, 0.2)', transition: 'transform 0.2s', cursor: 'pointer' }}>
            <div style={{ background: 'rgba(245, 197, 24, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
              <Users size={48} color="var(--accent-primary)" />
            </div>
            <h2 style={{ color: 'white', margin: 0 }}>Proposal Generator</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
              Review AI-drafted proposals before approving them for sending via n8n.
            </p>
            <div style={{ marginTop: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              Review Drafts <ArrowRight size={16} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}

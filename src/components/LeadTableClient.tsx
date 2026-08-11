"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import OutboundButton from '../app/leads/OutboundButton';
import FindNewLeadsButton from './FindNewLeadsButton';
import { Lead } from '@/lib/supabase';

export default function LeadTableClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = initialLeads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.business_name?.toLowerCase().includes(searchLower) ||
      lead.industry?.toLowerCase().includes(searchLower) ||
      lead.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex-between">
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Leads & Targets</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage incoming leads and autonomous outbound targets.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FindNewLeadsButton />
          <OutboundButton />
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '20px', 
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                width: '300px'
              }} 
            />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Business</th>
              <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Budget</th>
              <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-row">
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>
                  {lead.name}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>{lead.phone}</div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  {lead.business_name}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lead.industry}</div>
                </td>
                <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{lead.budget}</td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    background: lead.status === 'outbound_draft' ? 'rgba(239, 68, 68, 0.1)' : lead.status === 'proposal_ready' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 197, 24, 0.1)',
                    color: lead.status === 'outbound_draft' ? '#EF4444' : lead.status === 'proposal_ready' ? '#48BB78' : 'var(--accent-primary)'
                  }}>
                    {lead.status === 'outbound_draft' ? 'OUTBOUND TARGET' : lead.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                  <Link href={`/leads/${lead.id}`} style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                    View Profile &rarr;
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No leads match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Lead } from '@/lib/supabase';

export default function DashboardCharts({ leads }: { leads: Lead[] }) {
  const chartData = useMemo(() => {
    // Group leads by date (simple implementation for the last 7 days)
    const dataMap: Record<string, number> = {};
    
    // Initialize the last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dataMap[dateStr] = 0;
    }

    leads.forEach(lead => {
      const d = new Date(lead.created_at);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dataMap[dateStr] !== undefined) {
        dataMap[dateStr]++;
      } else {
        // If it's an older date not in our 7-day window, we can optionally add it or ignore it.
        // We'll just ignore it for this simple chart.
      }
    });

    return Object.keys(dataMap).map(key => ({
      name: key,
      Leads: dataMap[key]
    }));
  }, [leads]);

  return (
    <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1', marginBottom: '2rem' }}>
      <h3 style={{ margin: '0 0 1.5rem 0' }}>Lead Acquisition (Last 7 Days)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="Leads" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { mockData } from "@/lib/supabase";
import { CheckCircle2, Clock } from "lucide-react";

export default async function ActivityPage() {
  const activities = await mockData.getActivities();

  return (
    <div className="space-y-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Agent Activity Timeline</h1>
        <p style={{ color: 'var(--text-muted)' }}>An audit log of all autonomous actions taken by the Zynteq AI Workforce.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
        <div style={{ position: 'relative', borderLeft: '2px solid var(--border-color)', marginLeft: '1rem', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {activities.map((activity, idx) => (
            <div key={activity.id} style={{ position: 'relative' }}>
              {/* Timeline dot */}
              <div style={{ position: 'absolute', left: '-2.7rem', top: '0.2rem', width: '1.2rem', height: '1.2rem', background: 'var(--accent-primary)', borderRadius: '50%', border: '4px solid var(--bg-card)' }}></div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 800 }}>
                    <CheckCircle2 size={16} />
                    {activity.agent_name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activity.action}
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}

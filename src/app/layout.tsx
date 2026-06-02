import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Activity } from "lucide-react";
import RealtimeSubscriber from "@/components/RealtimeSubscriber";

export const metadata: Metadata = {
  title: "Agent OS | Command Center",
  description: "Autonomous AI Workforce Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RealtimeSubscriber />
        <div className="dashboard-layout animate-fade-in">
          {/* Sidebar */}
          <aside className="sidebar">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8 }}></div>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Agent OS</h2>
              </div>
              
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/" className="nav-link">
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link href="/leads" className="nav-link">
                  <Users size={20} />
                  Leads
                  <span className="badge" style={{ marginLeft: 'auto' }}>3 New</span>
                </Link>
                <Link href="/proposals" className="nav-link">
                  <FileText size={20} />
                  Proposals
                </Link>
                <Link href="/activity" className="nav-link">
                  <Activity size={20} />
                  Activity Log
                </Link>
              </nav>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white' }}></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Abhi Virani</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CEO</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content Area */}
          <main className="main-content">
            <header className="top-header flex-between">
              <h3 style={{ margin: 0, fontWeight: 600, color: 'var(--text-secondary)' }}>Zynteq AI Workforce</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last synced: Just now</div>
                <button className="badge" style={{ padding: '0.5rem 1rem' }}>Connected</button>
              </div>
            </header>
            
            <div className="page-content">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

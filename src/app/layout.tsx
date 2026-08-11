import type { Metadata } from "next";
import "./globals.css";
import RealtimeSubscriber from "@/components/RealtimeSubscriber";
import Sidebar from "@/components/Sidebar";

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
          
          <Sidebar />
          
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

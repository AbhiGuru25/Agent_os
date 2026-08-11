import type { Metadata } from "next";
import "./globals.css";
import RealtimeSubscriber from "@/components/RealtimeSubscriber";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Zynteq | Autonomous AI Workforce Dashboard",
  description: "Zynteq offers premium AI automation and autonomous workforce agents for scaling businesses across all industries globally.",
  keywords: ["AI Automation", "Zynteq", "Autonomous Workforce", "AI Agency", "Agent OS", "Business Automation", "AI Agents", "Lead Generation", "SEO", "Global AI"],
  authors: [{ name: "Zynteq" }],
  openGraph: {
    title: "Zynteq | Autonomous AI Workforce Dashboard",
    description: "Scale your business with Zynteq's elite autonomous AI workforce.",
    url: "https://agent-os-neon.vercel.app",
    siteName: "Zynteq Agent OS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zynteq | Autonomous AI Workforce Dashboard",
    description: "Scale your business with Zynteq's elite autonomous AI workforce.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

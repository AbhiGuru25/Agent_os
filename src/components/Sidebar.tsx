"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Activity, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent-primary)', borderRadius: 6 }}></div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Agent OS</h3>
        </div>
        <button onClick={toggleSidebar} style={{ color: 'var(--text-primary)' }}>
          <Menu size={24} />
        </button>
      </header>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 45, backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Desktop Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', position: 'relative' }}>
            <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8 }}></div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Agent OS</h2>
            {/* Close button inside drawer for mobile */}
            <button 
              onClick={closeSidebar} 
              style={{ position: 'absolute', right: 0, display: 'none' }} // Hidden on desktop, shown via CSS or just keep it simple
              className="mobile-close-btn"
            >
              <X size={24} color="var(--text-secondary)" />
            </button>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', padding: '1rem 1rem 0.5rem 1rem' }}>Overview</div>
            <Link href="/" onClick={closeSidebar} className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/leads" onClick={closeSidebar} className={`nav-link ${pathname === '/leads' ? 'active' : ''}`}>
              <Users size={20} />
              Leads
              <span className="badge" style={{ marginLeft: 'auto' }}>3 New</span>
            </Link>
            <Link href="/proposals" onClick={closeSidebar} className={`nav-link ${pathname === '/proposals' ? 'active' : ''}`}>
              <FileText size={20} />
              Proposals
            </Link>
            <Link href="/activity" onClick={closeSidebar} className={`nav-link ${pathname === '/activity' ? 'active' : ''}`}>
              <Activity size={20} />
              Activity Log
            </Link>

            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', padding: '1.5rem 1rem 0.5rem 1rem' }}>Departments</div>
            <Link href="/departments/ceo" onClick={closeSidebar} className={`nav-link ${pathname === '/departments/ceo' ? 'active' : ''}`}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F5C518' }}></div>
              CEO Office
            </Link>
            <Link href="/departments/sales" onClick={closeSidebar} className={`nav-link ${pathname === '/departments/sales' ? 'active' : ''}`}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
              Sales Dept
            </Link>
            <Link href="/departments/marketing" onClick={closeSidebar} className={`nav-link ${pathname === '/departments/marketing' ? 'active' : ''}`}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }}></div>
              Marketing
            </Link>
            <Link href="/departments/hr" onClick={closeSidebar} className={`nav-link ${pathname === '/departments/hr' ? 'active' : ''}`}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></div>
              HR & Ops
            </Link>
            <Link href="/departments/intel" onClick={closeSidebar} className={`nav-link ${pathname === '/departments/intel' ? 'active' : ''}`}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EC4899' }}></div>
              Strategy & Intel
            </Link>
          </nav>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white' }}></div>
              <div>
                <div style={{ fontWeight: 600 }}>Abhi Virani</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CEO</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .mobile-close-btn { display: block !important; }
        }
      `}} />
    </>
  );
}

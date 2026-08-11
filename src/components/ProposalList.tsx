"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Send, Edit3, X, CheckCircle, Loader2 } from "lucide-react";
import { updateProposal, approveAndSendProposal } from "@/app/actions";
import type { Proposal } from "@/lib/supabase";

export default function ProposalList({ initialProposals }: { initialProposals: Proposal[] }) {
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditClick = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setTitle(proposal.title || "");
    setContent(proposal.content || "");
    setPrice(proposal.price_estimate || "");
  };

  const handleSave = async () => {
    if (!editingProposal) return;
    setIsSaving(true);
    await updateProposal(editingProposal.id, title, content, price);
    setIsSaving(false);
    setEditingProposal(null);
  };

  const handleApprove = async (id: string) => {
    setIsApproving(id);
    await approveAndSendProposal(id);
    setIsApproving(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {initialProposals.map(proposal => (
        <div key={proposal.id} className="glass-panel glow-effect" style={{ padding: '2.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Prepared for {proposal.lead_name}
              </div>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{proposal.title || "Untitled Proposal"}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Estimated Price</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#48BB78', fontFamily: 'var(--font-display)' }}>
                {proposal.price_estimate || "₹0"}
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '2.5rem' }}>
            {proposal.content ? proposal.content.replace(/\\n/g, '\n') : "No content generated."}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', alignItems: 'center' }}>
            
            {proposal.status === 'approved' && (
              <div style={{ color: '#48BB78', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginRight: 'auto' }}>
                <CheckCircle size={20} />
                Approved & Sent
              </div>
            )}
            
            <button 
              onClick={() => handleEditClick(proposal)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
            >
              <Edit3 size={16} />
              Edit
            </button>
            <button 
              onClick={() => handleApprove(proposal.id)}
              disabled={isApproving === proposal.id}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', borderRadius: '12px', color: 'black', fontWeight: 800, background: 'var(--accent-primary)', boxShadow: 'var(--shadow-glow)', cursor: 'pointer', opacity: isApproving === proposal.id ? 0.7 : 1 }}
            >
              {isApproving === proposal.id ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {proposal.status === 'approved' ? 'Resend' : 'Approve & Send via WhatsApp'}
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingProposal && mounted ? createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(8, 14, 26, 0.95)', border: '1px solid var(--border-color)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Edit Proposal</h2>
              <button onClick={() => setEditingProposal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Proposal Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', width: '100%', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Price Estimate</label>
              <input 
                type="text" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', width: '100%', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Proposal Content</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', width: '100%', minHeight: '300px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, fontSize: '1.05rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={() => setEditingProposal(null)}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', borderRadius: '12px', color: 'black', fontWeight: 800, background: 'var(--accent-primary)', cursor: 'pointer', boxShadow: '0 0 20px rgba(245, 197, 24, 0.2)' }}
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

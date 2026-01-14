"use client";
import { EditSquare, ExpandMore, NoteAdd, Send } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const ProposalPanel = ({
  proposalContext,
  onClearContext,
  dealId,
  documentId,
  sectionId,
  onProposalCreated,
}: {
  proposalContext?: string | null;
  onClearContext?: () => void;
  dealId?: string;
  documentId?: string;
  sectionId?: string | null;
  onProposalCreated?: () => void;
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    proposedText: "",
  });

  useEffect(() => {
    if (proposalContext && sectionId) {
      setFormOpen(true);
      setSelectedProposal(null);
    } else {
      setFormOpen(false);
      setSelectedProposal(null);
    }
  }, [proposalContext, sectionId]);

  useEffect(() => {
    if (dealId && !formOpen) {
      fetchProposals();
      setSelectedProposal(null);
    }
  }, [dealId, formOpen]);

  const fetchProposals = async () => {
    if (!dealId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/proposals?id=${dealId}`);
      const data = await response.json();
      if (response.ok) {
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealId || !documentId || !sectionId) return;

    setLoading(true);
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: dealId,
          document_id: documentId,
          section_id: sectionId,
          title: formData.title,
          summary: formData.summary,
          proposed_text: formData.proposedText,
        }),
      });

      if (response.ok) {
        setFormOpen(false);
        setFormData({ title: "", summary: "", proposedText: "" });
        onClearContext?.();
        onProposalCreated?.();
        fetchProposals();
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  return formOpen ? (
    <div className="bg-slate-50 flex flex-col overflow-hidden flex-1">
      <div className="p-4 bg-blue-50/50 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold uppercase text-[10px] text-slate-400">
            Current Text:
          </span>
        </div>
        <p className="text-[11px] text-[#64748b] italic">
          {proposalContext || '"...excluding any restructuring costs incurred during such period;"'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="space-y-2">
          <label htmlFor="proposedText" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Proposed Text <span className="text-red-500 text-[14px]">*</span>
          </label>
          <textarea
            name="proposedText"
            id="proposedText"
            value={formData.proposedText}
            onChange={(e) => setFormData({ ...formData, proposedText: e.target.value })}
            rows={4}
            required
            placeholder="Suggest your amendment here..."
            className="w-full p-4 bg-white border border-[#e2e8f0] rounded-lg text-sm leading-relaxed text-[#1e293b] focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
          ></textarea>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="title" className="font-bold text-gray-500 uppercase tracking-wider text-[11px]">
            Proposal Title <span className="text-red-500 text-[14px]">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Summarize your proposal"
            className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded text-sm focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="summary" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Rationale
          </label>
          <textarea
            name="summary"
            id="summary"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="Explain the reasoning..."
            className="w-full h-20 px-3 py-2 bg-white border border-[#e2e8f0] rounded text-sm focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
          ></textarea>
        </div>
      </form>
      <div className="p-4 border-t border-[#e2e8f0] bg-white flex gap-3">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm font-bold text-white bg-violet-500 hover:bg-violet-800 rounded shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
        <button
          type="button"
          onClick={() => {
            setFormOpen(false);
            onClearContext?.();
          }}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-200 rounded transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0f172a]">Proposals ({proposals.length})</h3>
        <button
          onClick={() => setFormOpen(true)}
          className="px-3 py-1 text-xs font-bold text-violet-500 hover:bg-violet-50 rounded transition-all"
        >
          + New Proposal
        </button>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="flex-1 flex-col text-center bg-slate-50 flex items-center justify-center p-12">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] flex items-center justify-center mb-6">
            <span className="font-extralight text-[40px]">
              <NoteAdd fontSize="inherit" />
            </span>
          </div>
          <h3 className="font-bold text-lg text-[#0f172a] mb-2">No proposals yet</h3>
          <p className="leading-relaxed mb-8 text-[13px] text-[#64748b]">
            Select a clause in the document to propose a change and start the negotiation
          </p>
        </div>
      ) : selectedProposal ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-[#e2e8f0]">
            <button
              onClick={() => setSelectedProposal(null)}
              className="text-xs text-violet-500 hover:text-violet-700 mb-3 flex items-center gap-1"
            >
              ← Back to all proposals
            </button>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-base text-[#0f172a]">{selectedProposal.title}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                selectedProposal.status === "accepted" ? "bg-green-100 text-green-600" :
                selectedProposal.status === "rejected" ? "bg-red-100 text-red-600" :
                "bg-blue-100 text-blue-600"
              }`}>{selectedProposal.status}</span>
            </div>
            {selectedProposal.summary && (
              <p className="text-sm text-[#64748b] mb-3">{selectedProposal.summary}</p>
            )}
            <div className="text-xs text-gray-400 mb-3">
              Proposed by {selectedProposal.author?.first_name} {selectedProposal.author?.last_name}
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Proposed Text:</p>
              <p className="text-sm text-[#0f172a]">{selectedProposal.proposed_text}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              onClick={() => setSelectedProposal(proposal)}
              className="bg-white border border-[#e2e8f0] rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-sm text-[#0f172a]">{proposal.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  proposal.status === "accepted" ? "bg-green-100 text-green-600" :
                  proposal.status === "rejected" ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                }`}>{proposal.status}</span>
              </div>
              {proposal.summary && (
                <p className="text-xs text-[#64748b] mb-2">{proposal.summary}</p>
              )}
              <div className="text-[10px] text-gray-400">
                Proposed by {proposal.author?.first_name} {proposal.author?.last_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalPanel;

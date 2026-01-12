"use client";

import React, { useState, useEffect } from "react";
import {
  Close,
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
  Comment,
  ExpandMore,
  ExpandLess,
  Send,
} from "@mui/icons-material";
import { Proposal, ProposalComment } from "@/lib/types/proposals";

interface ProposalPanelProps {
  dealId: string;
  userRole?: string;
  onClose?: () => void;
  onProposalSelect?: (proposalId: string) => void;
  onProposalAccepted?: () => void; // Callback when a proposal is accepted
}

const ProposalPanel: React.FC<ProposalPanelProps> = ({
  dealId,
  userRole,
  onClose,
  onProposalSelect,
  onProposalAccepted,
}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [expandedEdits, setExpandedEdits] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, [dealId]);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/proposals?dealId=${dealId}`);
      const data = await response.json();
      if (response.ok) {
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProposalDetails = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedProposal(data.proposal);
      }
    } catch (error) {
      console.error("Error fetching proposal details:", error);
    }
  };

  const handleProposalAction = async (
    proposalId: string,
    action: "submit" | "review" | "accept" | "reject",
    reviewComments?: string
  ) => {
    try {
      setActionInProgress(true);
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, review_comments: reviewComments }),
      });

      if (response.ok) {
        const data = await response.json();

        // If proposal was accepted, notify parent to refresh document
        if (action === "accept" && onProposalAccepted) {
          onProposalAccepted();
        }

        await fetchProposals();
        if (selectedProposal?.id === proposalId) {
          await fetchProposalDetails(proposalId);
        }

        // Show success message for acceptance
        if (action === "accept") {
          alert("Proposal accepted! The document has been updated.");
        }
      } else {
        const data = await response.json();
        alert(data.error || "Error performing action");
      }
    } catch (error) {
      console.error("Error performing proposal action:", error);
      alert("Error performing action");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedProposal || !commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await fetch(
        `/api/proposals/${selectedProposal.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentText }),
        }
      );

      if (response.ok) {
        setCommentText("");
        await fetchProposalDetails(selectedProposal.id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const toggleEditExpansion = (editId: string) => {
    const newExpanded = new Set(expandedEdits);
    if (newExpanded.has(editId)) {
      newExpanded.delete(editId);
    } else {
      newExpanded.add(editId);
    }
    setExpandedEdits(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
      submitted: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
      in_review: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "In Review",
      },
      accepted: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Accepted",
      },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
      superseded: {
        bg: "bg-gray-100",
        text: "text-gray-500",
        label: "Superseded",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const canReview = userRole === "Arranger Counsel" || userRole === "Admin";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (selectedProposal) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-indigo-50">
          <div className="flex items-start justify-between mb-3">
            <button
              onClick={() => setSelectedProposal(null)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to proposals
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-indigo-100 rounded transition-colors"
              >
                <Close fontSize="small" />
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {selectedProposal.title}
          </h2>
          <div className="flex items-center gap-2 mb-2">
            {getStatusBadge(selectedProposal.status)}
            <span className="text-xs text-gray-500">
              by {selectedProposal.author?.first_name}{" "}
              {selectedProposal.author?.last_name}
            </span>
          </div>
          {selectedProposal.summary && (
            <p className="text-sm text-gray-600">{selectedProposal.summary}</p>
          )}
        </div>

        {/* Edits */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Proposed Changes ({selectedProposal.edits?.length || 0})
          </h3>
          <div className="space-y-3">
            {selectedProposal.edits?.map((edit) => (
              <div
                key={edit.id}
                className="bg-gray-50 border border-gray-200 rounded overflow-hidden"
              >
                <div
                  className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleEditExpansion(edit.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="text-sm font-semibold text-indigo-700">
                        Section {edit.section_id}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {edit.action} · {edit.category}
                      </div>
                    </div>
                    {expandedEdits.has(edit.id) ? (
                      <ExpandLess fontSize="small" className="text-gray-400" />
                    ) : (
                      <ExpandMore fontSize="small" className="text-gray-400" />
                    )}
                  </div>
                  {!expandedEdits.has(edit.id) && (
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {edit.proposed_text.substring(0, 100)}...
                    </div>
                  )}
                </div>
                {expandedEdits.has(edit.id) && (
                  <div className="p-3 pt-0 border-t border-gray-200 space-y-2">
                    <div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Original:
                      </div>
                      <div className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                        {edit.original_text}
                      </div>
                    </div>
                    {edit.action !== "delete" && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Proposed:
                        </div>
                        <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                          {edit.proposed_text}
                        </div>
                      </div>
                    )}
                    {edit.rationale && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Rationale:
                        </div>
                        <div className="text-sm text-gray-600 italic">
                          {edit.rationale}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comments */}
          {selectedProposal.status !== "draft" && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Comment fontSize="small" />
                Comments
              </h3>
              <div className="space-y-3 mb-3">
                {(selectedProposal as any).proposal_comments?.map((comment: ProposalComment) => (
                  <div key={comment.id} className="bg-gray-50 rounded p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Person fontSize="small" className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {comment.user?.first_name} {comment.user?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send fontSize="small" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {selectedProposal.status !== "accepted" &&
          selectedProposal.status !== "rejected" && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
              {canReview && selectedProposal.status === "submitted" && (
                <>
                  <button
                    onClick={() => handleProposalAction(selectedProposal.id, "accept")}
                    disabled={actionInProgress}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle fontSize="small" />
                    Accept Proposal
                  </button>
                  <button
                    onClick={() => {
                      const comments = prompt("Reason for rejection (optional):");
                      handleProposalAction(
                        selectedProposal.id,
                        "reject",
                        comments || undefined
                      );
                    }}
                    disabled={actionInProgress}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Cancel fontSize="small" />
                    Reject Proposal
                  </button>
                </>
              )}
            </div>
          )}
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 bg-indigo-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Proposals</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-indigo-100 rounded transition-colors"
            >
              <Close fontSize="small" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No proposals yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                onClick={() => fetchProposalDetails(proposal.id)}
                className="bg-gray-50 border border-gray-200 rounded p-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
                    {proposal.title}
                  </h3>
                  {getStatusBadge(proposal.status)}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  <Person fontSize="inherit" className="inline mr-1" />
                  {proposal.author?.first_name} {proposal.author?.last_name}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{proposal.edits?.length || 0} changes</span>
                  <span>
                    <AccessTime fontSize="inherit" className="inline mr-1" />
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPanel;

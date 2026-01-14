"use client";
import { Close, ExpandMore, Search, Warning, CheckCircle } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const IssuesPanel = ({
  issueContext,
  onClearContext,
  dealId,
  documentId,
  sectionId,
  onIssueCreated,
  userRole,
}: {
  issueContext?: string | null;
  onClearContext?: () => void;
  dealId?: string;
  documentId?: string;
  sectionId?: string | null;
  onIssueCreated?: () => void;
  userRole?: string;
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Ambiguity",
    priority: "Medium",
  });

  const canResolve = userRole === "arranger_counsel";

  useEffect(() => {
    if (issueContext && sectionId) {
      const existingIssue = issues.find((i) => i.section_id === sectionId);
      if (existingIssue) {
        setSelectedIssue(existingIssue);
        setFormOpen(false);
      } else {
        setFormOpen(true);
        setSelectedIssue(null);
      }
    } else {
      setFormOpen(false);
      setSelectedIssue(null);
    }
  }, [issueContext, sectionId, issues]);

  useEffect(() => {
    if (dealId && !formOpen) {
      fetchIssues();
      setSelectedIssue(null);
    }
  }, [dealId, formOpen]);

  const fetchIssues = async () => {
    if (!dealId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/issues?id=${dealId}`);
      const data = await response.json();
      if (response.ok) {
        setIssues(data.issues || []);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealId || !documentId || !sectionId) return;

    setLoading(true);
    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: dealId,
          document_id: documentId,
          section_id: sectionId,
          clause_ref: issueContext || "",
          title: formData.title,
          description: formData.description,
          priority: formData.priority.toLowerCase(),
        }),
      });

      if (response.ok) {
        setFormOpen(false);
        setFormData({ title: "", description: "", type: "Ambiguity", priority: "Medium" });
        onClearContext?.();
        onIssueCreated?.();
        fetchIssues();
      }
    } catch (error) {
      console.error("Error creating issue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (issueId: string, status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolution_notes: resolutionNotes }),
      });

      if (response.ok) {
        setResolutionNotes("");
        setSelectedIssue(null);
        fetchIssues();
      }
    } catch (error) {
      console.error("Error resolving issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return formOpen ? (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="p-4 bg-blue-50/50 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold uppercase text-[10px] text-slate-400">
            Context:
          </span>
        </div>
        <p className="text-[11px] text-[#64748b] italic">
          {issueContext ||
            '"...excluding any restructuring costs incurred during such period;"'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
          >
            Issue Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Summarize the issue in a few words"
            required
            className="w-full px-3 py-2 text-sm bg-gray-50  border border-gray-200 rounded-md focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-shadow text-[#1e293b]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="type"
              className="uppercase tracking-wide text-slate-500 font-bold text-[11px]"
            >
              Type
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50  border border-gray-200  rounded-md focus:ring-1 focus:ring-violet-500 outline-none text-text-main"
              >
                <option>Ambiguity</option>
                <option>Risk</option>
                <option>Missing</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-gray-400">
                <ExpandMore fontSize="inherit" />
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="priority"
              className="font-bold text-slate-500 uppercase tracking-wide text-[11px]"
            >
              Priority
            </label>
            <div className="relative">
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50  border border-gray-200  rounded-md focus:ring-1 focus:ring-violet-500 outline-none text-text-main"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-gray-400">
                <ExpandMore fontSize="inherit" />
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-shadow text-[#1e293b] resize-none"
            placeholder="Detailed context and rationale...."
            rows={4}
          ></textarea>
        </div>
      </form>
      <div className="p-4 border-t border-[#e2e8f0] bg-gray-50 flex gap-3">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm font-bold text-white bg-violet-500 hover:bg-violet-800 rounded shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : "Raise Issue"}
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
        <h3 className="text-sm font-bold text-[#0f172a]">Issues ({issues.length})</h3>
        <button
          onClick={() => setFormOpen(true)}
          className="px-3 py-1 text-xs font-bold text-violet-500 hover:bg-violet-50 rounded transition-all"
        >
          + New Issue
        </button>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      ) : issues.length === 0 ? (
        <div className="flex-1 flex items-center flex-col text-center justify-center p-12">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-[#e2e8f0] shadow-sm mb-6">
            <span className="text-slate-300 text-[32px]">
              <Warning fontSize="inherit" />
            </span>
          </div>
          <h3 className="font-bold text-lg text-[#0f172a] mb-2">All clear</h3>
          <p className="leading-relaxed mb-8 text-[13px] text-[#64748b]">
            No issues have been raised on this contract yet. Select a clause in the
            document to flag ambiguities or missing information
          </p>
        </div>
      ) : selectedIssue ? (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-[#e2e8f0]">
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-xs text-violet-500 hover:text-violet-700 mb-3 flex items-center gap-1"
              >
                ← Back to all issues
              </button>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-base text-[#0f172a]">{selectedIssue.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  selectedIssue.priority === "high" ? "bg-red-100 text-red-600" :
                  selectedIssue.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                  "bg-gray-100 text-gray-600"
                }`}>{selectedIssue.priority}</span>
              </div>
              <div className="mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  selectedIssue.status === "legally_final" ? "bg-green-100 text-green-600" :
                  selectedIssue.status === "commercially_agreed" ? "bg-blue-100 text-blue-600" :
                  selectedIssue.status === "under_negotiation" ? "bg-yellow-100 text-yellow-600" :
                  "bg-gray-100 text-gray-600"
                }`}>{selectedIssue.status?.replace(/_/g, " ")}</span>
              </div>
              {selectedIssue.description && (
                <p className="text-sm text-[#64748b] mb-3">{selectedIssue.description}</p>
              )}
              <div className="text-xs text-gray-400">
                Created by {selectedIssue.created_by?.first_name} {selectedIssue.created_by?.last_name}
              </div>
            </div>
            <div className="flex-1 p-4 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Discussion</h4>
              <div className="text-sm text-gray-500 text-center py-8">
                No comments yet. Start the discussion.
              </div>
            </div>
          </div>
          {canResolve && selectedIssue.status !== "legally_final" && (
            <div className="p-4 border-t border-[#e2e8f0] bg-slate-50">
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                Resolution Notes (Optional)
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add notes about the resolution..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded mb-3 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolve(selectedIssue.id, "under_negotiation")}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-yellow-600 hover:bg-yellow-700 rounded shadow-sm transition-all disabled:opacity-50"
                >
                  Under Negotiation
                </button>
                <button
                  onClick={() => handleResolve(selectedIssue.id, "commercially_agreed")}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-all disabled:opacity-50"
                >
                  Commercially Agreed
                </button>
                <button
                  onClick={() => handleResolve(selectedIssue.id, "legally_final")}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-sm transition-all disabled:opacity-50"
                >
                  <CheckCircle fontSize="small" />
                  Resolve
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="bg-white border border-[#e2e8f0] rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-sm text-[#0f172a]">{issue.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  issue.priority === "high" ? "bg-red-100 text-red-600" :
                  issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
                  "bg-gray-100 text-gray-600"
                }`}>{issue.priority}</span>
              </div>
              {issue.description && (
                <p className="text-xs text-[#64748b] mb-2">{issue.description}</p>
              )}
              <div className="text-[10px] text-gray-400">
                Created by {issue.created_by?.first_name} {issue.created_by?.last_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesPanel;

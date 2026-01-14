"use client";
import { EditSquare, ExpandMore, NoteAdd, Send } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const ProposalPanel = ({
  proposalContext,
  onClearContext,
}: {
  proposalContext?: string | null;
  onClearContext?: () => void;
}) => {
  const [formOpen, setFormOpen] = useState(true);

  useEffect(() => {
    if (proposalContext) {
      setFormOpen(true);
    }
  }, [proposalContext]);
  return formOpen ? (
    <div className="bg-slate-50 flex flex-col overflow-hidden flex-1">
      <form className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="originalText"
              className="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
            >
              Current Text:
            </label>
            <div className="p-4 bg-gray-100/80 border border-gray-200 rounded-lg text-xs leading-relaxed text-[#64748b] font-serif italic select-none">
              {proposalContext ||
                '"excluding any restructuring costs incurred during such period;"'}
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="proposedText"
              className="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
            >
              Proposed Text
              <span className="text-red-500 text-[14px]"> *</span>
            </label>
            <div className="relative group">
              <textarea
                name="proposedText"
                id="proposedText"
                rows={4}
                required
                placeholder="Suggest your amendment here..."
                className="w-full h-32 p-4 bg-white border border-[#e2e8f0] rounded-lg text-sm leading-relaxed text-[#1e293b] font-serif focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none shadow-sm"
              ></textarea>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-gray-400">
                  Press Cmd+Enter to save
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 text-[11px]"
            >
              Proposal Title
              <span className="text-red-500 text-[14px]">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              id="title"
              placeholder="Summarize your proposal in a few words"
              className="w-full px-3 placeholder:italic placeholder:text-gray-300 py-2 bg-white border border-[#e2e8f0] rounded text-sm focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
            />
          </div>
          <div className="space-1.5">
            <label
              className="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
              htmlFor="rationale"
            >
              Rationale
              <span className="text-red-500 text-[14px]"> *</span>
            </label>
            <textarea
              name="rationale"
              id="rationale"
              placeholder="Explain the reasoning behind your proposal..."
              className="w-full h-20 placeholder:italic placeholder:text-gray-300 px-3 py-2 bg-white border border-[#e2e8f0] rounded text-sm focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="issue"
                className="text-[11px] font-bold text-gray-500 uppercase tracking-wider"
              >
                Resolves Issue
              </label>
              <div className="relative">
                <select
                  name="issue"
                  id="issue"
                  className="w-full pl-3 pr-8 py-2 bg-white border border-[#e2e8f0] rounded text-sm appearance-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none cursor-pointer"
                >
                  <option value="">None (optional)</option>
                  <option value="issue-1">
                    Issue #1: Ambiguity in Section 2.1
                  </option>
                  <option value="issue-2">
                    Issue #2: Missing Clause on Liability
                  </option>
                </select>
                <span className="absolute right-2 top-1.5 pointer-events-none text-[18px] text-gray-400">
                  <ExpandMore fontSize="inherit" />
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="reviewer"
                className="font-bold text-gray-500 uppercase tracking-wider text-[11px]"
              >
                Assign Reviewer
              </label>
              <div className="relative">
                <select
                  name="reviewer"
                  id="reviewer"
                  className="w-full pl-3 pr-8 py-2 bg-white  border border-[#e2e8f0]  rounded text-sm appearance-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  <option value="user-1">Alice Johnson</option>
                  <option value="user-2">Bob Smith</option>
                </select>
                <span className="absolute right-2 top-1.5 pointer-events-none text-[18px] text-gray-400">
                  <ExpandMore fontSize="inherit" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="p-4 border-t border-[#e2e8f0] bg-white flex items-center justify-end gap-3">
        <button className="px-4 py-2 text-xs font-bold text-[#64748b] hover:text-[#0f172a] transition-colors uppercase tracking-wider">
          Save as Draft
        </button>
        <button className="px-6 py-2 bg-[#0f172a] hover:bg-[#334155] text-white text-xs font-bold rounded shadow-sm transition-all uppercase tracking-wider flex items-center gap-2">
          Submit for Review
          <span className=" text-[16px]">
            <Send fontSize="inherit" />
          </span>
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex-col text-center bg-slate-50 flex items-center justify-center p-12">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#e2e8f0]  flex items-center justify-center mb-6">
        <span className="font-extralight text-[40px]">
          <NoteAdd fontSize="inherit" />
        </span>
      </div>
      <h3 className="font-bold text-lg text-[#0f172a] mb-2">
        No proposals yet
      </h3>
      <p className="leading-relaxed mb-8 text-[13px] text-[#64748b]">
        Select a clause in the document to propose a change and start the
        negotiation
      </p>
    </div>
  );
};

export default ProposalPanel;

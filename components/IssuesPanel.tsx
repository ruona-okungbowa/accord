"use client";
import { Close, ExpandMore, Search, Warning } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const IssuesPanel = ({
  issueContext,
  onClearContext,
}: {
  issueContext?: string | null;
  onClearContext?: () => void;
}) => {
  const [formOpen, setFormOpen] = useState(true);

  useEffect(() => {
    if (issueContext) {
      setFormOpen(true);
    }
  }, [issueContext]);

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
      <form
        action="#"
        className="flex-1 overflow-y-auto p-5 space-y-5 bg-white"
      >
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
            placeholder="Summarize the issue in a few words"
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
              <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50  border border-gray-200  rounded-md focus:ring-1 focus:ring-violet-500 outline-none text-text-main">
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
              <select className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50  border border-gray-200  rounded-md focus:ring-1 focus:ring-violet-500 outline-none text-text-main">
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
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-shadow text-[#1e293b] resize-none"
            placeholder="Detailed context and rationale...."
            rows={4}
          ></textarea>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="assignedTo"
            className="font-bold text-slate-500 uppercase tracking-wide text-[11px]"
          >
            Assign to
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
              <Search fontSize="inherit" />
            </span>
            <input
              type="text"
              name="assignedTo"
              id="assignedTo"
              placeholder="Search participants..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none text-[#1e293b]"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded border border-slate-200">
              <div className="w-4 h-4 rounded-full bg-slate-300"></div>
              <span className="text-[11px] text-slate-600 font-medium">
                Alice
              </span>
              <button className=" text-[14px] text-slate-400 hover:text-red-500">
                <Close fontSize="inherit" />
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="p-4 border-t border-[#e2e8f0] bg-gray-50 flex gap-3">
        <button className="flex-1 px-4 py-2 text-sm font-bold text-white bg-violet-500 hover:bg-violet-800 rounded shadow-sm transition-all">
          Raise Issue
        </button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-200 rounded transition-all">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center flex-col text-center justify-center bg-slate-50 p-12">
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
  );
};

export default IssuesPanel;

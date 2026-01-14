import {
  AccountTree,
  History,
  KeyboardDoubleArrowRight,
  NoteAdd,
  Warning,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import logo from "@/public/logo.svg";
import ProposalPanel from "./ProposalPanel";
import IssuesPanel from "./IssuesPanel";
import ActivityPanel from "./ActivityPanel";
import Image from "next/image";

const WorkspaceSidebar = ({ issueContext, onClearContext, proposalContext }: { issueContext?: string | null; onClearContext?: () => void; proposalContext?: string | null }) => {
  const [expanded, setExpanded] = useState(false);
  const [openProposals, setOpenProposals] = useState(false);
  const [openIssues, setOpenIssues] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);

  useEffect(() => {
    if (issueContext) {
      setExpanded(true);
      setOpenIssues(true);
      setOpenProposals(false);
      setOpenActivity(false);
    }
  }, [issueContext]);

  useEffect(() => {
    if (proposalContext) {
      setExpanded(true);
      setOpenProposals(true);
      setOpenIssues(false);
      setOpenActivity(false);
    }
  }, [proposalContext]);

  const togglePanels = (text: string) => {
    setExpanded(true);
    if (text === "proposals") {
      setOpenProposals(true);
      setOpenIssues(false);
      setOpenActivity(false);
    } else if (text === "issues") {
      setOpenProposals(false);
      setOpenIssues(true);
      setOpenActivity(false);
    } else if (text === "activity") {
      setOpenProposals(false);
      setOpenIssues(false);
      setOpenActivity(true);
    }
  };

  return (
    <aside
      className={`bg-white border-l border-[#e2e8f0] flex flex-col shrink-0 z-20 transition-all duration-300 ${
        expanded ? "w-105" : "w-15"
      }`}
    >
      {!expanded && (
        <div className="flex flex-col gap-2 items-center py-4">
          <button
            onClick={() => togglePanels("proposals")}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            <NoteAdd fontSize="small" />
          </button>
          <button
            onClick={() => togglePanels("issues")}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            <Warning fontSize="small" />
          </button>
          <button
            onClick={() => togglePanels("activity")}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            <History fontSize="small" />
          </button>
        </div>
      )}
      {expanded && (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[#e2e8f0] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="Accord Logo" width={20} height={20} />
              <h2 className="text-sm font-bold text-[#0f172a]  uppercase tracking-tight">
                Tools
              </h2>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-pointer"
            >
              <span className="text-[20px]">
                <KeyboardDoubleArrowRight fontSize="inherit" />
              </span>
            </button>
          </div>
          <div className="flex border-b border-[#e2e8f0] bg-white">
            <button
              onClick={() => togglePanels("proposals")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                openProposals
                  ? "text-violet-500 border-violet-500"
                  : "text-[#64748b] border-transparent hover:text-violet-500"
              }`}
            >
              Proposals
            </button>
            <button
              onClick={() => togglePanels("issues")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                openIssues
                  ? "text-violet-500 border-violet-500"
                  : "text-[#64748b] border-transparent hover:text-violet-500"
              }`}
            >
              Issues
            </button>
            <button
              onClick={() => togglePanels("activity")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                openActivity
                  ? "text-violet-500 border-violet-500"
                  : "text-[#64748b] border-transparent hover:text-violet-500"
              }`}
            >
              Activity
            </button>
          </div>
          {openProposals && <ProposalPanel proposalContext={proposalContext} onClearContext={onClearContext} />}
          {openIssues && <IssuesPanel issueContext={issueContext} onClearContext={onClearContext} />}
          {openActivity && <ActivityPanel />}
        </div>
      )}
    </aside>
  );
};

export default WorkspaceSidebar;

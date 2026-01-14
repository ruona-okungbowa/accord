import { History } from "@mui/icons-material";
import React from "react";

const ActivityPanel = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-[#e2e8f0] shadow-sm mb-6">
        <span className="text-slate-300 text-[40px] font-light">
          <History fontSize="inherit" />
        </span>
      </div>
      <h3 className="font-bold text-lg text-[#0f172a] mb-2">No activity yet</h3>
      <p className="text-sm text-[#64748b] leading-relaxed mb-8">
        The audit trail will appear here as soon as participants start raising
        issues or proposing changes.
      </p>
    </div>
  );
};

export default ActivityPanel;

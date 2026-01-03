import { Gavel, Notifications } from "@mui/icons-material";
import React from "react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-400 mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-slate-900 cursor-pointer">
            <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center shadow-sm">
              <span className="text-[20px]">
                <Gavel />
              </span>
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">
              Accord
            </span>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="#"
              className="px-3 py-2 text-sm font-medium rounded-md text-indigo-600 bg-indigo-600/5"
            >
              Deals
            </a>
            <a
              href="#"
              className="px-3 py-2 text-sm font-medium rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Tasks
            </a>
            <a
              href="#"
              className="px-3 py-2 text-sm font-medium rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Documents
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <Notifications />
            </span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-700">
                Eleanor Vance
              </div>
              <div className="text-[10px] text-slate-500">
                Partner • Latham &amp; Watkins
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-full border-white shadow-sm overflow-hidden">
              {/** Image goes here */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

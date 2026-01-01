import {
  Add,
  FolderCopy,
  FolderOpen,
  Gavel,
  Mail,
  Notifications,
} from "@mui/icons-material";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-[8px] border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
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
      <main className="flex-1 max-w-[1600ox] mx-auto w-full px-6 py-8 flex flex-col">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
              Deals
            </h1>
            <p className="text-slate-500 font-light">
              Active loan negotiations
            </p>
          </div>
          <div
            aria-hidden
            className="flex items-center gap-3 opacity-50 pointer-events-none grayscale"
          >
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded shadow-sm flex items-center gap-2">
              <Mail />
              Join via Invite
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm flex items-center gap-2">
              <Add />
              Create Deal
            </button>
          </div>
        </header>
        <section className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-32 px-4 mb-10">
          <div className="w-24 h-24 bg-slate-900/5 rounded-full flex items-center justify-center mb-6">
            <span className="text-slate-900/40">
              <FolderCopy fontSize="large" />
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3 text-center">
            You are not currently involved in any loan deals.
          </h2>
          <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
            Deals will appear here once you are invited or create a new one.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm hover:bg-indigo-600/90 transition-colors flex items-center gap-2 shadow-indigo-600/20">
              <Add />
              Create Deal
            </button>
            <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Mail />
              Join via Invite
            </button>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white mt-auto py-8">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <div>© 2026 Accord.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-slate-600" href="#">
              Privacy &amp; Terms
            </a>
            <a className="hover:text-slate-600" href="#">
              Compliance Center
            </a>
            <a className="hover:text-slate-600" href="#">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;

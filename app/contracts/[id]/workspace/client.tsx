"use client";
import Layout from "@/components/Layout";
import {
  Add,
  AssignmentLate,
  Badge,
  Dashboard,
  Description,
  DocumentScanner,
  FactCheck,
  FilterList,
  Gavel,
  History,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Search,
  Verified,
} from "@mui/icons-material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DocumentEditor from "@/components/document/DocumentEditor";
import { StructuredDocument } from "@/lib/document/structure";

interface Contract {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  amount: number;
  status: string;
  target_close_date: string | null;
}

interface User {
  id: string;
  role: string;
}

interface Document {
  id: string;
  title: string;
  content: StructuredDocument;
  created_by: string;
  created_at: string;
  updated_at: string;
  deal_id: string;
}

const DocumentWorkspace = ({ id }: { id: string }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [openInviteModal, setOpenInviteModal] = useState(false);

  // Fetch details for the specified contractId
  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contracts/${id}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Error fetching contract details:", data.error);
        throw new Error(data.error);
      }
      setContract(data.contract);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching contract details:", error);
    }
  };

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Error fetching document:", data.error);
        throw new Error(data.error);
      }
      setDocument(data.document);
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractDetails();
    fetchDocument();
  }, [id]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans overflow-hidden h-screen flex flex-col">
      <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 shrink-0 z-30 relative shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#0f172a]">
            <span className="text-[24px]">
              <Gavel fontSize="inherit" />
            </span>
            <span className="text-lg font-bold tracking-tight">Accord</span>
          </div>
          <div className="h-5 w-px bg-gray-200"></div>
          <nav className=" flex items-center gap-2 text-xs">
            <Link
              href="#"
              className="text-[#64748b] hover:text-indigo-600 transition-colors"
            >
              Deals
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/contracts/${id}`}
              className="text-[#64748b] hover:text-indigo-600 transition-colors"
            >
              {contract?.name}
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="#"
              className="text-[#64748b] hover:text-indigo-600 transition-colors"
            >
              Document Workspace
            </Link>
          </nav>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1 -translate-y-1/2">
          <div className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2 border border-gray-200">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
            <span className="font-semibold text-[10px] text-gray-600 uppercase tracking-wide">
              Negotiation
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 text-[16px]">
              <Badge fontSize="inherit" />
            </span>
            <span className="text-xs capitalize font-medium text-slate-600 ">
              {user?.role}
            </span>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-cover bg-center border border-gray-200 ring-2 ring-transparent hover:ring-gray-100 transition-all"></div>
          </div>
        </div>
      </header>
      <div className="h-12 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-2.5 top-1 text-gray-400 text-[18px]">
              <Search fontSize="inherit" />
            </span>
            <input
              type="text"
              placeholder="Search clause or term"
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-15 bg-white border-r border-[#e2e8f0] flex flex-col items-center py-4 gap-2 shrink-0 z-10 transition-all duration-300">
          <a
            className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors group relative"
            href="#"
          >
            <span className="text-[24px]">
              <Dashboard fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Overview
            </span>
          </a>
          <a
            className="w-10 h-10 flex items-center justify-center rounded-md bg-slate-100 text-indigo-600  shadow-sm ring-1 ring-slate-200 group relative"
            href="#"
          >
            <span className=" text-[24px] fill-1">
              <Description fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Document
            </span>
          </a>
          <a
            className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors group relative"
            href="#"
          >
            <span className=" text-[24px]">
              <Gavel fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Decisions
            </span>
          </a>
          <a
            className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors group relative"
            href="#"
          >
            <span className=" text-[24px]">
              <FactCheck fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Readiness
            </span>
          </a>
          <div className="w-8 h-px bg-gray-200 my-2"></div>
          <div className="w-10 h-10 flex items-center justify-center rounded-md cursor-help group relative">
            <span className=" text-green-600 text-[20px]">
              <Verified fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Authoritative Draft
              <br />
              Last updated 2h ago
            </span>
          </div>
          <div className="flex-1"></div>
          <button className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors mb-2 group relative">
            <span className=" text-[24px]">
              <FilterList fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Filters
            </span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-gray-200 group relative">
            <span className=" text-[20px]">
              <KeyboardDoubleArrowRight fontSize="inherit" />
            </span>
            <span className="absolute left-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Expand Sidebar
            </span>
          </button>
        </aside>
        <main className="flex-1 bg-[#f1f5f9] relative overflow-y-auto flex justify-center p-8 scroll-smooth">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading document...</p>
              </div>
            </div>
          ) : document && document.content ? (
            <DocumentEditor
              document={document.content}
              dealId={id}
              onSave={async (changes) => {
                console.log("Saving changes:", changes);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Description className="text-6xl mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2">No document found</p>
                <p className="text-sm">This contract doesn't have a document yet.</p>
              </div>
            </div>
          )}
        </main>
        <aside className="w-15 bg-white border-l border-[#e2e8f0] flex flex-col items-center py-4 gap-4 shrink-0 z-20 shadow-sm transition-all duration-300">
          <button className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors mb-2 group relative">
            <span className=" text-[24px]">
              <KeyboardDoubleArrowLeft fontSize="inherit" />
            </span>
            <span className="absolute right-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Expand Panel
            </span>
          </button>
          <div className="w-8 h-px bg-gray-200mb-2"></div>
          <div className="relative group">
            <button className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100">
              <span className=" text-[24px]">
                <AssignmentLate fontSize="inherit" />
              </span>
            </button>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-md text-[#64748b] hover:bg-gray-50 hover:text-indigo-600 transition-colors group relative">
            <span className=" text-[24px]">
              <History fontSize="inherit" />
            </span>
            <span className="absolute right-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Activity History
            </span>
          </button>
          <div className="flex-1"></div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-[#334155] transition-colors shadow-md group relative">
            <span className=" text-[20px]">
              <Add fontSize="inherit" />
            </span>
            <span className="absolute right-12 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              New Issue
            </span>
          </button>
        </aside>
      </div>
    </div>
  );
};

export default DocumentWorkspace;

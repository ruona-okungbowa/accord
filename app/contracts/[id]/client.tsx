"use client";
import CenterModal from "@/components/CenterModal";
import InvitePartipantsModal from "@/components/InvitePartipantsModal";
import Layout from "@/components/Layout";
import {
  Analytics,
  ArrowForward,
  Badge,
  Check,
  ChevronRight,
  FolderOpen,
  GroupAdd,
  History,
  ListAlt,
  Lock,
  PriorityHigh,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useState, useEffect } from "react";

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

const ContractDashboard = ({ id }: { id: string }) => {
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch details for the specified contractId
  const fetchContractDetails = async () => {
    try {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      <Layout>
        <main className="flex-1 max-w-400 mx-auto w-full px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link
              href="/contracts"
              className="hover:text-indigo-600 transition-colors"
            >
              Contracts
            </Link>
            <span>
              <ChevronRight fontSize="small" />
            </span>
            <span className="font-medium text-slate-900">{contract?.name}</span>
          </div>
          <header className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center-gap-3 mb-2">
                  <h1 className="text-3xl capitalize font-serif font-bold text-slate-900">
                    {contract?.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex capitalize items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <span className="rounded-full w-1.5 h-1.5 bg-slate-400"></span>
                    {contract?.status}
                  </span>
                  <span className="h-4 w-px bg-slate-200"> </span>
                  <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600/10 text-indigo-600 border border-indigo-600/20">
                    <span className="mr-1">
                      <Badge fontSize="small" />
                    </span>
                    {user?.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start lg:self-center">
                <Link
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-400 text-sm font-medium rounded shadow-sm cursor-not-allowed opacity-75"
                  href="#"
                >
                  View Decisions
                </Link>
                <Link
                  href="#"
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-400 text-sm font-medium rounded shadow-sm cursor-not-allowed opacity-75"
                >
                  View Readiness
                </Link>
                <Link
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm hover:bg-indigo-600/90 transition-colors flex items-center gap-2 shadow-indigo-600/20"
                  href={`/contracts/${id}/workspace`}
                >
                  <span className="text-[18px]">
                    <FolderOpen fontSize="inherit" />
                  </span>
                  Open Document Workspace
                </Link>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-50 flex flex-col">
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    Negotiation Progress
                  </h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 rounded-lg">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-slate-400">
                      <Analytics />
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-700">
                    No data available
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Progress metrics will be calculated automatically once
                    isasues are raised within the document workspace.
                  </p>
                </div>
              </section>
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[20px]">
                      <PriorityHigh fontSize="inherit" />
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 font-serif">
                      Items Requiring Attention
                    </h2>
                  </div>
                </div>
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-green-600 text-[32px]">
                      <Check fontSize="inherit" />
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-slate-900">
                    You're all caught up
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    No items requiring your attention at this time.
                  </p>
                </div>
              </section>
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    Issues Summary{" "}
                  </h2>
                </div>
                <div className="p-16 flex flex-col items-center justify-center text-center bg-white">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-slate-400">
                      <ListAlt />
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-700">
                    No issues recorded
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mb-6">
                    Issues extracted from legal documents will be listed here
                    for tracking and resolution.
                  </p>
                  <Link
                    href="#"
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2"
                  >
                    Go to Document Workspace{" "}
                    <span className="text-[14px]">
                      <ArrowForward fontSize="inherit" />
                    </span>
                  </Link>
                </div>
              </section>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Contract Data
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <div className="text-slate-400 uppercase text-[10px]">
                      Facility Type
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      Syndicated Term Loan
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 uppercase text-[10px]">
                      Amount
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {contract?.amount}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 uppercase text-[10px]">
                      Currency
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {contract?.currency}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 uppercase text-[10px]">
                      Target Signing
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {contract?.target_close_date}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    Participants
                  </h3>
                  <span
                    onClick={() => setOpenInviteModal(true)}
                    className="text-xs text-indigo-600 hover:underline cursor-pointer"
                  >
                    Invite
                  </span>
                </div>
                <div className="py-8 flex flex-col items-center justify-center text-center border-t border-slate-100">
                  <span className="text-slate-300 text-[32px] mb-2">
                    <GroupAdd fontSize="inherit" />
                  </span>
                  <p className="text-sm font-medium text-slate-600">
                    No participants yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1 px-4">
                    Invite legal counsel and representatives to collaborate on
                    this contract
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-50 rounded-bg-slate-50/30">
                  <span className="text-slate-300 text-[28px] mb-2">
                    <History fontSize="inherit" />
                  </span>
                  <p className="text-sm text-slate-500 italic">
                    No recent activity for this contract.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
      <CenterModal
        isOpen={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        width={800}
        borderRadius="10px"
      >
        <InvitePartipantsModal closeModal={() => setOpenInviteModal(false)} />
      </CenterModal>
    </div>
  );
};

export default ContractDashboard;

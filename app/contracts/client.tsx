"use client";
import React, { useEffect, useState } from "react";
import CreateDealModal from "@/components/CreateDealModal";
import Layout from "@/components/Layout";
import {
  Add,
  FolderCopy,
  Mail,
  ArrowForward,
  FolderOpen,
  Warning,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CenterModal from "@/components/CenterModal";
import InvitePartipantsModal from "@/components/InvitePartipantsModal";
import Link from "next/link";

const DashboardPage = () => {
  const [openCreateDealModal, setOpenCreateDealModal] = useState(false);
  const [openCreateInvitationsModal, setOpenCreateInvitationsModal] =
    useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIssues, setTotalIssues] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchContracts();
    fetchTotalIssues();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts");
      const data = await response.json();
      if (response.ok) setContracts(data.contracts || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalIssues = async () => {
    try {
      const response = await fetch("/api/contracts");
      const data = await response.json();
      if (response.ok) {
        const contracts = data.contracts || [];
        let total = 0;
        for (const contract of contracts) {
          const issuesRes = await fetch(`/api/issues?id=${contract.id}`);
          const issuesData = await issuesRes.json();
          if (issuesRes.ok) {
            total += (issuesData.issues || []).filter((i: any) => i.status !== 'resolved').length;
          }
        }
        setTotalIssues(total);
      }
    } catch (error) {
      console.error("Error fetching total issues:", error);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      <Layout>
        <main className="flex-1 max-w-400 mx-auto w-full px-6 py-8 flex flex-col">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
                Contracts
              </h1>
              <p className="text-slate-500 font-light">
                Active loan negotiations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenCreateInvitationsModal(true)}
                className="pointer-events-none grayscale opacity-50 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded shadow-sm flex items-center gap-2"
              >
                <Mail />
                Join via Invite
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm flex items-center gap-2"
                onClick={() => setOpenCreateDealModal(true)}
              >
                <Add />
                Create Contract
              </button>
            </div>
          </header>
          <section className="flex-1 w-full mb-10">
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center py-32">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : contracts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-32 px-4">
                <div className="w-24 h-24 bg-slate-900/5 rounded-full flex items-center justify-center mb-6">
                  <span className="text-slate-900/40">
                    <FolderCopy fontSize="large" />
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3 text-center">
                  You are not currently involved in any loan contracts.
                </h2>
                <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
                  Contracts will appear here once you are invited or create a
                  new one.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setOpenCreateDealModal(true)}
                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm hover:bg-indigo-600/90 transition-colors flex items-center gap-2 shadow-indigo-600/20"
                  >
                    <Add />
                    Create Contract
                  </button>
                  <button
                    onClick={() => setOpenCreateInvitationsModal(true)}
                    className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <Mail />
                    Join via Invite
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-slate-300 transition-all group cursor-default">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <span className="text-[20px]">
                          <FolderOpen fontSize="inherit" />
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        Total
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-serif font-bold text-slate-800">
                        {contracts.length}
                      </div>
                      <div className="text-sm font-medium text-slate-400">
                        active contracts
                      </div>
                    </div>
                    <div className="text-xs text-slate-499 mt-1">
                      Across all legal roles
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-amber-200 transition-all shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-50"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-amber-100 rounded-lg text-amber-600 ">
                          <span className="text-[20px]">
                            <Warning fontSize="inherit" />
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                          Action Required
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-serif font-bold text-slate-900">
                          {totalIssues}
                        </div>
                        <div className="text-sm font-medium text-amber-700">
                          open issues
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Awaiting your specific input
                      </div>
                    </div>
                  </div>
                </div>
                <section className="bg-white rounded-xl border overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-900 font-serif">
                        Active Contracts
                      </h2>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                        {contracts.length} Total
                      </span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <div className="relative flex-grow sm:flex-grow-0"></div>
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4 w-[28%] pl-8">
                            Contract Name
                          </th>
                          <th className="px-6 py-4 w-[12%]">Status</th>
                          <th className="px-6 py-4 w-[18%]">Amount</th>
                          <th className="px-6 py-4 w-[14%]">Target Close</th>
                          <th className="px-6 py-4 w-[14%]">Last Activity</th>
                          <th className="px-6 py-4 w-[8%] text-right pr-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {contracts.map((contract) => (
                          <tr key={contract.id} className="group hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 pl-8">
                              <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {contract.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex capitalize items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                {contract.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              {contract.currency} {contract.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {contract.target_close_date ? new Date(contract.target_close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {new Date(contract.updated_at || contract.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 pr-8 text-right">
                              <Link
                                href={`/contracts/${contract.id}`}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider inline-flex items-center gap-1"
                              >
                                Open
                                <ArrowForward sx={{ fontSize: 14 }} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center"></div>
                </section>
              </>
            )}
          </section>
        </main>
      </Layout>
      <CenterModal
        isOpen={openCreateDealModal}
        onClose={() => setOpenCreateDealModal(false)}
        width={900}
        borderRadius="10px"
      >
        <CreateDealModal closeModal={() => setOpenCreateDealModal(false)} />
      </CenterModal>
      <CenterModal
        isOpen={openCreateInvitationsModal}
        onClose={() => setOpenCreateInvitationsModal(false)}
        width={900}
        borderRadius="10px"
      >
        <InvitePartipantsModal
          closeModal={() => setOpenCreateInvitationsModal(false)}
        />
      </CenterModal>
    </div>
  );
};

export default DashboardPage;

"use client";
import React, { useState } from "react";
import CreateDealModal from "@/components/CreateDealModal";
import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import {
  Add,
  FolderCopy,
  FolderOpen,
  Gavel,
  Mail,
  Notifications,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CenterModal from "@/components/CenterModal";

const DashboardPage = () => {
  const [openCreateDealModal, setOpenCreateDealModal] = useState(false);
  const router = useRouter();
  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      <Layout>
        <main className="flex-1 max-w-[1600ox] mx-auto w-full px-6 py-8 flex flex-col">
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
              <button className="pointer-events-none grayscale opacity-50 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded shadow-sm flex items-center gap-2">
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
          <section className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-32 px-4 mb-10">
            <div className="w-24 h-24 bg-slate-900/5 rounded-full flex items-center justify-center mb-6">
              <span className="text-slate-900/40">
                <FolderCopy fontSize="large" />
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3 text-center">
              You are not currently involved in any loan contracts.
            </h2>
            <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
              Contracts will appear here once you are invited or create a new
              one.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpenCreateDealModal(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm hover:bg-indigo-600/90 transition-colors flex items-center gap-2 shadow-indigo-600/20"
              >
                <Add />
                Create Contract
              </button>
              <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Mail />
                Join via Invite
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </Layout>
      <CenterModal
        isOpen={openCreateDealModal}
        onClose={() => setOpenCreateDealModal(false)}
        width={900}
        borderRadius="10px"
      >
        <CreateDealModal closeModal={() => setOpenCreateDealModal(false)} />
      </CenterModal>
    </div>
  );
};

export default DashboardPage;

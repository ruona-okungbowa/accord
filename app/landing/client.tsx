"use client";
import {
  AccountBalance,
  AdminPanelSettings,
  ArrowForward,
  Check,
  CloudSync,
  ExpandMore,
  Gavel,
  History,
  HistoryEdu,
  Lock,
  SmartToy,
  UploadFile,
  VerifiedUser,
} from "@mui/icons-material";
import logo from "@/public/logo_colour.png";
import { CheckCircle, Verified } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      <nav className="top-0 fixed z-50 w-full transition-all duration-300">
        <div className="px-6 md:px-12 pt-6 flex items-center justify-between max-w-350 mx-auto">
          <div className="flex items-center group cursor-pointer bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm hover:bg-white hover:shadow-md transition-all duration-300">
            <div className="relative w-8 h-8 flex items-center justify-center text-white rounded-full shadow-inner overflow-hidden">
              <Image
                src={logo}
                width={600}
                height={600}
                alt="Logo for Accord"
              />
            </div>
            <a href="#hero">
              <span className="text-xl font-serif font-bold tracking-light text-slate-900 leading-none">
                Accord
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-xl px-2 py-1.5 rounded-full border border-white/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-slate-900/5 hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.01]">
            <a
              href="#features"
              className="relative px-5 py-2 rounded-full group transition-all duration-300 hover:bg-slate-50/80"
            >
              <span className="font-semibold tracking-wider uppercase text-slate-600 group-hover:text-indigo-600 transition-colors text-[11px]">
                Capabilites
              </span>
            </a>
            <a
              href="#process"
              className="relative px-5 py-2 rounded-full group transition-all duration-300 hover:bg-slate-50/80"
            >
              <span className="font-semibold tracking-wider uppercase text-slate-600 group-hover:text-indigo-600 transition-colors text-[11px]">
                Workflow
              </span>
            </a>
            <a
              href="#testimonials"
              className="relative px-5 py-2 rounded-full group transition-all duration-300 hover:bg-slate-50/80"
            >
              <span className="font-semibold tracking-wider uppercase text-slate-600 group-hover:text-indigo-600 transition-colors text-[11px]">
                Security
              </span>
            </a>
            <span className="h-4 w-px bg-slate-300 mx-1"></span>
            <Link
              href="/login"
              className="relative px-5 py-2 rounded-full group transition-all duration-300 hover:bg-slate-50/80"
            >
              <span className="font-semibold tracking-wider uppercase text-slate-600 group-hover:text-indigo-600 transition-colors flex items-center gap-1 text-[11px]">
                <span className="text-[14px]">
                  <Lock fontSize="inherit" />
                </span>
                Login
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-slate-900 hover:bg-slate-800 text-white pl-5 pr-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg shadow-slate-900/20 transition-all hover:shadow-slate-900/30 hover:-translate-y-0.5 flex items-center gap-2 group broder border-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <span>Watch Demo</span>
              <span className="group-hover:translate-x-0.5 transition-transform text-[16px]">
                <ArrowForward fontSize="inherit" />
              </span>
            </button>
          </div>
        </div>
      </nav>
      <section
        className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden"
        id="hero"
      >
        <div className="absolute inset-0 bg-slate-50 bg-grid-pattern bg-size-[40px_40px] opacity-60"></div>
        <div className="absolute top-0 left-1/3 w-125 h-125 bg-slate-50/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-100 h-100 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000 "></div>
        <div className="absolute -bottom-32 left-1/2 w-150 h-150 bg-violet-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-600/20 shadow-sm mb-8 animate-slide-up hover:border-indigo-600/40 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono font-medium text-slate-800 uppercase tracking-wider">
              System Status: Operational | v2.4.1
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-slate-800 leading-[1.05] mb-8 tracking-tight max-w-6xl mx-auto animate-slide-up delay-100">
            Structured Negotiation <br className="hidden md:block" />
            <span className="italic text-gradient-indigo-600 font-normal relative inline-block">
              {" "}
              for Loan Documents
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent/30"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                ></path>
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-slide-up delay-200">
            Accord is a single, auditable workspace for banks, law firms, and
            borrowers. Track every issue, decision, and approval — and know
            exactly when a deal is ready to sign.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 animate-slide-up delay-300">
            <button className="group relative px-8 py-4 rounded-full text-white font-bold text-lg tracking-tight shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300 overflow-hidden bg-slate-900 w-full sm:w-auto">
              <div className="relative flex items-center justify-center gap-3">
                <span>Access Platform</span>
                <span className="text[20px] transition-transform group-hover:translate-x-1">
                  <ArrowForward fontSize="inherit" />
                </span>
              </div>
            </button>
            <a
              href="#features"
              className="h-14 px-8 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-600 font-medium hover:text-indigo-600 hover:border-indigo-600 hover:bg-white hover:shadow-lg hover:shadow-indigo-600/5 transition-all w-full sm:w-auto flex items-center justify-center gap-2 group"
            >
              <span>Learn More</span>
              <span className="text-xl group-hover:translate-y-1 transition-transform">
                <ExpandMore fontSize="inherit" />
              </span>
            </a>
          </div>
          <div className="mt-16 pt-10 border-t border-slate-200/60 w-full overflow-hidden relative"></div>
        </div>
      </section>
      <section
        className="py-24 bg-white relative overflow-hidden border-t border-slate-200"
        id="features"
      >
        <div className="absolute inset-0 bg-tech-dots bg-size-[24px_24px] opacity-30"></div>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-linear-to-r from-white via-white/80 to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded border border-indigo-600/20 bg-indigo-600/5 text-indigo-600 font-mono text-[10px] font-bold tracking-widest uppercase mb-4">
              Core Banking Infrastructure
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-6 tracking-tight">
              Insitutional-Grade Infrastructure
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-light leading-relaxed">
              Engineered for the rigorous demands of capital markets
              transactions, ensuring data integrity, security, and complete
              auditability.
            </p>
          </div>
          <div className="grid-grid-cols-1 md:grid-cols-12 grid-rows-2 gap-8">
            <div className="hover:border-indigo-600/40 md:col-span-7 row-span-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-0 relative overflow-hidden group transition-colors duration-500">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600"></div>
              <div className="p-8 pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg text-white bg-slate-900">
                    <span className="text-xl">
                      <AdminPanelSettings fontSize="inherit" />
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-">
                    Access Control
                  </h3>
                </div>
                <p className="text-slate-500 mb-8 max-w-md">
                  Define precise permission sets for Administrative Agents,
                  Lenders, and External Counsel. Maintain strict Chinese walls
                  and privilege logs automatically
                </p>
              </div>
              <div className="bg-slate-50 border-t border-slate-200 p-6 h-full">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Access Control List
                    </span>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300 "></span>
                      <span className="w-2 h-2 rounded-full bg-slate-300 "></span>
                    </div>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase">
                          Entity
                        </th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase">
                          Role
                        </th>
                        <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase text-right">
                          Permissions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-b border-slate-50 group/row hover:bg-indigo-600/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">
                            JP
                          </div>{" "}
                          JP Morgan Chase
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          Administrative Agent
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 font-mono text-[10px] font-bold border border-green-200 uppercase">
                            Full Access
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-50 group/row hover:bg-indigo-600/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">
                            CC
                          </div>
                          Clifford Chance
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          Lender Counsel
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-600/10 text-indigo-600 font-mono text-[10px] font-bold border border-indigo-600/20 uppercase">
                            Write • Propose
                          </span>
                        </td>
                      </tr>
                      <tr className="group/row hover:bg-indigo-600/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">
                            GS
                          </div>
                          Goldman Sachs
                        </td>
                        <td className="px-4 py-3 text-slate-500">Member</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px] font-bold border border-slate-200 uppercase">
                            Read Only
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-600/50 transition-all duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-cyan-500">
                    <History />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Immutable Audit Trail
                  </h3>
                </div>
                <div className="font-mono text-[10px] text-slate-400 space-y-3 relative before:absolute before:left-1.25 before:top-2 before:bottom-2 before:w-px before:bg-slate-700">
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-slate-900 border border-indigo-600 rounded-full z-10"></div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-indigo-600 font-bold">
                        Margin Ratchet Modified
                      </span>{" "}
                      <span className="opacity-50">10:42 AM</span>
                    </div>
                    <p className="text-slate-500 truncate">
                      Spread adjustment from 1.50% to 1.75%
                    </p>
                  </div>
                  <div className="pl-4 relative opacity-60">
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-slate-900 border border-slate-600 rounded-full z-10"></div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Reviewer Added</span>
                      <span className="opacity-50">09:15 AM</span>
                    </div>
                    <p className="text-slate-600">
                      S. Jenkins assigned to Deal Ref #8821
                    </p>
                  </div>
                  <div className="pl-4 relative opacity-40">
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-slate-900 border border-slate-600 rounded-full z-10"></div>
                    <div className="text-slate-500">Deal created by System</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-24 bg-slate-50 border-t border-slate-200"
        id="process"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-800 mb-4">
              End-to-End Execution Lifecycle
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              A linear, auditable pathway from Term Sheet ingestion to Execution
              Copy generation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>
            <div className="relative group">
              <div className="w-24  h-24 mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-8 relative z-10 group-hover:border-indigo-600 transition-colors duration-300 ">
                <div className="absolute  -top-3 -right-3 w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold font-mono text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all ">
                  01
                </div>
                <span className="text-slate-300 group-hover:text-indigo-600 transition-colors text-4xl">
                  <UploadFile fontSize="inherit" />
                </span>
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Smart Ingestion
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-">
                  Ingest term sheets and precedent documents. Proprietary
                  parsing identifies defined terms and commercial variables to
                  populate the initial draft.
                </p>
                <div className="bg-white p-3 rounded border border-slate-200 text-left shadow-sm opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 duration-300">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                    <span className="text-xs text-indigo-600">
                      <SmartToy fontSize="inherit" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 uppercase">
                      Entity Extraction
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-brand-sand border border-slate-200 rounded text-[9px] text-slate-500">
                      #EBITDA_Addback
                    </span>
                    <span className="px-1.5 py-0.5 bg-brand-sand border border-slate-200 rounded text-[9px] text-slate-500">
                      #Leverage_Ratio
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="w-24  h-24 mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-8 relative z-10 group-hover:border-cyan-500 transition-colors duration-300 ">
                <div className="absolute  -top-3 -right-3 w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold font-mono text-slate-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-transparent transition-all ">
                  02
                </div>
                <span className="text-slate-300 group-hover:text-cyan-500 transition-colors text-4xl">
                  <Gavel fontSize="inherit" />
                </span>
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Issue Resolution
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-">
                  Parallel negotiation of legal and commercial issues. Resolve
                  items in isolated threads to maintain deal velocity without
                  blocking the wider agreement.
                </p>
                <div className="bg-white p-3 rounded border border-slate-200 text-left shadow-sm opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-700">
                      ISSUE #142
                    </span>
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 mb-1">
                    Negative Pledge Exception
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div className="bg-rose-500 w-2/3 h-1 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="w-24  h-24 mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-8 relative z-10 group-hover:border-amber-500 transition-colors duration-300 ">
                <div className="absolute  -top-3 -right-3 w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center group-hover:text-white group-hover:border-transparent justify-center text-xs font-bold font-mono text-slate-400 group-hover:bg-amber-500 duration-300 transition-all ">
                  03
                </div>
                <span className="text-slate-300 group-hover:text-amber-500 transition-colors text-4xl">
                  <Verified fontSize="inherit" />
                </span>
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Closing &amp; Execution
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Automated generation of the composite execution copy.
                  Real-time tracking of signature pages and closing set
                  compilation.
                </p>
                <div className="bg-white p-3 rounded border border-slate-200 text-left shadow-sm opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500 text-sm">
                      <CheckCircle fontSize="inherit" />
                    </span>
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                      Ready to Sign
                    </span>
                  </div>
                  <div className="flex pl-1 -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-slate-200 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-slate-300 border border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 border border-white flex items-center justify-center text-[6px] text-white font-bold">
                      <span className="text-[8px]">
                        <Check fontSize="inherit" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden"
        id="testimonials"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-6 z-10 relative md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                Security First Architecture
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
                Trust is the currency of the syndicated market.
              </h2>
              <p className="text-lg text-slate-600 font-light leading-relaxed mb-8 max-w-lg">
                Accord is architected to meet the most stringent security
                requirements of G-SIBs and global law firms. We don't just
                comply with standards; we enforce them programmatically.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="mb-4 w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <span className="text-2xl">
                    <Gavel fontSize="inherit" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Chinese Wall Enforcement
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Automated information barriers prevent unauthorized flow of
                  material non-public information (MNPI) between public and
                  private side deal participants.
                </p>
                <div className="h-1 w-full bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-slate-900 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="mb-4 w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <span className="text-2xl">
                    <HistoryEdu fontSize="inherit" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Immutable Audit Trails
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Every keystroke, view, and comment is cryptographically signed
                  and logged. Reconstruct the entire negotiation timeline for
                  internal compliance or external audit.
                </p>
                <div className="h-1 w-full bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-slate-900 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="mb-4 w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <span className="text-2xl">
                    <CloudSync fontSize="inherit" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Data Sovereignty Options
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Choose deployment regions to comply with GDPR, CCPA, and local
                  banking regulations. Support for on-premise keys with Hold
                  Your Own Key (HYOK) architecture.
                </p>
                <div className="h-1 w-full bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-slate-900 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-32 bg-slate-900 border-t border-slate-800 relative overflow-hidden"
        id="security"
      ></section>
      <footer className="bg-slate-50 pt-20 pb-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <span className="text-xl font-serif font-bold">Accord</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Reimagining the intersection of law and technology. The new
                standard for syndicated loan negotiation and documentation.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2026 Accord Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-slate-800" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-slate-800" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

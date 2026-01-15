"use client";
import { ArrowForward, Explore, PlayArrow } from "@mui/icons-material";
import { Lock } from "lucide-react";
import logo from "@/public/logo_colour.png";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

const DemoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-violet-500 selection:text-white">
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
            <Link href="/">
              <span className="text-xl font-serif font-bold tracking-light text-slate-900 leading-none">
                Accord
              </span>
            </Link>
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
      <main className="pt-32 pb-20 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-600/20 shadow-sm mb-6">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                Hackathon Submission Showcase
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium text-slate-800 leading-tight mb-6 tracking-tight">
              See Accord in{" "}
              <span className="italic text-indigo-600">Action</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              Watch how we're modernizing syndicated loan negotiations by moving
              from messy email chains to a structured, auditable workspace.
            </p>
          </div>
          <div className="relative mb-24 max-w-6xl mx-auto">
            <div className="video-container group bg-slate-800 overflow-hidden">
              {!isPlaying ? (
                <>
                  <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-slate-900 to-indigo-600 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-white z-10">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl"
                    >
                      <span className=" text-5xl fill-current">
                        <PlayArrow fontSize="inherit" />
                      </span>
                    </button>
                    <p className="mt-6 font-mono text-sm tracking-widest uppercase opacity-70">
                      Project Pitch Walkthrough (3:00)
                    </p>
                  </div>
                  <img
                    alt="Video Placeholder"
                    className="placeholder-img opacity-40 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYlLWc6yKoELvjYU4craNFJ8J6wHaB_pwqFHPjN6oyaYmqLL0fCoZkap7dBDQrunq0iNjcKGXeEwuK09IZf8gnCPP30nSE0rScdjzXyro1x0Um22G5Fq0zejuxrl4mWhDnrpZ2Z8BkVwsRco-FyR5d-id0typDLGSr5ZQQQ9lu1J_x5bmSHRGX2nMd5YiaFuR0cjcM2W9SL0AnxjGGQcl-_g4Kg9qNFHZIbwbS4ahrvi1AfZTihVTGRfNGdpcddQlYzBmmdD3b1HY"
                  />
                </>
              ) : (
                <iframe
                  src="https://youtu.be/4321RFc3VbU"
                  title="Accord Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full absolute inset-0"
                ></iframe>
              )}
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl -z-10"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Explore />
                </div>
                <h2 className="text-3xl font-serif text-slate-800 font-bold">
                  How to Use the Platform
                </h2>
              </div>
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                <div className="relative pl-12">
                  <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-4 border-brand-sand flex items-center justify-center shadow-md">
                    <span className="text-brand-primary font-bold font-mono">
                      01
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">
                    Import Your Draft Loan Documentation
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Upload a standard PDF or Word doc. Accord's parser
                    identifies key commercial variables like margins, tenors,
                    and commitment amounts automatically.
                  </p>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-4 border-brand-sand flex items-center justify-center shadow-md">
                    <span className="text-brand-primary font-bold font-mono">
                      02
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">
                    Invite Syndicate Members
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Add legal counsel and lenders to the workspace. No more
                    BCCs—everyone sees the latest version and the exact state of
                    negotiation in real-time.
                  </p>
                </div>
                <div className="relative pl-12">
                  <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-4 border-brand-sand flex items-center justify-center shadow-md">
                    <span className="text-brand-primary font-bold font-mono">
                      03
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">
                    Resolve Clauses &amp; Export
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Accept or counter specific clauses. Once final, generate an
                    execution copy with a complete, tamper-proof audit trail for
                    your compliance team.
                  </p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Right now the invite participants is not working
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 sticky top-28">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-serif text-brand-dark font-bold">
                      Sample Documents
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Try the demo with these presets
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-brand-accent text-3xl">
                    description
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="group border border-slate-100 rounded-2xl p-4 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-brand-primary transition-colors">
                        <span className="material-symbols-outlined">
                          article
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                          Phoneix Agreement
                        </h4>
                      </div>
                      <div className="self-center">
                        <a
                          href="/phoenix-agreement.docx"
                          download="phoenix-agreement.docx"
                        >
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-primary transition-colors">
                            download
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-6 tracking-tight">
            Built for Judges, Designed for Bankers
          </h2>
          <p className="text-slate-500 mb-10 max-w-2xl mx-auto">
            This hackathon project focuses on the 'tech-law' intersection,
            utilizing LLMs for clause parsing and blockchain for auditable trail
            generation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Natural Language Processing
            </div>
            <div className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Audit Trails
            </div>
            <div className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Real-time Collab
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;

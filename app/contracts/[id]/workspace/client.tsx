"use client";
import DocumentViewer from "@/components/DocumentViewer";
import { DocumentSection, StructuredDocument } from "@/lib/document/structure";
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
  ChevronLeft,
  ChevronRight,
  AddComment,
  EditNote,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";

interface Contract {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  amount: number;
  status: string;
  target_close_date: string | null;
}

interface Document {
  id: string;
  content: StructuredDocument;
  title: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface User {
  id: string;
  role: string;
}

const DocumentWorkspace = ({ id }: { id: string }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState<StructuredDocument | null>(null);
  const [docLoading, setDocLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedSection, setSelectedSection] =
    useState<DocumentSection | null>(null);
  const [issueContext, setIssueContext] = useState<string | null>(null);
  const [proposalContext, setProposalContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<string[][]>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_HEIGHT = 1120; // px
  const PAGE_PADDING = 32; // px
  const PAGE_MAX_WIDTH = 720; // match viewer maxWidth

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
    }
  };

  /** Fetch document content */
  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setDocument(data.document);
      setContent(data.document.content);
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setDocLoading(false);
    }
  };

  useEffect(() => {
    fetchContractDetails();
    fetchDocument();
  }, [id]);

  // measure hidden rendered sections and compute pages
  useLayoutEffect(() => {
    const measureAndPaginate = () => {
      if (!measureRef.current || !content) return;
      const root = measureRef.current as HTMLDivElement;
      const children = Array.from(
        root.querySelectorAll<HTMLElement>("[data-section-id]")
      );
      const pagesArr: string[][] = [];
      let currentPage: string[] = [];
      let currentHeight = 0;
      const usableHeight = PAGE_HEIGHT - PAGE_PADDING * 2;

      for (const section of content.sections) {
        const el = children.find((c) => c.dataset.sectionId === section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const marginTop = parseFloat(cs.marginTop || "0") || 0;
        const marginBottom = parseFloat(cs.marginBottom || "0") || 0;
        const h = rect.height + marginTop + marginBottom;

        if (currentHeight + h > usableHeight && currentPage.length > 0) {
          pagesArr.push(currentPage);
          currentPage = [section.id];
          currentHeight = h;
        } else {
          currentPage.push(section.id);
          currentHeight += h;
        }
      }
      if (currentPage.length) pagesArr.push(currentPage);

      // simple deep-equality check for string arrays
      const same =
        pagesArr.length === pages.length &&
        pagesArr.every(
          (p, i) =>
            p.length === pages[i]?.length &&
            p.every((id, j) => id === pages[i][j])
        );
      if (!same) {
        setPages(pagesArr);
        setPageIndex(0);
      }
    };

    // measure initially and after a short frame to let fonts/layout settle
    requestAnimationFrame(() => {
      measureAndPaginate();
    });

    const onResize = () => {
      requestAnimationFrame(measureAndPaginate);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [content, PAGE_HEIGHT, PAGE_PADDING]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans overflow-hidden h-screen flex flex-col">
      <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 shrink-0 z-30 relative shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#0f172a]">
            <Image src={logo} width={30} height={30} alt="Logo for Accord" />
            <span className="text-lg font-bold tracking-tight">Accord</span>
          </div>
          <div className="h-5 w-px bg-gray-200"></div>
          <nav className=" flex items-center gap-2 text-xs">
            <Link
              href="#"
              className="text-[#64748b] hover:text-indigo-600 transition-colors"
            >
              Contracts
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/contracts/${id}`}
              className="text-[#64748b] hover:text-indigo-600 transition-colors"
            >
              {contract?.name ?? "Loading..."}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#64748b] hover:text-indigo-600 transition-colors">
              Document Workspace
            </span>
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
        <main className="flex-1 bg-[#f1f5f9] relative overflow-y-auto flex justify-center p-8 scroll-smooth">
          {docLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading document...</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-white min-h-350 mb-20 shadow relative">
              {/* paper padding */}
              <div className="px-20 pb-20 pt-14">
                {content ? (
                  <>
                    {/* Hidden measurement render */}
                    <div
                      ref={measureRef}
                      style={{
                        position: "absolute",
                        left: -99999,
                        top: 0,
                        visibility: "hidden",
                        pointerEvents: "none",
                        width: PAGE_MAX_WIDTH - PAGE_PADDING * 2,
                      }}
                    >
                      <DocumentViewer
                        document={content}
                        activeSectionId={selectedSection?.id ?? null}
                        onSectionClick={() => {}}
                        readOnly
                      />
                    </div>

                    {/* Visible paginated pages rendered inside the paper (single page view) */}
                    <div>
                      {pages.length === 0 ? (
                        <div ref={paperRef}>
                          <DocumentViewer
                            document={content}
                            activeSectionId={selectedSection?.id ?? null}
                            onSectionClick={(s) =>
                              setSelectedSection((prev) =>
                                prev?.id === s.id ? null : s
                              )
                            }
                            onRaiseIssue={(s) => setIssueContext(s.content)}
                            onProposeAmendment={(s) => setProposalContext(s.content)}
                          />
                        </div>
                      ) : (
                        <div>
                          {/* floating bottom pagination control */}
                          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),_0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                              <button
                                onClick={() =>
                                  setPageIndex((i) => Math.max(0, i - 1))
                                }
                                disabled={pageIndex === 0}
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                  pageIndex === 0
                                    ? "bg-gray-100 text-gray-300 cursor-default"
                                    : "bg-gray-100 hover:bg-gray-200 transition-colors text-[#0f172a]"
                                }`}
                              >
                                <span className="text-[20px]">
                                  <ChevronLeft fontSize="inherit" />
                                </span>
                              </button>
                              <span className="font-serif text-[15px] font-medium select-none text-[#0f172a]">
                                Page{" "}
                                <span className="font-bold">
                                  {pageIndex + 1}
                                </span>{" "}
                                of{" "}
                                <span className="text-[#64748b]">
                                  {pages.length}
                                </span>
                              </span>
                              <button
                                onClick={() =>
                                  setPageIndex((i) =>
                                    Math.min(pages.length - 1, i + 1)
                                  )
                                }
                                disabled={pageIndex >= pages.length - 1}
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                  pageIndex >= pages.length - 1
                                    ? "bg-gray-100 text-gray-300 cursor-default"
                                    : "bg-gray-100 hover:bg-gray-200 transition-colors text-[#0f172a]"
                                }`}
                              >
                                <span className="text-[20px]">
                                  <ChevronRight fontSize="inherit" />
                                </span>
                              </button>
                            </div>
                          </div>

                          <div ref={paperRef}>
                            <div
                              className="accord-page"
                              style={{
                                width: "100%",
                                maxWidth: PAGE_MAX_WIDTH,
                                height: PAGE_HEIGHT,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                margin: "0 auto",
                                padding: PAGE_PADDING,
                                boxSizing: "border-box",
                                overflow: "hidden",
                              }}
                            >
                              <DocumentViewer
                                document={content}
                                visibleSectionIds={pages[pageIndex]}
                                activeSectionId={selectedSection?.id ?? null}
                                onSectionClick={(s) => setSelectedSection(s)}
                                onRaiseIssue={(s) => setIssueContext(s.content)}
                                onProposeAmendment={(s) => setProposalContext(s.content)}
                              />
                            </div>
                            <div className="mt-3 text-right text-sm text-gray-500">
                              Page {pageIndex + 1} of {pages.length}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500">No document content.</p>
                )}
              </div>
            </div>
          )}
        </main>
        <WorkspaceSidebar issueContext={issueContext} proposalContext={proposalContext} onClearContext={() => { setIssueContext(null); setProposalContext(null); }} />
      </div>
    </div>
  );
};

export default DocumentWorkspace;

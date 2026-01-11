"use client";

import React, { useState, useEffect } from "react";
import {
  DocumentSection,
  StructuredDocument,
} from "@/lib/document/structure";
import { Proposal, ProposalEdit } from "@/lib/types/proposals";
import { Info, CheckCircle, HourglassEmpty, Cancel } from "@mui/icons-material";

interface ReviewModeProps {
  document: StructuredDocument;
  dealId: string;
  onProposalClick?: (proposalId: string) => void;
}

interface SectionWithProposals extends DocumentSection {
  proposals: Array<{
    proposalId: string;
    proposalTitle: string;
    edit: ProposalEdit;
    status: string;
    author?: {
      first_name: string;
      last_name: string;
    };
  }>;
}

const ReviewMode: React.FC<ReviewModeProps> = ({
  document,
  dealId,
  onProposalClick,
}) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sectionsWithProposals, setSectionsWithProposals] = useState<
    SectionWithProposals[]
  >([]);
  const [hoveredProposal, setHoveredProposal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, [dealId]);

  useEffect(() => {
    if (proposals.length > 0) {
      mapProposalsToSections();
    }
  }, [proposals, document]);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/proposals?dealId=${dealId}`);
      const data = await response.json();
      if (response.ok) {
        // Only show submitted, in_review, and accepted proposals in review mode
        const visibleProposals = (data.proposals || []).filter(
          (p: Proposal) =>
            p.status === "submitted" ||
            p.status === "in_review" ||
            p.status === "accepted"
        );
        setProposals(visibleProposals);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapProposalsToSections = () => {
    const sectionsMap = new Map<string, SectionWithProposals>();

    // Initialize with all document sections
    document.sections.forEach((section) => {
      sectionsMap.set(section.id, { ...section, proposals: [] });
    });

    // Map proposals to sections
    proposals.forEach((proposal) => {
      proposal.edits?.forEach((edit) => {
        const section = sectionsMap.get(edit.section_id);
        if (section) {
          section.proposals.push({
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            edit,
            status: proposal.status,
            author: proposal.author,
          });
        }
      });
    });

    setSectionsWithProposals(Array.from(sectionsMap.values()));
  };

  const getProposalCountBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md">
        {count}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle fontSize="small" className="text-green-600" />;
      case "in_review":
        return <HourglassEmpty fontSize="small" className="text-yellow-600" />;
      case "rejected":
        return <Cancel fontSize="small" className="text-red-600" />;
      default:
        return <Info fontSize="small" className="text-blue-600" />;
    }
  };

  const renderSection = (section: SectionWithProposals) => {
    const hasProposals = section.proposals.length > 0;
    const acceptedProposals = section.proposals.filter(
      (p) => p.status === "accepted"
    );
    const pendingProposals = section.proposals.filter(
      (p) => p.status !== "accepted"
    );

    const baseClasses = `
      relative font-serif text-[15px] leading-relaxed p-3 -m-3 rounded-md
      transition-all
    `;

    const highlightClasses = hasProposals
      ? acceptedProposals.length > 0
        ? "bg-green-50 border-l-4 border-green-500"
        : "bg-yellow-50 border-l-4 border-yellow-400 hover:bg-yellow-100"
      : "";

    const renderSectionContent = () => {
      // If there's an accepted proposal, show the proposed text
      if (acceptedProposals.length > 0) {
        const acceptedEdit = acceptedProposals[0].edit;
        const displayContent =
          acceptedEdit.action === "delete"
            ? "[DELETED]"
            : acceptedEdit.proposed_text;

        switch (section.type) {
          case "heading":
            const level = section.metadata?.level || 3;
            const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag
                className={`
                  font-bold text-gray-900 mb-2 uppercase tracking-wide
                  ${level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg"}
                `}
              >
                {displayContent}
              </HeadingTag>
            );

          case "clause":
            return (
              <div>
                <span className="font-semibold text-indigo-700 mr-2">
                  {section.metadata?.clauseNumber}
                </span>
                <span className="text-gray-800">{displayContent}</span>
              </div>
            );

          case "list_item":
            return <div className="ml-6 text-gray-800">{displayContent}</div>;

          case "paragraph":
            return (
              <p className="text-gray-800 text-justify">{displayContent}</p>
            );

          default:
            return <div className="text-gray-800">{displayContent}</div>;
        }
      }

      // Otherwise show original content
      switch (section.type) {
        case "heading":
          const level = section.metadata?.level || 3;
          const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag
              className={`
                font-bold text-gray-900 mb-2 uppercase tracking-wide
                ${level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg"}
              `}
            >
              {section.content}
            </HeadingTag>
          );

        case "clause":
          const clauseText = section.content.replace(/^[\d.]+\s*/, "");
          return (
            <div>
              <span className="font-semibold text-indigo-700 mr-2">
                {section.metadata?.clauseNumber}
              </span>
              <span className="text-gray-800">{clauseText}</span>
            </div>
          );

        case "list_item":
          return <div className="ml-6 text-gray-800">{section.content}</div>;

        case "paragraph":
          return (
            <p className="text-gray-800 text-justify">{section.content}</p>
          );

        default:
          return <div className="text-gray-800">{section.content}</div>;
      }
    };

    return (
      <div
        key={section.id}
        className={`${baseClasses} ${highlightClasses} mb-2 group`}
      >
        {renderSectionContent()}

        {/* Proposal bubbles */}
        {hasProposals && (
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {section.proposals.map((proposal, index) => (
              <div
                key={`${proposal.proposalId}-${index}`}
                className="relative"
                onMouseEnter={() =>
                  setHoveredProposal(`${proposal.proposalId}-${index}`)
                }
                onMouseLeave={() => setHoveredProposal(null)}
              >
                <button
                  onClick={() =>
                    onProposalClick && onProposalClick(proposal.proposalId)
                  }
                  className={`
                    p-2 rounded-full shadow-md transition-all
                    ${
                      proposal.status === "accepted"
                        ? "bg-green-500 hover:bg-green-600"
                        : proposal.status === "in_review"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                    text-white
                  `}
                >
                  {getStatusIcon(proposal.status)}
                </button>

                {/* Hover tooltip */}
                {hoveredProposal === `${proposal.proposalId}-${index}` && (
                  <div className="absolute right-full mr-2 top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50 pointer-events-none">
                    <div className="text-xs font-semibold text-gray-900 mb-1">
                      {proposal.proposalTitle}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      by {proposal.author?.first_name}{" "}
                      {proposal.author?.last_name}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold capitalize">
                        {proposal.edit.action}:
                      </span>{" "}
                      {proposal.edit.category}
                    </div>
                    {proposal.edit.action !== "delete" && (
                      <div className="text-xs text-gray-700 line-clamp-3 bg-gray-50 p-2 rounded">
                        {proposal.edit.proposed_text}
                      </div>
                    )}
                    {proposal.edit.rationale && (
                      <div className="text-xs text-gray-600 italic mt-2">
                        "{proposal.edit.rationale}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Accepted indicator */}
        {acceptedProposals.length > 0 && (
          <div className="absolute -left-2 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-12 min-h-screen">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {document.metadata.fileName}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle fontSize="small" className="text-green-600" />
              <span className="text-gray-600 font-medium">
                Authoritative Draft
              </span>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>{document.metadata.totalSections} sections</span>
            <span>
              {document.metadata.totalCharacters.toLocaleString()} characters
            </span>
            <span>
              {proposals.length} active proposal
              {proposals.length !== 1 ? "s" : ""}
            </span>
          </div>
          {proposals.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <Info fontSize="small" className="inline mr-1" />
                Sections with proposed changes are highlighted. Click on the
                proposal bubbles to view details.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1">
          {sectionsWithProposals.map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;

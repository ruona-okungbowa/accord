"use client";

import React, { useState } from "react";
import {
  DocumentSection,
  StructuredDocument,
} from "@/lib/document/structure";
import {
  Close,
  Add,
  Send,
  Edit,
  Delete,
  ExpandMore,
  Check,
} from "@mui/icons-material";
import {
  DraftProposal,
  EditAction,
  EditCategory,
  ProposalEdit,
} from "@/lib/types/proposals";

interface ProposalEditorProps {
  document: StructuredDocument;
  dealId: string;
  onSubmit?: (proposal: DraftProposal) => Promise<void>;
  onCancel?: () => void;
}

interface DraftEdit extends Omit<ProposalEdit, "id" | "proposal_id" | "created_at"> {
  tempId: string;
}

const ProposalEditor: React.FC<ProposalEditorProps> = ({
  document,
  dealId,
  onSubmit,
  onCancel,
}) => {
  const [selectedSection, setSelectedSection] = useState<DocumentSection | null>(null);
  const [draftEdits, setDraftEdits] = useState<DraftEdit[]>([]);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalSummary, setProposalSummary] = useState("");

  // Edit form state
  const [editAction, setEditAction] = useState<EditAction>("replace");
  const [proposedText, setProposedText] = useState("");
  const [rationale, setRationale] = useState("");
  const [category, setCategory] = useState<EditCategory>("commercial");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSectionClick = (section: DocumentSection) => {
    setSelectedSection(section);
    // Pre-fill with current content for replace/modify actions
    if (editAction === "replace" || editAction === "modify") {
      setProposedText(section.content);
    } else if (editAction === "delete") {
      setProposedText("");
    }
  };

  const handleAddEdit = () => {
    if (!selectedSection) return;

    const newEdit: DraftEdit = {
      tempId: `temp-${Date.now()}`,
      section_id: selectedSection.id,
      action: editAction,
      original_text: selectedSection.content,
      proposed_text: proposedText,
      rationale,
      category,
      order: draftEdits.length,
    };

    setDraftEdits([...draftEdits, newEdit]);

    // Reset form
    setSelectedSection(null);
    setProposedText("");
    setRationale("");
  };

  const handleRemoveEdit = (tempId: string) => {
    setDraftEdits(draftEdits.filter((e) => e.tempId !== tempId));
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    if (draftEdits.length === 0) {
      alert("Please add at least one edit to the proposal");
      return;
    }

    if (!proposalTitle.trim()) {
      alert("Please provide a title for the proposal");
      return;
    }

    setIsSubmitting(true);
    try {
      const proposal: DraftProposal = {
        title: proposalTitle,
        summary: proposalSummary,
        edits: draftEdits.map(({ tempId, ...edit }) => edit),
      };

      if (onSubmit) {
        await onSubmit(proposal);
      }

      // Reset form
      setDraftEdits([]);
      setProposalTitle("");
      setProposalSummary("");
      setSelectedSection(null);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Error submitting proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionReference = (section: DocumentSection): string => {
    if (section.metadata?.clauseNumber) {
      return `Clause ${section.metadata.clauseNumber}`;
    }
    if (section.type === "heading") {
      return section.content.substring(0, 50);
    }
    return `Section ${section.order + 1}`;
  };

  const renderSection = (section: DocumentSection) => {
    const isSelected = selectedSection?.id === section.id;
    const hasEdit = draftEdits.some((e) => e.section_id === section.id);

    const baseClasses = `
      relative font-serif text-[15px] leading-relaxed transition-all p-3 -m-3 rounded-md
      cursor-pointer
    `;

    const stateClasses = isSelected
      ? "bg-indigo-100 ring-2 ring-indigo-500"
      : hasEdit
      ? "bg-green-50 border-l-4 border-green-500 pl-4"
      : "hover:bg-gray-50";

    const renderSectionContent = () => {
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
          return <p className="text-gray-800 text-justify">{section.content}</p>;

        default:
          return <div className="text-gray-800">{section.content}</div>;
      }
    };

    return (
      <div
        key={section.id}
        className={`${baseClasses} ${stateClasses} mb-2`}
        onClick={() => handleSectionClick(section)}
      >
        {renderSectionContent()}
        {hasEdit && (
          <span className="absolute -left-2 top-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Document view */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-12">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {document.metadata.fileName}
            </h1>
            <p className="text-sm text-indigo-600 font-medium">
              Click on any section to propose a change
            </p>
          </div>
          <div className="space-y-1">
            {document.sections.map((section) => renderSection(section))}
          </div>
        </div>
      </div>

      {/* Edit panel */}
      <div className="w-96 bg-white shadow-xl rounded-lg flex flex-col max-h-full overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-indigo-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">New Proposal</h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-1 hover:bg-indigo-100 rounded transition-colors"
              >
                <Close fontSize="small" />
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Proposal title"
            value={proposalTitle}
            onChange={(e) => setProposalTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none mb-2"
          />
          <textarea
            placeholder="Brief summary (optional)"
            value={proposalSummary}
            onChange={(e) => setProposalSummary(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none resize-none"
            rows={2}
          />
        </div>

        {selectedSection && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Selected: {getSectionReference(selectedSection)}
              </label>
              <div className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200 max-h-24 overflow-y-auto">
                {selectedSection.content.substring(0, 200)}
                {selectedSection.content.length > 200 && "..."}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Action
                </label>
                <select
                  value={editAction}
                  onChange={(e) => setEditAction(e.target.value as EditAction)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="replace">Replace</option>
                  <option value="modify">Modify</option>
                  <option value="delete">Delete</option>
                  <option value="insert">Insert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EditCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="commercial">Commercial</option>
                  <option value="legal">Legal</option>
                  <option value="risk">Risk</option>
                  <option value="compliance">Compliance</option>
                  <option value="technical">Technical</option>
                  <option value="clarification">Clarification</option>
                </select>
              </div>

              {editAction !== "delete" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Proposed Text
                  </label>
                  <textarea
                    value={proposedText}
                    onChange={(e) => setProposedText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600 resize-none"
                    rows={4}
                    placeholder="Enter your proposed text..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rationale
                </label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600 resize-none"
                  rows={2}
                  placeholder="Why this change?"
                />
              </div>

              <button
                onClick={handleAddEdit}
                disabled={editAction !== "delete" && !proposedText.trim()}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Add fontSize="small" />
                Add to Proposal
              </button>
            </div>
          </div>
        )}

        {/* Edits list */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Edits ({draftEdits.length})
          </h3>
          {draftEdits.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No edits yet. Click on a section to start.
            </p>
          ) : (
            <div className="space-y-3">
              {draftEdits.map((edit) => {
                const section = document.sections.find(
                  (s) => s.id === edit.section_id
                );
                return (
                  <div
                    key={edit.tempId}
                    className="bg-gray-50 border border-gray-200 rounded p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-semibold text-indigo-700">
                          {section && getSectionReference(section)}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {edit.action} · {edit.category}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveEdit(edit.tempId)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Delete fontSize="small" className="text-gray-600" />
                      </button>
                    </div>
                    {edit.action !== "delete" && (
                      <div className="text-xs text-gray-700 mb-1 line-clamp-2">
                        {edit.proposed_text}
                      </div>
                    )}
                    {edit.rationale && (
                      <div className="text-xs text-gray-500 italic">
                        "{edit.rationale}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit buttons */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={draftEdits.length === 0 || !proposalTitle.trim() || isSubmitting}
            className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send fontSize="small" />
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={draftEdits.length === 0 || !proposalTitle.trim() || isSubmitting}
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;

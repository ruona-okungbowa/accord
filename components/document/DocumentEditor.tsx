"use client";

import React, { useState, useEffect } from "react";
import {
  DocumentSection,
  StructuredDocument,
} from "@/lib/document/structure";
import { Edit, Save, Cancel, Comment, History } from "@mui/icons-material";

interface DocumentChange {
  sectionId: string;
  originalContent: string;
  newContent: string;
  timestamp: string;
}

interface DocumentEditorProps {
  document: StructuredDocument;
  dealId: string;
  onSave?: (changes: DocumentChange[]) => Promise<void>;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  dealId,
  onSave,
}) => {
  const [sections, setSections] = useState<DocumentSection[]>(
    document.sections
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [changes, setChanges] = useState<DocumentChange[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditStart = (section: DocumentSection) => {
    setEditingSection(section.id);
    setEditContent(section.content);
  };

  const handleEditSave = (section: DocumentSection) => {
    if (editContent === section.content) {
      setEditingSection(null);
      return;
    }

    const updatedSections = sections.map((s) =>
      s.id === section.id ? { ...s, content: editContent } : s
    );

    setSections(updatedSections);

    const change: DocumentChange = {
      sectionId: section.id,
      originalContent: section.content,
      newContent: editContent,
      timestamp: new Date().toISOString(),
    };

    setChanges([...changes, change]);
    setEditingSection(null);
  };

  const handleEditCancel = () => {
    setEditingSection(null);
    setEditContent("");
  };

  const handleSaveAll = async () => {
    if (changes.length === 0) return;

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(changes);
      }
      setChanges([]);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = (sectionId: string): boolean => {
    return changes.some((c) => c.sectionId === sectionId);
  };

  const renderSection = (section: DocumentSection) => {
    const isEditing = editingSection === section.id;
    const isChanged = hasChanges(section.id);
    const isHovered = hoveredSection === section.id;

    const currentSection = sections.find((s) => s.id === section.id);
    const displayContent = currentSection?.content || section.content;

    if (isEditing) {
      return (
        <div
          key={section.id}
          className="relative group bg-indigo-50 p-4 rounded-lg border-2 border-indigo-500"
        >
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 font-serif text-[15px] leading-relaxed resize-y min-h-[100px]"
            rows={Math.max(3, editContent.split("\n").length)}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleEditSave(section)}
              className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save fontSize="small" />
              Save Change
            </button>
            <button
              onClick={handleEditCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <Cancel fontSize="small" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    const baseClasses = `
      relative font-serif text-[15px] leading-relaxed transition-all
      cursor-pointer group
    `;

    const hoverClasses = `
      hover:bg-indigo-50 rounded-md
    `;

    const changedClasses = isChanged
      ? "bg-yellow-50 border-l-4 border-yellow-400 pl-4 ml-[-16px]"
      : "";

    const renderSectionContent = () => {
      switch (section.type) {
        case "heading":
          const level = section.metadata?.level || 3;
          const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;

          return (
            <HeadingTag
              className={`
                font-bold text-gray-900 mb-4 mt-8 uppercase tracking-wide
                ${level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg"}
              `}
            >
              {displayContent}
            </HeadingTag>
          );

        case "clause":
          const clauseText = displayContent.replace(/^[\d.]+\s*/, "");
          return (
            <div className="mb-4">
              <span className="font-semibold text-indigo-700 mr-2">
                {section.metadata?.clauseNumber}
              </span>
              <span className="text-gray-800">{clauseText}</span>
            </div>
          );

        case "list_item":
          return (
            <div className="mb-2 ml-8 text-gray-800">{displayContent}</div>
          );

        case "paragraph":
          return (
            <p className="mb-4 text-gray-800 text-justify">{displayContent}</p>
          );

        default:
          return <div className="mb-4 text-gray-800">{displayContent}</div>;
      }
    };

    return (
      <div
        key={section.id}
        className={`${baseClasses} ${hoverClasses} ${changedClasses} p-2 -m-2`}
        onClick={() => handleEditStart(section)}
        onMouseEnter={() => setHoveredSection(section.id)}
        onMouseLeave={() => setHoveredSection(null)}
        data-section-id={section.id}
      >
        {renderSectionContent()}
        {isHovered && !isEditing && (
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1.5 bg-white border border-gray-300 rounded shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleEditStart(section);
              }}
            >
              <Edit fontSize="small" className="text-gray-600" />
            </button>
            <button
              className="p-1.5 bg-white border border-gray-300 rounded shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Comment fontSize="small" className="text-gray-600" />
            </button>
          </div>
        )}
        {isChanged && (
          <div className="absolute left-[-8px] top-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {changes.length > 0 && (
        <div className="sticky top-0 z-50 bg-yellow-50 border-b-2 border-yellow-400 px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="text-yellow-700" />
              <span className="font-semibold text-yellow-900">
                {changes.length} unsaved {changes.length === 1 ? "change" : "changes"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChanges([])}
                className="px-4 py-2 bg-white border border-yellow-300 text-yellow-900 rounded hover:bg-yellow-100 transition-colors text-sm font-medium"
              >
                Discard All
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save fontSize="small" />
                {isSaving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-12 min-h-screen">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {document.metadata.fileName}
            </h1>
            <div className="flex gap-6 text-sm text-gray-500">
              <span>{document.metadata.totalSections} sections</span>
              <span>
                {document.metadata.totalCharacters.toLocaleString()} characters
              </span>
              <span>
                Extracted on{" "}
                {new Date(document.metadata.extractedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {sections.map((section) => renderSection(section))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;

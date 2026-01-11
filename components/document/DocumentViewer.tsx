"use client";

import React, { useState } from "react";
import {
  DocumentSection,
  StructuredDocument,
} from "@/lib/document/structure";

interface DocumentViewerProps {
  document: StructuredDocument;
  editable?: boolean;
  onSectionEdit?: (sectionId: string, newContent: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  editable = false,
  onSectionEdit,
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  const handleEditStart = (section: DocumentSection) => {
    if (!editable) return;
    setEditingSection(section.id);
    setEditContent(section.content);
  };

  const handleEditSave = (sectionId: string) => {
    if (onSectionEdit) {
      onSectionEdit(sectionId, editContent);
    }
    setEditingSection(null);
  };

  const handleEditCancel = () => {
    setEditingSection(null);
    setEditContent("");
  };

  const renderSection = (section: DocumentSection) => {
    const isEditing = editingSection === section.id;

    if (isEditing) {
      return (
        <div className="relative group" key={section.id}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 font-serif text-[15px] leading-relaxed"
            rows={Math.max(3, editContent.split("\n").length)}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleEditSave(section.id)}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleEditCancel}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    const commonClasses = `
      font-serif text-[15px] leading-relaxed
      ${editable ? "cursor-pointer hover:bg-indigo-50 rounded p-2 -m-2 transition-colors" : ""}
    `;

    switch (section.type) {
      case "heading":
        const level = section.metadata?.level || 3;
        const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;

        return (
          <HeadingTag
            key={section.id}
            onClick={() => handleEditStart(section)}
            className={`
              font-bold text-gray-900 mb-4 mt-8 uppercase tracking-wide
              ${level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg"}
              ${commonClasses}
            `}
            data-section-id={section.id}
          >
            {section.content}
          </HeadingTag>
        );

      case "clause":
        return (
          <div
            key={section.id}
            onClick={() => handleEditStart(section)}
            className={`mb-4 ${commonClasses}`}
            data-section-id={section.id}
          >
            <span className="font-semibold text-indigo-700 mr-2">
              {section.metadata?.clauseNumber}
            </span>
            <span className="text-gray-800">
              {section.content.replace(/^[\d.]+\s*/, "")}
            </span>
          </div>
        );

      case "list_item":
        return (
          <div
            key={section.id}
            onClick={() => handleEditStart(section)}
            className={`mb-2 ml-8 text-gray-800 ${commonClasses}`}
            data-section-id={section.id}
          >
            {section.content}
          </div>
        );

      case "paragraph":
        return (
          <p
            key={section.id}
            onClick={() => handleEditStart(section)}
            className={`mb-4 text-gray-800 text-justify ${commonClasses}`}
            data-section-id={section.id}
          >
            {section.content}
          </p>
        );

      default:
        return (
          <div
            key={section.id}
            onClick={() => handleEditStart(section)}
            className={`mb-4 text-gray-800 ${commonClasses}`}
            data-section-id={section.id}
          >
            {section.content}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-12 min-h-screen">
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {document.metadata.fileName}
          </h1>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>{document.metadata.totalSections} sections</span>
            <span>{document.metadata.totalCharacters.toLocaleString()} characters</span>
            <span>
              Extracted on {new Date(document.metadata.extractedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          {document.sections.map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;

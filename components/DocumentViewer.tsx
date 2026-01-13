"use client";
import { StructuredDocument, DocumentSection } from "@/lib/document/structure";
import React, { useMemo, useState } from "react";

interface Props {
  document: StructuredDocument;
  flaggedSectionIds?: string[];
  activeSectionId?: string | null;
  onSectionClick?: (section: DocumentSection) => void;
  readOnly?: boolean;
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const DocumentViewer = ({
  document,
  activeSectionId,
  onSectionClick,
  readOnly = false,
  flaggedSectionIds = [],
}: Props) => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const flagged = useMemo(
    () => new Set(flaggedSectionIds),
    [flaggedSectionIds]
  );

  function splitClauseNumber(text: string): {
    number: string | null;
    rest: string;
  } {
    const t = text.trim();
    const m = t.match(/^(\d+(?:\.\d+)*)(?:\.?)\s+(.*)$/);
    if (!m) return { number: null, rest: t };
    return { number: m[1], rest: m[2] };
  }

  function splitListMarker(text: string): {
    marker: string | null;
    rest: string;
    indentLevel: 1 | 2;
  } {
    const t = text.trim();
    const m = t.match(
      /^([•\-\*]|\([a-z]\)|\([A-Z]\)|[a-z]\)|[A-Z]\)|\([ivxIVX]+\)|[ivxIVX]+\)|[a-d]\.)\s+(.*)$/
    );
    if (!m) return { marker: null, rest: t, indentLevel: 1 };

    const marker = m[1];
    const rest = m[2];

    const isRoman =
      /^\([ivxIVX]+\)$/.test(marker) || /^[ivxIVX]+\)$/.test(marker);
    return { marker, rest, indentLevel: isRoman ? 2 : 1 };
  }

  return (
    <div>
      {document.sections.map((section) => {
        const isSelected = activeSectionId === section.id;
        const isHover = hoverId === section.id;
        const isFlagged = flagged.has(section.id);

        const common = cx(
          "accord-block",
          isSelected && "selected-element",
          isFlagged && "ring-1 ring-amber-400"
        );

        const handleClick = () => {
          if (readOnly) return;
          onSectionClick?.(section);
        };

        const hoverPill = isHover ? (
          <span className="ml-2 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm">
            HOVER
          </span>
        ) : null;

        if (section.type === "heading") {
          const level = section.metadata?.level ?? 3;
          const isLevel1 = level <= 1;

          return (
            <div
              key={section.id}
              data-section-id={section.id}
              className={common}
              onMouseEnter={() => setHoverId(section.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={handleClick}
            >
              <div
                className={isLevel1 ? "accord-heading-l1" : "accord-heading-l3"}
              >
                {section.content}
                {hoverPill}
              </div>
            </div>
          );
        }
        if (section.type === "clause") {
          const { number, rest } = splitClauseNumber(section.content);
          return (
            <div
              key={section.id}
              data-section-id={section.id}
              className={common}
              onMouseEnter={() => setHoverId(section.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={handleClick}
            >
              <div className="accord-clause">
                <div className="accord-clause-number">
                  {number ?? section.metadata?.clauseNumber ?? "—"}
                </div>
                <div className="accord-clause-text">
                  {rest}
                  {hoverPill}
                </div>
              </div>
            </div>
          );
        }
        if (section.type === "list_item") {
          const { marker, rest, indentLevel } = splitListMarker(
            section.content
          );
          return (
            <div
              key={section.id}
              data-section-id={section.id}
              className={common}
              onMouseEnter={() => setHoverId(section.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={handleClick}
              style={{
                marginLeft: indentLevel === 2 ? 32 : 0,
              }}
            >
              <div className="accord-list">
                <div className="accord-list-marker">{marker ?? "•"}</div>
                <div className="accord-list-text">
                  {rest}
                  {hoverPill}
                </div>
              </div>
            </div>
          );
        }
        return (
          <div
            key={section.id}
            data-section-id={section.id}
            className={common}
            onMouseEnter={() => setHoverId(section.id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={handleClick}
          >
            <p className="accord-paragraph">
              {section.content}
              {hoverPill}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentViewer;

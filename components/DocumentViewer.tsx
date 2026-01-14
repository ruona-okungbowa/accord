"use client";
import { StructuredDocument, DocumentSection } from "@/lib/document/structure";
import { AddComment, EditNote } from "@mui/icons-material";
import React, { useMemo, useState } from "react";

interface Props {
  document: StructuredDocument;
  flaggedSectionIds?: string[];
  activeSectionId?: string | null;
  onSectionClick?: (section: DocumentSection) => void;
  onRaiseIssue?: (section: DocumentSection) => void;
  onProposeAmendment?: (section: DocumentSection) => void;
  readOnly?: boolean;
  containerRef?: React.Ref<HTMLDivElement>;
  visibleSectionIds?: string[];
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const DocumentViewer = ({
  document,
  activeSectionId,
  onSectionClick,
  onRaiseIssue,
  onProposeAmendment,
  readOnly = false,
  flaggedSectionIds = [],
  containerRef,
  visibleSectionIds,
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

  function splitHeading(text: string): string[] {
    const match = text.match(/^(SECTION\s+\d+)\s+(.+)$/i);
    if (match) {
      return [match[1], match[2]];
    }
    return [text];
  }

  function formatDefinedTerms(text: string) {
    // Render text with quoted terms wrapped in <strong> without affecting other text.
    const parts: Array<{ type: "text" | "quote"; text: string }> = [];
    const re = /"([^\"]+)"/g;
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > lastIndex) {
        parts.push({ type: "text", text: text.slice(lastIndex, m.index) });
      }
      parts.push({ type: "quote", text: m[1] });
      lastIndex = re.lastIndex;
    }
    if (lastIndex < text.length)
      parts.push({ type: "text", text: text.slice(lastIndex) });

    return parts.map((p, i) =>
      p.type === "quote" ? (
        <React.Fragment key={i}>
          <span>&quot;</span>
          <strong className="font-semibold text-slate-900">{p.text}</strong>
          <span>&quot;</span>
        </React.Fragment>
      ) : (
        <span key={i}>{p.text}</span>
      )
    );
  }

  function renderSection(section: DocumentSection) {
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
      if (isSelected) {
        onSectionClick?.(null as any);
      } else {
        onSectionClick?.(section);
      }
    };

    const renderActionToolbar = () => {
      if (!isSelected || readOnly) return null;
      return (
        <div className="absolute left-0 -top-12 flex items-center bg-[#0f172a] text-white rounded-md shadow-xl overflow-hidden z-20">
          <button onClick={() => onRaiseIssue?.(section)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-800 border-r border-white/10 transition-colors">
            <span className="text-[16px]">
              <AddComment fontSize="inherit" />
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider">
              Raise Issue
            </span>
          </button>
          <button onClick={() => onProposeAmendment?.(section)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-800 transition-colors">
            <span className="text-[16px]">
              <EditNote fontSize="inherit" />
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider">
              Propose Amendment
            </span>
          </button>
        </div>
      );
    };

    if (section.type === "heading") {
      const level = section.metadata?.level ?? 3;
      const isLevel1 = level <= 1;
      const headingLines = splitHeading(section.content);
      return (
        <div
          key={section.id}
          data-section-id={section.id}
          className={common}
          onMouseEnter={() => setHoverId(section.id)}
          onMouseLeave={() => setHoverId(null)}
          onClick={handleClick}
        >
          {renderActionToolbar()}
          <div
            className={
              isLevel1
                ? "accord-heading-l1"
                : level === 2
                ? "accord-heading-l2"
                : "accord-heading-l3"
            }
          >
            {headingLines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
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
          {renderActionToolbar()}
          <div className="accord-clause">
            <div className="accord-clause-number">
              {number ?? section.metadata?.clauseNumber ?? "—"}
            </div>
            <div className="accord-clause-text">
              {formatDefinedTerms(rest || section.content)}
            </div>
          </div>
        </div>
      );
    }
    if (section.type === "list_item") {
      const { marker, rest, indentLevel } = splitListMarker(section.content);
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
          {renderActionToolbar()}
          <div className="accord-list">
            <div className="accord-list-marker">{marker ?? "•"}</div>
            <div className="accord-list-text">
              {formatDefinedTerms(rest || section.content)}
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
        {renderActionToolbar()}
        <p className="accord-paragraph">
          {formatDefinedTerms(section.content)}
        </p>
      </div>
    );
  }
  // determine which sections to render (allow parent to paginate)
  const sectionsToRender = Array.isArray(visibleSectionIds)
    ? document.sections.filter((s) => visibleSectionIds.includes(s.id))
    : document.sections;

  return (
    <div ref={containerRef}>
      {sectionsToRender.map((s) => renderSection(s))}
    </div>
  );
};

export default DocumentViewer;

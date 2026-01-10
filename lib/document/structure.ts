/**
 * Document structuring file
 * Converts the raw document text into a structured format optimised for redlining
 * Tracks positions, paragraphs, and clauses for change tracking
 */

export interface DocumentSection {
  id: string;
  type: "heading" | "clause" | "paragraph" | "list_item";
  content: string;
  startPosition: number;
  endPosition: number;
  order: number;
  metadata?: {
    level?: number;
    clauseNumber?: string;
    parent?: string;
  };
}

export interface StructuredDocument {
  version: number;
  metadata: {
    fileName: string;
    fileType: string;
    extractedAt: string;
    totalSections: number;
    totalCharacters: number;
  };
  sections: DocumentSection[];
  fullText: string;
}

/**
 * Helpers
 */
function isPageRefLine(s: string) {
  // ".14", ".21", ".7", ".30" etc
  return /^\.\d{1,4}$/.test(s.trim());
}

function isClauseHeadingLine(s: string) {
  // Starts with a clause number, followed by whitespace, then real text (letter/quote)
  // Avoids junk like "2 3 4"
  const c = s.trim();
  return /^\d+(?:\.\d+)*\.?\s+(?=[A-Za-z"])/.test(c);
}

function isBareClauseNumber(s: string) {
  // "10." "1." "1.1" (sometimes without trailing dot)
  return /^\d+(?:\.\d+)*\.?$/.test(s.trim());
}

function isStructuralKeywordHeading(s: string) {
  return /^(SECTION|SCHEDULE|PART|ARTICLE|EXHIBIT|APPENDIX)\b/i.test(s.trim());
}

function isAllCapsMeaningfulHeading(s: string) {
  const t = s.trim();
  const isAllCaps = t === t.toUpperCase() && /[A-Z]/.test(t);
  const wordCount = t.split(/\s+/).filter(Boolean).length;

  if (!isAllCaps) return false;

  // Keep headings meaningful (avoid "UK", "LMA", "IFRS.")
  if (wordCount < 2 && t.length < 10) return false;
  if (t.length < 8) return false;

  // Avoid definition lines starting with quotes
  if (/^"[A-Z]/.test(t)) return false;

  return true;
}

function isBareListMarker(s: string) {
  // "(a)" "(b)" "(i)" "(ii)" "(A)" etc, but ONLY the marker
  return /^\([a-zA-Z]{1,4}\)$/.test(s.trim());
}

function looksLikeListContinuation(prev: string, curr: string) {
  const p = prev.trim();
  const c = curr.trim();
  if (!p || !c) return false;

  if (/[,:;–-]$/.test(p)) return true;
  if (/^(with|and|or|to|from|in|on|by|for|of)\b/i.test(c)) return true;
  if (/^[a-z]/.test(c)) return true;

  return false;
}

/**
 * Detect the type of section based on content patterns
 */
function detectSectionType(
  content: string
): "heading" | "clause" | "paragraph" | "list_item" {
  const c = content.trim();

  if (isStructuralKeywordHeading(c) || isAllCapsMeaningfulHeading(c)) {
    return "heading";
  }

  if (isClauseHeadingLine(c) && !isBareClauseNumber(c)) {
    return "clause";
  }

  if (
    /^([•\-\*]|\([a-z]\)|[a-z]\)|\([ivxIVX]+\)|[ivxIVX]+\)|[a-d]\.)\s+/.test(c)
  ) {
    return "list_item";
  }

  return "paragraph";
}

/**
 * Extract metadata from section content
 */
function extractMetadata(
  content: string,
  type: "heading" | "clause" | "paragraph" | "list_item"
): DocumentSection["metadata"] {
  const metadata: DocumentSection["metadata"] = {};
  const c = content.trim();

  if (type === "heading") {
    if (/^SECTION\s+(\d+)/i.test(c)) {
      const match = c.match(/^SECTION\s+(\d+)/i);
      if (match) {
        metadata.level = 1;
        metadata.clauseNumber = match[1];
      }
    } else if (/^(PART|ARTICLE)\b/i.test(c)) {
      metadata.level = 1;
    } else if (/^SCHEDULE\s+(\d+)/i.test(c)) {
      metadata.level = 2;
    } else {
      metadata.level = 3;
    }
  }

  if (type === "clause") {
    const match = c.match(/^(\d+(?:\.\d+)*)/);
    if (match) {
      metadata.clauseNumber = match[1];
      const parts = match[1].split(".");
      if (parts.length > 1) {
        metadata.parent = parts.slice(0, -1).join(".");
      }
    }
  }

  return metadata;
}

function generateSectionId(order: number): string {
  return `section-${order.toString().padStart(6, "0")}`;
}

/**
 * Normalises the text that comes from the Document AI OCR
 */
function normaliseForStructring(rawText: string, fileType: string): string {
  let t = (rawText || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Conservative cleanup of common OCR artefacts
  t = t.replace(/[Σ어흐으이]/g, "");
  t = t.replace(/\(\!\!\!\)|\(\!\!\)|\(\!\)/g, "");
  t = t.replace(/[ \t]{2,}/g, " ");

  // Remove page numbers and known footers
  t = t.replace(/\n\d{1,3}\n/g, "\n");
  t = t.replace(/Linklaters\s*\n\s*6 December 2022/g, "");
  t = t.replace(/Ref: L-317135\s*\n/g, "");

  // Remove table of contents
  const tocStart = t.indexOf("CONTENTS");
  const section1Start = t.indexOf("SECTION 1");
  if (tocStart !== -1 && section1Start !== -1 && tocStart < section1Start) {
    t = t.substring(0, tocStart) + t.substring(section1Start);
  }

  let lines = t
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  lines = lines.filter((l) => {
    if (/^\d{1,4}$/.test(l)) return false;
    if (/^\d{2,}$/.test(l) && new Set(l.split("")).size === 1) return false;
    if (/SHAREHOLDER LOAN FACILITY AGREEMENT - SIGNATURE PAGE/.test(l))
      return false;
    if (/^\s*H\s*$/.test(l)) return false;
    return true;
  });

  const isHeadingLine = (l: string) => {
    if (/^(SECTION|SCHEDULE|PART|ARTICLE|EXHIBIT)\s+\d+/i.test(l)) return true;

    if (l.length <= 120 && l === l.toUpperCase() && /[A-Z]/.test(l)) {
      if (/^"[A-Z]/.test(l)) return false;
      const wc = l.split(/\s+/).filter(Boolean).length;
      if (wc < 2 && l.length <= 10) return false;
      return true;
    }

    return false;
  };

  const isClauseStart = (l: string) => {
    return isClauseHeadingLine(l) && !isBareClauseNumber(l);
  };

  const isListItem = (l: string) => {
    return /^([•\-\*]|\([a-z]\)|[a-z]\)|\([ivxIVX]+\)|[ivxIVX]+\)|[a-d]\.)\s+/.test(
      l
    );
  };

  const shouldJoinWrappedLine = (prev: string, curr: string) => {
    if (fileType !== "application/pdf") return false;
    if (isHeadingLine(curr) || isClauseStart(curr) || isListItem(curr))
      return false;
    if (/[.;:!?"]$/.test(prev)) return false;

    if (/^[a-z]/.test(curr) && /[a-z0-9,)]$/.test(prev)) return true;
    if (/\b(of|to|and|or|the|a|an)\s*$/.test(prev)) return true;
    if (/\($/.test(prev)) return true;

    return false;
  };

  const paragraphs: string[] = [];
  let current = "";

  for (const line of lines) {
    if (isHeadingLine(line) || isClauseStart(line)) {
      if (current.trim()) paragraphs.push(current.trim());
      current = line;
      continue;
    }

    if (!current) {
      current = line;
      continue;
    }

    if (shouldJoinWrappedLine(current, line)) {
      current = `${current} ${line}`;
    } else {
      paragraphs.push(current.trim());
      current = line;
    }
  }

  if (current.trim()) paragraphs.push(current.trim());

  return paragraphs
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Post-process sections
 */
function postProcessSections(sections: DocumentSection[]): DocumentSection[] {
  const out: DocumentSection[] = [];

  for (let i = 0; i < sections.length; i++) {
    const cur = sections[i];
    const next = sections[i + 1];
    const curText = cur.content.trim();

    // drop page refs + pure numbers
    if (isPageRefLine(curText) || /^\d{1,4}$/.test(curText)) continue;

    // Merge "SECTION X" + next heading title (e.g. "UTILISATION")
    if (
      cur.type === "heading" &&
      /^SECTION\s+\d+$/i.test(curText) &&
      next &&
      next.type === "heading"
    ) {
      const nextText = next.content.trim();
      if (
        isAllCapsMeaningfulHeading(nextText) ||
        isStructuralKeywordHeading(nextText)
      ) {
        out.push({
          ...cur,
          content: `${curText} — ${nextText}`,
          endPosition: next.endPosition,
          metadata: { ...(cur.metadata || {}), level: 1 },
        });
        i++;
        continue;
      }
    }

    // Merge bare clause number + following HEADING
    if (
      (cur.type === "paragraph" || cur.type === "clause") &&
      isBareClauseNumber(curText) &&
      next &&
      next.type === "heading"
    ) {
      const mergedText = `${curText} ${next.content.trim()}`;
      const clauseMatch = mergedText.match(/^(\d+(?:\.\d+)*)/);
      const clauseNumber = clauseMatch?.[1];

      out.push({
        ...cur,
        type: "clause",
        content: mergedText,
        endPosition: next.endPosition,
        metadata: {
          clauseNumber,
          parent: clauseNumber?.includes(".")
            ? clauseNumber.split(".").slice(0, -1).join(".")
            : undefined,
        },
      });

      i++;
      continue;
    }

    // Merge bare clause number + next line
    if (
      (cur.type === "paragraph" || cur.type === "clause") &&
      isBareClauseNumber(curText) &&
      next &&
      next.type !== "heading" &&
      !isBareClauseNumber(next.content)
    ) {
      const mergedText = `${curText} ${next.content.trim()}`;
      const clauseMatch = mergedText.match(/^(\d+(?:\.\d+)*)/);
      const clauseNumber = clauseMatch?.[1];

      out.push({
        ...cur,
        type: "clause",
        content: mergedText,
        endPosition: next.endPosition,
        metadata: {
          clauseNumber,
          parent: clauseNumber?.includes(".")
            ? clauseNumber.split(".").slice(0, -1).join(".")
            : undefined,
        },
      });

      i++;
      continue;
    }

    // Merge list markers like "(a)" with following text
    if (
      (cur.type === "paragraph" || cur.type === "list_item") &&
      isBareListMarker(curText) &&
      next &&
      next.type !== "heading" &&
      !isBareClauseNumber(next.content) &&
      !isBareListMarker(next.content)
    ) {
      out.push({
        ...cur,
        type: "list_item",
        content: `${curText} ${next.content.trim()}`,
        endPosition: next.endPosition,
        metadata: {},
      });

      i++;
      continue;
    }

    // Merge list continuation paragraphs into previous list_item
    if (
      out.length > 0 &&
      out[out.length - 1].type === "list_item" &&
      cur.type === "paragraph" &&
      !isBareClauseNumber(curText) &&
      !isBareListMarker(curText) &&
      !isStructuralKeywordHeading(curText) &&
      looksLikeListContinuation(out[out.length - 1].content, curText)
    ) {
      const prev = out[out.length - 1];
      out[out.length - 1] = {
        ...prev,
        content: `${prev.content.trim()} ${curText}`,
        endPosition: cur.endPosition,
      };
      continue;
    }

    // Downgrade short single-word ALLCAPS headings (IFRS, UK, LMA, etc)
    if (
      cur.type === "heading" &&
      curText === curText.toUpperCase() &&
      curText.split(/\s+/).length === 1 &&
      curText.length <= 10
    ) {
      out.push({ ...cur, type: "paragraph", metadata: {} });
      continue;
    }

    out.push(cur);
  }

  return out.map((s, idx) => ({
    ...s,
    order: idx,
    id: generateSectionId(idx),
  }));
}

/**
 * Find a section by character position
 */
export function findSectionByPosition(
  doc: StructuredDocument,
  position: number
): DocumentSection | null {
  return (
    doc.sections.find(
      (s) => position >= s.startPosition && position <= s.endPosition
    ) || null
  );
}

/**
 * Get a reference string for a section (for display)
 */
export function getSectionReference(section: DocumentSection): string {
  if (section.metadata?.clauseNumber)
    return `Clause ${section.metadata.clauseNumber}`;
  if (section.type === "heading")
    return `Heading: ${section.content.substring(0, 50)}...`;
  return `Section ${section.order + 1}`;
}

/**
 * Structure raw text into sections
 */
export function structureText(
  text: string,
  fileName: string,
  fileType: string
): StructuredDocument {
  const normalised = normaliseForStructring(text, fileType);

  const sections: DocumentSection[] = [];
  let currentPosition = 0;
  let sectionOrder = 0;

  const paragraphs = normalised
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => {
      if (p.length === 0) return false;
      if (/^\s*(\[.*\]|_+|\s*By:\s*)$/.test(p)) return false;
      if (p.length < 3 && !/^[A-Z]{1,2}$/.test(p)) return false;
      return true;
    });

  for (const paragraph of paragraphs) {
    const content = paragraph;
    const startPosition = currentPosition;
    const endPosition = startPosition + content.length;

    const sectionType = detectSectionType(content);
    const metadata = extractMetadata(content, sectionType);

    sections.push({
      id: generateSectionId(sectionOrder),
      type: sectionType,
      content,
      startPosition,
      endPosition,
      order: sectionOrder,
      metadata,
    });

    currentPosition = endPosition + 2; // "\n\n"
    sectionOrder++;
  }

  const cleanedSections = postProcessSections(sections);

  return {
    version: 1,
    metadata: {
      fileName,
      fileType,
      extractedAt: new Date().toISOString(),
      totalSections: cleanedSections.length,
      totalCharacters: normalised.length,
    },
    sections: cleanedSections,
    fullText: normalised,
  };
}

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
 * Detect the type of section based on content patterns
 */
function detectSectionType(
  content: string
): "heading" | "clause" | "paragraph" | "list_item" {
  // Detect headings (all caps, short, or starts with specific patterns)
  if (
    content.length < 100 &&
    (content === content.toUpperCase() ||
      /^(SCHEDULE|PART|SECTION|ARTICLE|EXHIBIT)/i.test(content))
  ) {
    return "heading";
  }

  // Detect clauses (starts with number patterns like "1.", "1.1", "2.3.4")
  if (/^\d+(\.\d+)*\.?\s+/.test(content)) {
    return "clause";
  }

  // Detect list items (starts with bullet points, letters, or roman numerals)
  if (/^[\s]*[•\-\*]|^\s*\([a-z]\)|^\s*[ivxIVX]+\)/.test(content)) {
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

  if (type === "heading") {
    // Detect heading level (basic heuristic)
    if (/^(PART|ARTICLE)\s+/i.test(content)) {
      metadata.level = 1;
    } else if (/^(SECTION|SCHEDULE)\s+/i.test(content)) {
      metadata.level = 2;
    } else {
      metadata.level = 3;
    }
  }

  if (type === "clause") {
    // Extract clause number (e.g., "1.1", "2.3.4")
    const match = content.match(/^(\d+(?:\.\d+)*)/);
    if (match) {
      metadata.clauseNumber = match[1];
    }
  }

  return metadata;
}

/**
 * Generate a unique section ID
 */
function generateSectionId(order: number): string {
  return `section-${order.toString().padStart(6, "0")}`;
}

/**
 * Find a section by character position (for linking issues/comments)
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
  if (section.metadata?.clauseNumber) {
    return `Clause ${section.metadata.clauseNumber}`;
  }
  if (section.type === "heading") {
    return `Heading: ${section.content.substring(0, 50)}...`;
  }
  return `Section ${section.order + 1}`;
}

/**
 * Structure raw text into sections for redlining
 * Optimized for legal/loan agreement documents
 */
export function structureText(
  text: string,
  fileName: string,
  fileType: string
): StructuredDocument {
  const sections: DocumentSection[] = [];
  let currentPosition = 0;
  let sectionOrder = 0;

  // Split text into paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  for (const paragraph of paragraphs) {
    const content = paragraph;
    const startPosition = currentPosition;
    const endPosition = startPosition + content.length;

    const sectionType = detectSectionType(content);
    const metadata = extractMetadata(content, sectionType);

    const section: DocumentSection = {
      id: generateSectionId(sectionOrder),
      type: sectionType,
      content,
      startPosition,
      endPosition,
      order: sectionOrder,
      metadata,
    };

    sections.push(section);
    currentPosition = endPosition + 2;
    sectionOrder++;
  }

  return {
    version: 1,
    metadata: {
      fileName: fileName,
      fileType,
      extractedAt: new Date().toISOString(),
      totalSections: sections.length,
      totalCharacters: text.length,
    },
    sections,
    fullText: text,
  };
}

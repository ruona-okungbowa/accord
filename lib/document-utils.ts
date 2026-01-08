/**
 * Utility functions for working with documents in Accord
 * Helper functions for common document operations
 */

import {
  StructuredDocument,
  DocumentSection,
  findSectionByPosition,
  getSectionReference,
} from "./document-structurer";
import { TextChange, getChangeStats } from "./redline-tracker";

/**
 * Get a section by its clause number
 */
export function findSectionByClauseNumber(
  doc: StructuredDocument,
  clauseNumber: string
): DocumentSection | null {
  return (
    doc.sections.find((s) => s.metadata?.clauseNumber === clauseNumber) || null
  );
}

/**
 * Get all sections of a specific type
 */
export function getSectionsByType(
  doc: StructuredDocument,
  type: DocumentSection["type"]
): DocumentSection[] {
  return doc.sections.filter((s) => s.type === type);
}

/**
 * Get document summary statistics
 */
export function getDocumentStats(doc: StructuredDocument) {
  return {
    totalSections: doc.sections.length,
    headings: doc.sections.filter((s) => s.type === "heading").length,
    clauses: doc.sections.filter((s) => s.type === "clause").length,
    paragraphs: doc.sections.filter((s) => s.type === "paragraph").length,
    listItems: doc.sections.filter((s) => s.type === "list_item").length,
    totalCharacters: doc.fullText.length,
    version: doc.version,
  };
}

/**
 * Get table of contents from document
 */
export function getTableOfContents(doc: StructuredDocument) {
  const headings = doc.sections.filter(
    (s) => s.type === "heading" || (s.type === "clause" && s.metadata?.clauseNumber?.split(".").length === 1)
  );

  return headings.map((section) => ({
    id: section.id,
    title: section.content.substring(0, 100), // Limit length
    clauseNumber: section.metadata?.clauseNumber,
    level: section.metadata?.level || 1,
    order: section.order,
  }));
}

/**
 * Get a text excerpt around a specific position
 */
export function getExcerpt(
  doc: StructuredDocument,
  position: number,
  contextChars: number = 50
): string {
  const start = Math.max(0, position - contextChars);
  const end = Math.min(doc.fullText.length, position + contextChars);
  const excerpt = doc.fullText.substring(start, end);

  return (start > 0 ? "..." : "") + excerpt + (end < doc.fullText.length ? "..." : "");
}

/**
 * Search for text in document
 */
export function searchDocument(
  doc: StructuredDocument,
  query: string,
  caseSensitive: boolean = false
): Array<{
  sectionId: string;
  sectionRef: string;
  position: number;
  excerpt: string;
}> {
  const results: Array<{
    sectionId: string;
    sectionRef: string;
    position: number;
    excerpt: string;
  }> = [];

  const searchText = caseSensitive ? doc.fullText : doc.fullText.toLowerCase();
  const searchQuery = caseSensitive ? query : query.toLowerCase();

  let position = 0;
  while ((position = searchText.indexOf(searchQuery, position)) !== -1) {
    const section = findSectionByPosition(doc, position);
    if (section) {
      results.push({
        sectionId: section.id,
        sectionRef: getSectionReference(section),
        position,
        excerpt: getExcerpt(doc, position, 40),
      });
    }
    position += searchQuery.length;
  }

  return results;
}

/**
 * Get all pending changes requiring approval
 */
export function getPendingChanges(changes: TextChange[]): TextChange[] {
  return changes.filter((c) => c.status === "pending");
}

/**
 * Get changes grouped by section
 */
export function groupChangesBySection(changes: TextChange[]): Record<string, TextChange[]> {
  return changes.reduce(
    (acc, change) => {
      if (!acc[change.sectionId]) {
        acc[change.sectionId] = [];
      }
      acc[change.sectionId].push(change);
      return acc;
    },
    {} as Record<string, TextChange[]>
  );
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate document structure
 */
export function validateDocumentStructure(doc: any): doc is StructuredDocument {
  return (
    doc &&
    typeof doc === "object" &&
    typeof doc.version === "number" &&
    doc.metadata &&
    Array.isArray(doc.sections) &&
    typeof doc.fullText === "string"
  );
}

/**
 * Create a change summary for display
 */
export function getChangeSummary(changes: TextChange[]): string {
  const stats = getChangeStats(changes);

  const parts: string[] = [];
  if (stats.insertions > 0) parts.push(`${stats.insertions} insertion(s)`);
  if (stats.deletions > 0) parts.push(`${stats.deletions} deletion(s)`);
  if (stats.modifications > 0) parts.push(`${stats.modifications} modification(s)`);

  if (parts.length === 0) return "No changes";

  return parts.join(", ");
}

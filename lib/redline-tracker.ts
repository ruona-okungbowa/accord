/**
 * Redline tracking utilities for Accord
 * Tracks insertions, deletions, and modifications to document text
 * Used for displaying changes in the negotiation workflow
 */

import { StructuredDocument, DocumentSection } from "./document-structurer";

export type ChangeType = "insertion" | "deletion" | "modification";

export interface TextChange {
  id: string;
  type: ChangeType;
  sectionId: string;
  originalText: string;
  newText: string;
  startPosition: number;
  endPosition: number;
  proposedBy: string; // User ID
  proposedAt: string; // ISO timestamp
  approvedBy?: string; // User ID
  approvedAt?: string; // ISO timestamp
  rationale?: string;
  status: "pending" | "approved" | "rejected";
}

export interface RedlineDocument extends StructuredDocument {
  changes: TextChange[];
  baseVersion: number;
  currentVersion: number;
}

/**
 * Generate a unique change ID
 */
export function generateChangeId(): string {
  return `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new text change (for proposals)
 */
export function createTextChange(
  type: ChangeType,
  sectionId: string,
  originalText: string,
  newText: string,
  startPosition: number,
  endPosition: number,
  proposedBy: string,
  rationale?: string
): TextChange {
  return {
    id: generateChangeId(),
    type,
    sectionId,
    originalText,
    newText,
    startPosition,
    endPosition,
    proposedBy,
    proposedAt: new Date().toISOString(),
    rationale,
    status: "pending",
  };
}

/**
 * Apply approved changes to document content
 */
export function applyChangesToDocument(
  doc: StructuredDocument,
  changes: TextChange[]
): StructuredDocument {
  // Only apply approved changes
  const approvedChanges = changes.filter((c) => c.status === "approved");

  // Sort changes by position (descending) to avoid position shifts
  const sortedChanges = [...approvedChanges].sort(
    (a, b) => b.startPosition - a.startPosition
  );

  let updatedText = doc.fullText;
  const updatedSections = [...doc.sections];

  for (const change of sortedChanges) {
    // Apply change to full text
    const before = updatedText.substring(0, change.startPosition);
    const after = updatedText.substring(change.endPosition);

    switch (change.type) {
      case "insertion":
        updatedText = before + change.newText + after;
        break;
      case "deletion":
        updatedText = before + after;
        break;
      case "modification":
        updatedText = before + change.newText + after;
        break;
    }

    // Update affected section
    const sectionIndex = updatedSections.findIndex(
      (s) => s.id === change.sectionId
    );
    if (sectionIndex !== -1) {
      const section = updatedSections[sectionIndex];
      const sectionBefore = section.content.substring(
        0,
        change.startPosition - section.startPosition
      );
      const sectionAfter = section.content.substring(
        change.endPosition - section.startPosition
      );

      let newContent = "";
      switch (change.type) {
        case "insertion":
          newContent = sectionBefore + change.newText + sectionAfter;
          break;
        case "deletion":
          newContent = sectionBefore + sectionAfter;
          break;
        case "modification":
          newContent = sectionBefore + change.newText + sectionAfter;
          break;
      }

      updatedSections[sectionIndex] = {
        ...section,
        content: newContent,
        endPosition:
          section.startPosition + newContent.length,
      };
    }
  }

  return {
    ...doc,
    fullText: updatedText,
    sections: updatedSections,
    version: doc.version + 1,
  };
}

/**
 * Get visual representation of changes for display
 */
export function getChangeMarkup(change: TextChange): {
  display: string;
  className: string;
} {
  let display = "";
  let className = "";

  switch (change.type) {
    case "insertion":
      display = `[+${change.newText}]`;
      className = "text-green-600 bg-green-50";
      break;
    case "deletion":
      display = `[-${change.originalText}]`;
      className = "text-red-600 bg-red-50 line-through";
      break;
    case "modification":
      display = `[~${change.originalText} → ${change.newText}]`;
      className = "text-blue-600 bg-blue-50";
      break;
  }

  return { display, className };
}

/**
 * Compare two document versions and generate changes
 */
export function compareDocumentVersions(
  oldDoc: StructuredDocument,
  newDoc: StructuredDocument,
  userId: string
): TextChange[] {
  const changes: TextChange[] = [];

  // Simple section-by-section comparison
  for (let i = 0; i < Math.max(oldDoc.sections.length, newDoc.sections.length); i++) {
    const oldSection = oldDoc.sections[i];
    const newSection = newDoc.sections[i];

    if (!oldSection && newSection) {
      // Section added
      changes.push(
        createTextChange(
          "insertion",
          newSection.id,
          "",
          newSection.content,
          newSection.startPosition,
          newSection.endPosition,
          userId
        )
      );
    } else if (oldSection && !newSection) {
      // Section deleted
      changes.push(
        createTextChange(
          "deletion",
          oldSection.id,
          oldSection.content,
          "",
          oldSection.startPosition,
          oldSection.endPosition,
          userId
        )
      );
    } else if (oldSection && newSection && oldSection.content !== newSection.content) {
      // Section modified
      changes.push(
        createTextChange(
          "modification",
          oldSection.id,
          oldSection.content,
          newSection.content,
          oldSection.startPosition,
          oldSection.endPosition,
          userId
        )
      );
    }
  }

  return changes;
}

/**
 * Get all changes for a specific section
 */
export function getChangesForSection(
  changes: TextChange[],
  sectionId: string
): TextChange[] {
  return changes.filter((c) => c.sectionId === sectionId);
}

/**
 * Get statistics about changes
 */
export function getChangeStats(changes: TextChange[]) {
  return {
    total: changes.length,
    pending: changes.filter((c) => c.status === "pending").length,
    approved: changes.filter((c) => c.status === "approved").length,
    rejected: changes.filter((c) => c.status === "rejected").length,
    insertions: changes.filter((c) => c.type === "insertion").length,
    deletions: changes.filter((c) => c.type === "deletion").length,
    modifications: changes.filter((c) => c.type === "modification").length,
  };
}

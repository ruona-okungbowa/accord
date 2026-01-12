/**
 * Document Update Utilities
 * Applies accepted proposal edits to the authoritative document
 */

import {
  DocumentSection,
  StructuredDocument,
} from "@/lib/document/structure";
import { ProposalEdit } from "@/lib/types/proposals";

/**
 * Apply a set of proposal edits to a structured document
 * Returns a new StructuredDocument with the edits applied
 */
export function applyProposalEditsToDocument(
  document: StructuredDocument,
  edits: ProposalEdit[]
): StructuredDocument {
  // Create a copy of the sections
  let updatedSections = [...document.sections];

  // Sort edits by order to apply them in sequence
  const sortedEdits = [...edits].sort((a, b) => a.order - b.order);

  for (const edit of sortedEdits) {
    const sectionIndex = updatedSections.findIndex(
      (s) => s.id === edit.section_id
    );

    if (sectionIndex === -1) {
      console.warn(`Section ${edit.section_id} not found, skipping edit`);
      continue;
    }

    const section = updatedSections[sectionIndex];

    switch (edit.action) {
      case "replace":
      case "modify":
        // Replace the entire section content
        updatedSections[sectionIndex] = {
          ...section,
          content: edit.proposed_text,
        };
        break;

      case "delete":
        // Remove the section
        updatedSections.splice(sectionIndex, 1);
        break;

      case "insert":
        // Insert a new section after the current one
        const newSection: DocumentSection = {
          id: `section-inserted-${Date.now()}-${Math.random()}`,
          type: section.type,
          content: edit.proposed_text,
          startPosition: section.endPosition + 1,
          endPosition: section.endPosition + edit.proposed_text.length + 1,
          order: section.order + 1,
          metadata: {},
        };
        updatedSections.splice(sectionIndex + 1, 0, newSection);
        break;
    }
  }

  // Reindex sections after modifications
  updatedSections = updatedSections.map((section, index) => ({
    ...section,
    order: index,
    id: section.id.startsWith("section-inserted-")
      ? section.id
      : `section-${index.toString().padStart(6, "0")}`,
  }));

  // Recalculate positions
  let currentPosition = 0;
  updatedSections = updatedSections.map((section) => {
    const startPosition = currentPosition;
    const endPosition = startPosition + section.content.length;
    currentPosition = endPosition + 2; // "\n\n"

    return {
      ...section,
      startPosition,
      endPosition,
    };
  });

  // Rebuild full text
  const fullText = updatedSections.map((s) => s.content).join("\n\n");

  return {
    ...document,
    sections: updatedSections,
    fullText,
    metadata: {
      ...document.metadata,
      totalSections: updatedSections.length,
      totalCharacters: fullText.length,
    },
  };
}

/**
 * Validate that edits can be safely applied
 * Returns an array of errors, or empty array if valid
 */
export function validateProposalEdits(
  document: StructuredDocument,
  edits: ProposalEdit[]
): string[] {
  const errors: string[] = [];

  for (const edit of edits) {
    const section = document.sections.find((s) => s.id === edit.section_id);

    if (!section) {
      errors.push(
        `Section ${edit.section_id} not found in document (Edit order ${edit.order})`
      );
      continue;
    }

    // Validate that the original text matches (to prevent applying stale edits)
    if (edit.original_text !== section.content) {
      errors.push(
        `Section ${edit.section_id} content has changed since edit was created. Expected: "${edit.original_text.substring(0, 50)}...", Found: "${section.content.substring(0, 50)}..."`
      );
    }

    // Validate edit actions
    if (edit.action !== "delete" && !edit.proposed_text) {
      errors.push(
        `Edit for section ${edit.section_id} is missing proposed text`
      );
    }
  }

  return errors;
}

/**
 * Create a change summary for logging
 */
export function createChangeSummary(edits: ProposalEdit[]): {
  added: number;
  modified: number;
  deleted: number;
  total: number;
} {
  const summary = {
    added: 0,
    modified: 0,
    deleted: 0,
    total: edits.length,
  };

  for (const edit of edits) {
    switch (edit.action) {
      case "insert":
        summary.added++;
        break;
      case "delete":
        summary.deleted++;
        break;
      case "replace":
      case "modify":
        summary.modified++;
        break;
    }
  }

  return summary;
}

/**
 * Proposal and Edit Management Types
 * Represents the negotiation workflow for document changes
 */

export type ProposalStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "accepted"
  | "rejected"
  | "superseded";

export type EditCategory =
  | "risk"
  | "compliance"
  | "commercial"
  | "legal"
  | "technical"
  | "clarification";

export type EditAction =
  | "replace" // Replace text in a section
  | "delete" // Delete a section or text
  | "insert" // Insert new text
  | "modify"; // General modification

/**
 * A single edit within a proposal
 */
export interface ProposalEdit {
  id: string;
  proposal_id: string;
  section_id: string;
  action: EditAction;
  original_text: string;
  proposed_text: string;
  position_start?: number; // For partial section edits
  position_end?: number;
  rationale?: string;
  category?: EditCategory;
  order: number; // Order within the proposal
  created_at: string;
}

/**
 * A proposal is a bundle of suggested changes
 */
export interface Proposal {
  id: string;
  deal_id: string;
  document_id: string;
  title: string;
  summary?: string;
  status: ProposalStatus;
  proposed_by: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_comments?: string;
  // Populated from joins
  edits?: ProposalEdit[];
  author?: {
    id: string;
    first_name: string;
    last_name: string;
    firm_name?: string;
  };
  reviewer?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

/**
 * Draft proposal being created (not yet submitted)
 */
export interface DraftProposal {
  title: string;
  summary?: string;
  edits: Omit<ProposalEdit, "id" | "proposal_id" | "created_at">[];
}

/**
 * Comment on a proposal
 */
export interface ProposalComment {
  id: string;
  proposal_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    firm_name?: string;
  };
}

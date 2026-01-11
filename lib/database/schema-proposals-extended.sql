-- Extended Proposal Schema for Negotiation Workflow
-- This extends the existing proposals table and adds new tables for the negotiation workflow

-- Modify existing proposals table to support standalone proposals
-- Run this migration to extend the schema:

ALTER TABLE public.proposals
  ALTER COLUMN issue_id DROP NOT NULL, -- Make issue_id optional
  ADD COLUMN title text,
  ADD COLUMN summary text,
  ADD COLUMN deal_id uuid REFERENCES public.deals(id),
  ADD COLUMN updated_at timestamp with time zone DEFAULT now(),
  ADD COLUMN submitted_at timestamp with time zone,
  DROP CONSTRAINT IF EXISTS proposals_status_check,
  ADD CONSTRAINT proposals_status_check CHECK (status = ANY (ARRAY[
    'draft'::text,
    'submitted'::text,
    'in_review'::text,
    'accepted'::text,
    'rejected'::text,
    'superseded'::text
  ]));

-- Create proposal_edits table for multiple edits per proposal
CREATE TABLE IF NOT EXISTS public.proposal_edits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  section_id text NOT NULL,
  action text NOT NULL CHECK (action = ANY (ARRAY['replace'::text, 'delete'::text, 'insert'::text, 'modify'::text])),
  original_text text NOT NULL,
  proposed_text text NOT NULL,
  position_start integer,
  position_end integer,
  rationale text,
  category text CHECK (category = ANY (ARRAY['risk'::text, 'compliance'::text, 'commercial'::text, 'legal'::text, 'technical'::text, 'clarification'::text])),
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proposal_edits_pkey PRIMARY KEY (id)
);

-- Create proposal_comments table for threaded discussions
CREATE TABLE IF NOT EXISTS public.proposal_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proposal_comments_pkey PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_proposal_edits_proposal_id ON public.proposal_edits(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_edits_section_id ON public.proposal_edits(section_id);
CREATE INDEX IF NOT EXISTS idx_proposal_comments_proposal_id ON public.proposal_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposals_deal_id ON public.proposals(deal_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at_trigger
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_proposals_updated_at();

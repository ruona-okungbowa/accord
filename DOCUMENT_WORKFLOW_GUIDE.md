# Accord Document Workflow Guide

## Overview

Accord implements a professional legal negotiation workflow where the **Authoritative Draft** (the main document) is protected and only updated when proposals are formally **accepted and approved** by authorized users.

---

## Key Concepts

### 1. Authoritative Draft
- The **single source of truth** for the contract document
- Stored in the `documents` table with structured content
- Only changes when proposals are **accepted** by Arranger Counsel or Admin
- Marked with a green "Verified" badge in the interface

### 2. Proposals
- **Bundles of suggested changes** to the document
- Created by any deal participant
- Must be reviewed and accepted before affecting the main document
- Track author, status, rationale, and discussion

### 3. Proposal Lifecycle
```
draft → submitted → in_review → accepted/rejected/superseded
```

Only when status = **accepted** does the document get updated.

---

## How to View the Document

### Step 1: Navigate to the Document Workspace

1. Go to your dashboard or deals list
2. Click on a deal/contract
3. Click on **"Document Workspace"** in the navigation

**URL Pattern:** `/contracts/[deal-id]/workspace`

**Example:** `/contracts/a1b2c3d4-5678-90ab-cdef-1234567890ab/workspace`

---

### Step 2: Review Mode (Default View)

When you first open the workspace, you're in **Review Mode** - this is where you view the authoritative draft.

#### What You'll See:

**Header:**
- Mode switcher: "Review" (active) and "Propose"
- Your role badge (e.g., "Borrower Counsel")
- Deal status indicator

**Main Document Area:**
- The **authoritative draft** is displayed with proper formatting
- Sections are organized by type:
  - **Headings** - Bold, uppercase, hierarchical
  - **Clauses** - Numbered (e.g., "10.2") with indigo highlighting
  - **Paragraphs** - Justified text
  - **List items** - Indented with bullets

**Visual Indicators:**
- 🟢 **Green highlight** = Section was modified by an accepted proposal
- 🟡 **Yellow highlight** = Section has pending proposals
- **Circular bubbles** = Click to view proposal details

**Right Sidebar:**
- Proposal panel (collapsed by default)
- Click the "+" button to create a new proposal
- Click the panel icon to view all proposals

---

### Step 3: Viewing Proposal Details

**To see what changes are proposed:**

1. Look for **colored bubbles** on document sections
2. **Hover** over a bubble to see a tooltip with:
   - Proposal title
   - Author name
   - Change type (replace, delete, etc.)
   - Proposed text preview
   - Rationale

3. **Click** the bubble to open the full proposal in the right panel

**In the Proposal Panel:**
- View the proposal title and summary
- See all edits in the proposal
- Expand each edit to compare original vs. proposed text
- Read the rationale and category (risk, compliance, etc.)
- View comments and discussion
- **Accept or Reject** (if you're Arranger Counsel or Admin)

---

## How to Create a Proposal

### Step 1: Switch to Propose Mode

Click the **"Propose"** button in the header mode switcher.

### Step 2: Select Sections to Edit

1. **Click on any section** of the document you want to change
2. The section will be highlighted in blue
3. A side panel opens on the right showing the edit form

### Step 3: Configure Your Edit

**In the edit form:**

1. **Selected Section** - Shows which section you're editing
2. **Action** - Choose what you want to do:
   - **Replace** - Replace the entire section with new text
   - **Modify** - Make changes to the section
   - **Delete** - Remove the section entirely
   - **Insert** - Add new content after this section

3. **Category** - Classify the change:
   - Commercial
   - Legal
   - Risk
   - Compliance
   - Technical
   - Clarification

4. **Proposed Text** - Enter your new/modified text (not shown for "delete")

5. **Rationale** - Explain why you're making this change

6. Click **"Add to Proposal"**

### Step 4: Build Your Proposal

- You can add **multiple edits** to one proposal
- Each edit appears in the "Edits" list in the panel
- You can remove edits before submitting

### Step 5: Submit the Proposal

1. Enter a **Proposal Title** at the top of the panel
2. Optionally add a **Summary** describing the overall changes
3. Click **"Submit Proposal"** to send for review
   - OR click **"Save as Draft"** to save without submitting

---

## How Proposals Get Accepted (Document Updates)

### The Acceptance Flow

1. **Participant creates proposal** (status: `draft`)
2. **Author submits proposal** (status: `submitted`)
3. **Reviewers examine** (status: `in_review`)
4. **Arranger Counsel or Admin accepts** (status: `accepted`)
   - **→ At this moment, the main document is updated! ✅**

### What Happens When Accepted

**Backend Process:**
1. System validates that edits can be applied
2. Applies all edits to the document structure:
   - **Replace/Modify**: Updates section content
   - **Delete**: Removes the section
   - **Insert**: Adds new section
3. Recalculates section positions and indexes
4. Saves the updated `StructuredDocument` to the database
5. Updates the `documents.updated_at` timestamp

**User Experience:**
1. Proposal status changes to "Accepted" (green badge)
2. Sections affected by the proposal show green highlights
3. The document now displays the **new content** from the proposal
4. All users see the updated authoritative draft immediately

### Validation and Safety

**The system validates:**
- Section still exists (hasn't been deleted by another proposal)
- Original text matches (detects conflicts with other changes)
- Proposed text is provided (for non-delete actions)

**If validation fails:**
- Proposal is not applied
- Error message is returned
- Document remains unchanged

---

## User Roles and Permissions

### Any Deal Participant Can:
- ✅ View the document in Review mode
- ✅ Create proposals in Propose mode
- ✅ Submit their own proposals
- ✅ Comment on any proposal
- ✅ View all proposals

### Only Arranger Counsel or Admin Can:
- ✅ Accept proposals (updating the main document)
- ✅ Reject proposals with comments

### Only Proposal Author Can:
- ✅ Edit their own draft proposals
- ✅ Delete their own draft proposals

---

## Complete Walkthrough Example

**Scenario:** You want to change the interest rate in Clause 10.2

### 1. **Open the Workspace**
Navigate to: `/contracts/[your-deal-id]/workspace`

### 2. **View Current State**
- You're in Review Mode by default
- Scroll to Clause 10.2
- Read the current text: "Interest rate shall be 5.5% per annum"

### 3. **Create Proposal**
- Click "Propose" in the header
- Click on Clause 10.2
- Configure edit:
  - Action: **Replace**
  - Category: **Commercial**
  - Proposed Text: "Interest rate shall be 6.0% per annum"
  - Rationale: "Market conditions require rate adjustment to reflect current LIBOR + 2%"
- Click "Add to Proposal"

### 4. **Add Title and Submit**
- Title: "Adjust interest rate to 6.0%"
- Summary: "Update rate to match current market conditions"
- Click "Submit Proposal"

### 5. **Review Process**
- Proposal appears in the right sidebar with "Submitted" badge
- Other participants can see the yellow bubble on Clause 10.2
- They can click it to see your proposed change
- They can add comments for discussion

### 6. **Acceptance**
- Arranger Counsel opens the proposal panel
- Reviews your change
- Clicks "Accept Proposal"
- **→ The main document is now updated!**

### 7. **See the Result**
- Switch back to Review Mode
- Clause 10.2 now shows: "Interest rate shall be 6.0% per annum"
- Section has a green highlight (indicating it was changed by an accepted proposal)
- The proposal has a green "Accepted" badge
- All participants see the updated authoritative draft

---

## Tips and Best Practices

### For Creating Proposals:
- **Bundle related changes** into one proposal (e.g., all rate adjustments together)
- **Write clear rationales** - explain the business/legal reason
- **Use appropriate categories** - helps reviewers prioritize
- **Save as draft** if you're not ready to submit
- **Engage in comments** before finalizing

### For Reviewing Proposals:
- **Hover over bubbles** for quick previews
- **Open the panel** for detailed review
- **Use comments** to discuss before deciding
- **Check validation** - system warns if edits conflict
- **Reject with explanation** if not acceptable

### For Managing the Workspace:
- **Default to Review Mode** - keeps document clear
- **Use Propose Mode** only when creating changes
- **Filter proposals** by status if you have many
- **Check "Authoritative Draft" badge** - confirms you're viewing the official version

---

## Troubleshooting

### "Cannot apply proposal edits" Error
**Cause:** The section content has changed since the proposal was created

**Solution:**
1. Reject the outdated proposal
2. Author creates a new proposal based on current document
3. System validates against latest content

### Proposal Not Appearing
**Cause:** Proposal is in "draft" status

**Solution:** Author must click "Submit Proposal" for it to be visible to reviewers

### Can't Accept Proposal
**Cause:** You don't have the required role

**Solution:** Only Arranger Counsel and Admin can accept. Contact them to review.

### Changes Not Showing
**Cause:** Proposal was rejected or is still pending

**Solution:** Check proposal status in the panel. Only accepted proposals update the document.

---

## Technical Details

### Document Structure
```typescript
{
  version: 1,
  metadata: { fileName, fileType, extractedAt, totalSections, totalCharacters },
  sections: [
    {
      id: "section-000001",
      type: "heading" | "clause" | "paragraph" | "list_item",
      content: "text content",
      startPosition: 0,
      endPosition: 100,
      order: 0,
      metadata: { level, clauseNumber, parent }
    }
  ],
  fullText: "complete document text"
}
```

### Proposal Edit Structure
```typescript
{
  id: "uuid",
  proposal_id: "uuid",
  section_id: "section-000042",
  action: "replace" | "delete" | "insert" | "modify",
  original_text: "old text",
  proposed_text: "new text",
  rationale: "why this change",
  category: "commercial" | "legal" | "risk" | "compliance" | "technical" | "clarification",
  order: 0
}
```

### API Endpoints
- `GET /api/documents/[dealId]` - Fetch document
- `POST /api/proposals` - Create proposal
- `GET /api/proposals?dealId=X` - List proposals
- `GET /api/proposals/[id]` - Get proposal details
- `PATCH /api/proposals/[id]` - Accept/reject/submit
- `POST /api/proposals/[id]/comments` - Add comment

---

## Summary

**The main document only updates when:**
1. A proposal is created and submitted
2. Arranger Counsel or Admin reviews it
3. They click "Accept Proposal"
4. System validates and applies the edits
5. Document is saved to the database

**Until then:**
- The authoritative draft remains unchanged
- Proposed changes are shown as overlays
- All participants can see what's proposed
- Discussion happens in comments

This ensures a **controlled, auditable, and collaborative** negotiation process!

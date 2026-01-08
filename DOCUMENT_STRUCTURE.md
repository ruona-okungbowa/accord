# Document Structure & Redlining System

## Overview

Accord's document system structures uploaded legal documents into trackable sections, enabling precise redlining (tracking insertions, deletions, and modifications) throughout the negotiation process.

## Document Structure Format

### Structured Document Schema

```typescript
{
  version: number;              // Document version
  metadata: {
    originalFileName: string;   // Original uploaded filename
    fileType: string;           // MIME type
    extractedAt: string;        // ISO timestamp
    totalSections: number;      // Number of sections
    totalCharacters: number;    // Total character count
  };
  sections: DocumentSection[];  // Array of structured sections
  fullText: string;             // Complete extracted text
}
```

### Document Section Schema

```typescript
{
  id: string;                   // Unique section ID (e.g., "section-000001")
  type: "heading" | "clause" | "paragraph" | "list_item";
  content: string;              // Section text content
  startPosition: number;        // Start character position in fullText
  endPosition: number;          // End character position in fullText
  order: number;                // Display order
  metadata?: {
    level?: number;             // Heading level (1, 2, 3)
    clauseNumber?: string;      // Clause number (e.g., "1.1", "2.3.4")
    parent?: string;            // Parent section ID (for nested structures)
  };
}
```

## How Text is Structured

### 1. Document Upload

When a deal is created with a document:

1. **File is validated** (PDF or DOCX, max 25MB)
2. **Text is extracted** using mammoth (DOCX) or pdfjs (PDF)
3. **Text is structured** into sections with positions
4. **File is stored** in Supabase storage
5. **Document record is created** with structured content in JSONB

### 2. Section Detection

The system automatically detects section types:

- **Headings**: All caps text, or starts with SCHEDULE/PART/SECTION/ARTICLE
- **Clauses**: Starts with numbering (1., 1.1, 2.3.4, etc.)
- **List Items**: Starts with bullets (•, -, *) or lettered/roman numerals
- **Paragraphs**: Regular text content

### 3. Position Tracking

Each section tracks its character position in the full text:

```
Full Text: "This is clause 1. This is clause 2."
           |________________| |_________________|
Section 1: startPosition: 0,  Section 2: startPosition: 18,
          endPosition: 17              endPosition: 36
```

This enables:
- Linking issues to specific text ranges
- Displaying context around changes
- Tracking exact modification locations

## Redlining System

### Change Types

1. **Insertion**: New text added
   ```
   Original: "The borrower shall"
   Change:   "The borrower shall promptly"
   Display:  "The borrower shall [+promptly]"
   ```

2. **Deletion**: Text removed
   ```
   Original: "The borrower shall promptly pay"
   Change:   "The borrower shall pay"
   Display:  "The borrower shall [-promptly] pay"
   ```

3. **Modification**: Text replaced
   ```
   Original: "within 30 days"
   Change:   "within 45 days"
   Display:  "within [~30 → 45] days"
   ```

### Text Change Schema

```typescript
{
  id: string;                   // Unique change ID
  type: "insertion" | "deletion" | "modification";
  sectionId: string;            // Which section is affected
  originalText: string;         // Text before change
  newText: string;              // Text after change
  startPosition: number;        // Start position of change
  endPosition: number;          // End position of change
  proposedBy: string;           // User ID who proposed
  proposedAt: string;           // ISO timestamp
  approvedBy?: string;          // User ID who approved
  approvedAt?: string;          // ISO timestamp
  rationale?: string;           // Why the change was made
  status: "pending" | "approved" | "rejected";
}
```

## Integration with Issues & Proposals

### Workflow

1. **Issue Raised** on a section
   ```typescript
   // Issue references section and position
   {
     deal_id: "...",
     document_id: "...",
     clause_ref: "section-000042",  // Links to section
     description: "Payment term should be 45 days"
   }
   ```

2. **Proposal Created** with change
   ```typescript
   // Proposal includes the proposed text
   {
     issue_id: "...",
     proposed_text: "within 45 days",
     rationale: "Industry standard for this type of facility"
   }
   ```

3. **Change Tracked** in document
   ```typescript
   // TextChange created from proposal
   {
     sectionId: "section-000042",
     type: "modification",
     originalText: "within 30 days",
     newText: "within 45 days",
     status: "pending"
   }
   ```

4. **Approval Recorded** in Decision Log
   ```typescript
   // Decision log entry
   {
     issue_id: "...",
     proposal_id: "...",
     approved_by: "...",
     what_changed: "Payment term extended",
     rationale: "Agreed to borrower's request",
     document_changes: { /* TextChange object */ }
   }
   ```

5. **Document Updated** with approved changes
   - Change status → "approved"
   - Document version incremented
   - New structured content generated

## API Usage

### Creating a Deal with Document

```typescript
const formData = new FormData();
formData.append("name", "ABC Loan Facility");
formData.append("description", "£50M Term Loan");
formData.append("currency", "GBP");
formData.append("role", "Arranger Counsel");
formData.append("targetSigningDate", "2026-03-31");
formData.append("document", file); // PDF or DOCX file

const response = await fetch("/api/contracts/create", {
  method: "POST",
  body: formData,
});

const result = await response.json();
// Returns: deal, document, metadata with sectionsExtracted count
```

### Accessing Structured Document

```typescript
// Document record from database
const document = await supabase
  .from("documents")
  .select("*")
  .eq("deal_id", dealId)
  .single();

const structuredContent = document.content as StructuredDocument;

// Access sections
console.log(`Found ${structuredContent.sections.length} sections`);

// Find specific section
const section = structuredContent.sections.find(
  s => s.metadata?.clauseNumber === "3.1"
);
```

### Working with Redlines

```typescript
import { createTextChange, applyChangesToDocument } from "@/lib/redline-tracker";

// Create a change proposal
const change = createTextChange(
  "modification",
  "section-000042",
  "within 30 days",
  "within 45 days",
  1250,
  1264,
  userId,
  "Align with industry standard"
);

// Apply approved changes to document
const updatedDoc = applyChangesToDocument(
  originalDoc,
  [change] // Array of approved changes
);
```

## Display Components (Example)

### Showing Document with Redlines

```tsx
import { getChangeMarkup } from "@/lib/redline-tracker";

function DocumentViewer({ document, changes }) {
  return (
    <div>
      {document.sections.map(section => {
        const sectionChanges = changes.filter(c => c.sectionId === section.id);

        return (
          <div key={section.id}>
            {section.type === "heading" && <h3>{section.content}</h3>}
            {section.type === "clause" && (
              <p>
                <strong>{section.metadata?.clauseNumber}</strong>{" "}
                {renderWithChanges(section.content, sectionChanges)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function renderWithChanges(text, changes) {
  // Render text with inline change markup
  let result = text;

  changes.forEach(change => {
    const { display, className } = getChangeMarkup(change);
    result = result.replace(
      change.originalText,
      `<span class="${className}">${display}</span>`
    );
  });

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
```

## Database Storage

### documents.content Column

The `content` column is JSONB, storing the complete `StructuredDocument`:

```sql
-- Example query
SELECT
  title,
  content->>'version' as version,
  content->'metadata'->>'totalSections' as total_sections,
  jsonb_array_length(content->'sections') as section_count
FROM documents
WHERE deal_id = 'some-deal-id';
```

### Querying Specific Sections

```sql
-- Find all clauses
SELECT
  id,
  title,
  jsonb_array_elements(content->'sections') as section
FROM documents
WHERE deal_id = 'some-deal-id'
  AND (content->'sections' @> '[{"type": "clause"}]');
```

## Best Practices

1. **Always work with structured content** - Don't store raw text separately
2. **Use section IDs for references** - Link issues/comments to section IDs
3. **Track positions for precision** - Use startPosition/endPosition for exact changes
4. **Version documents when applying changes** - Increment version number
5. **Store change history in decision_log** - Use document_changes JSONB field
6. **Apply changes atomically** - Update document after approval, not during proposal

## Future Enhancements

1. **Clause-level permissions** - Restrict editing to specific sections
2. **Smart clause detection** - Better LMA template recognition
3. **Change merging** - Handle conflicting changes on same section
4. **Rich text formatting** - Preserve bold, italic, tables from DOCX
5. **Comparison view** - Side-by-side before/after view
6. **Change comments** - Inline discussion on specific changes

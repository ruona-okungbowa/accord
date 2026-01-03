# Document Text Extraction Guide

## Overview
This guide shows how to extract structured text from uploaded PDF and DOCX files in the Accord platform.

## Files Created
1. **`/lib/documentExtractor.ts`** - Main extraction utility
2. **`/lib/documentExtractor.usage.example.ts`** - Usage examples
3. **`/types/document.ts`** - TypeScript interfaces

## Installation
```bash
npm install pdfjs-dist
```

## Quick Start

### 1. Update CreateDealModal Interface

```typescript
import { StructuredDocument } from "@/types/document";

interface DealData {
  name: string;
  description?: string;
  currency: string;
  targetSigningDate?: string | null;
  role: string;
  document?: File | null;
  structuredContent?: StructuredDocument | null; // Add this
}
```

### 2. Modify the onDrop Handler

```typescript
import { extractStructuredDocument } from "@/lib/documentExtractor";

const onDrop = useCallback(
  async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    try {
      // Extract structured content
      const structuredDoc = await extractStructuredDocument(selectedFile);

      // Update form data with both file and structured content
      setFormData((prevData) => ({
        ...prevData,
        document: selectedFile,
        structuredContent: structuredDoc,
      }));

      console.log("Extracted sections:", structuredDoc.sections);
    } catch (error) {
      console.error("Error extracting document:", error);
      setErrors("Failed to extract document text. Please try again.");
    }
  },
  [setFormData]
);
```

### 3. Send Structured Data to API

```typescript
const handleCreate = async (e: FormEvent) => {
  e.preventDefault();
  setIsCreating(true);

  try {
    const response = await fetch("api/deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        currency: formData.currency,
        targetSigningDate: formData.targetSigningDate,
        role: formData.role,
        structuredContent: formData.structuredContent, // Include structured sections
      }),
    });

    // Handle response...
  } catch (error) {
    console.error("Error creating deal:", error);
  } finally {
    setIsCreating(false);
  }
};
```

## Output Format

When you call `extractStructuredDocument(file)`, you'll get:

```json
{
  "sections": [
    {
      "id": "sec1-1-definitions",
      "text": "1. Definitions\n\nIn this Agreement...",
      "start": 0,
      "end": 450
    },
    {
      "id": "sec2-2-parties",
      "text": "2. Parties\n\nThe parties to this loan...",
      "start": 451,
      "end": 820
    },
    {
      "id": "sec3-3-loan-amount",
      "text": "3. Loan Amount and Terms...",
      "start": 821,
      "end": 1200
    }
  ],
  "originalFilename": "loan_agreement.pdf"
}
```

## Section Detection Patterns

The extractor automatically detects sections using these patterns:

1. **Numbered sections**: `1. Definitions`, `2. Parties`, etc.
2. **Section headers**: `Section 1: Definitions`, `Section 2: Parties`
3. **Article format**: `Article 1 - Definitions`
4. **Fallback**: If no patterns match, splits by double newlines (paragraphs)

## Custom Section Patterns

For documents with unique formatting:

```typescript
import { extractStructuredDocumentWithPattern } from "@/lib/documentExtractor";

// Custom pattern for "CLAUSE" based documents
const clausePattern = /(?:^|\n)CLAUSE\s+\d+\.?\s*[-–]\s*[^\n]+/gi;

const structuredDoc = await extractStructuredDocumentWithPattern(
  file,
  clausePattern
);
```

## Database Schema (Supabase)

To store the structured content, create a table:

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  filename TEXT NOT NULL,
  file_path TEXT,
  sections JSONB NOT NULL, -- Stores the sections array
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching within sections
CREATE INDEX idx_documents_sections ON documents USING GIN (sections);
```

## Use Cases

### 1. Issue Anchoring
```typescript
// Find section containing specific text
const findSectionWithText = (structuredDoc: StructuredDocument, searchText: string) => {
  return structuredDoc.sections.find(section =>
    section.text.toLowerCase().includes(searchText.toLowerCase())
  );
};

// Create issue anchored to section
const section = findSectionWithText(structuredDoc, "indemnification");
const issue = {
  sectionId: section?.id,
  comment: "Review indemnification clause",
  position: section?.start,
};
```

### 2. Section-by-Section Review
```typescript
// Display sections for review
structuredDoc.sections.map(section => (
  <div key={section.id} data-section-id={section.id}>
    <h3>{section.text.split('\n')[0]}</h3>
    <p>{section.text}</p>
    <button onClick={() => addComment(section.id)}>
      Add Comment
    </button>
  </div>
));
```

### 3. AI-Powered Analysis
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

async function analyzeSection(section: DocumentSection) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze this loan agreement section and identify potential issues:\n\n${section.text}`;
  const result = await model.generateContent(prompt);

  return result.response.text();
}
```

## Error Handling

```typescript
try {
  const structuredDoc = await extractStructuredDocument(file);
  // Success
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('Unsupported file type')) {
      setErrors('Please upload a PDF or DOCX file.');
    } else {
      setErrors('Failed to extract document. The file may be corrupted.');
    }
  }
}
```

## Performance Tips

1. **Large files**: Show loading indicator during extraction
2. **Caching**: Store extracted content in database to avoid re-processing
3. **Background processing**: Consider API route for extraction on server-side
4. **Pagination**: For documents with many sections, paginate the display

## Next Steps

1. Update your API route to handle `structuredContent`
2. Create Supabase table to store sections
3. Implement section-based commenting/issue tracking
4. Add search functionality across sections
5. Integrate with collaborative editor (Tiptap) for section editing

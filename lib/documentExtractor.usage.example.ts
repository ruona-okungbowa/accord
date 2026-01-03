/**
 * USAGE EXAMPLES for documentExtractor.ts
 *
 * This file shows how to integrate the document extraction
 * functionality into your CreateDealModal component.
 */

import { extractStructuredDocument } from './documentExtractor';

// ============================================
// Example 1: In the CreateDealModal onDrop handler
// ============================================

const onDrop = useCallback(
  async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    try {
      // Extract structured document
      const structuredDoc = await extractStructuredDocument(selectedFile);

      console.log('Extracted document:', structuredDoc);
      // Output:
      // {
      //   "sections": [
      //     { "id": "sec1-1-definitions", "text": "1. Definitions...", "start": 0, "end": 150 },
      //     { "id": "sec2-2-parties", "text": "2. Parties...", "start": 151, "end": 300 }
      //   ],
      //   "originalFilename": "loan_agreement.pdf"
      // }

      // Save to state
      setFormData((prevData) => ({
        ...prevData,
        document: selectedFile,
        structuredContent: structuredDoc, // Add this to your interface
      }));

      // Or send directly to API
      await saveStructuredDocument(structuredDoc);
    } catch (error) {
      console.error('Error extracting document:', error);
      setErrors('Failed to extract document text. Please try again.');
    }
  },
  [setFormData]
);

// ============================================
// Example 2: Save to Supabase when creating deal
// ============================================

const handleCreate = async (e: FormEvent) => {
  e.preventDefault();
  setIsCreating(true);

  try {
    // Extract document if uploaded
    let structuredContent = null;
    if (formData.document) {
      structuredContent = await extractStructuredDocument(formData.document);
    }

    const response = await fetch('api/deals/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        structuredContent, // Include structured content
      }),
    });

    const data = await response.json();
    if (response.ok) {
      handleCancel();
      // Reset form...
    }
  } catch (error) {
    console.error('Error creating deal:', error);
  } finally {
    setIsCreating(false);
  }
};

// ============================================
// Example 3: Upload file separately and get structured data
// ============================================

async function uploadAndExtractDocument(file: File, dealId: string) {
  try {
    // 1. Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('deal-documents')
      .upload(`${dealId}/${file.name}`, file);

    if (uploadError) throw uploadError;

    // 2. Extract structured content
    const structuredDoc = await extractStructuredDocument(file);

    // 3. Save structured content to database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        deal_id: dealId,
        filename: structuredDoc.originalFilename,
        file_path: uploadData.path,
        sections: structuredDoc.sections, // JSONB column in Postgres
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    return { uploadData, structuredDoc };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

// ============================================
// Example 4: API Route to handle document upload
// ============================================

// File: app/api/documents/extract/route.ts
/*
import { NextRequest, NextResponse } from 'next/server';
import { extractStructuredDocument } from '@/lib/documentExtractor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('document') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Extract structured content
    const structuredDoc = await extractStructuredDocument(file);

    return NextResponse.json({
      success: true,
      data: structuredDoc,
    });
  } catch (error) {
    console.error('Error extracting document:', error);
    return NextResponse.json(
      { error: 'Failed to extract document' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// Example 5: Custom section pattern for specific documents
// ============================================

import { extractStructuredDocumentWithPattern } from './documentExtractor';

async function extractLoanAgreementSections(file: File) {
  // Custom pattern for loan agreements that use "CLAUSE" instead of numbers
  const clausePattern = /(?:^|\n)CLAUSE\s+\d+\.?\s*[-–]\s*[^\n]+/gi;

  const structuredDoc = await extractStructuredDocumentWithPattern(
    file,
    clausePattern
  );

  return structuredDoc;
}

// ============================================
// Example 6: Search/filter sections
// ============================================

function findSectionsByKeyword(
  structuredDoc: { sections: Array<{ id: string; text: string }> },
  keyword: string
) {
  return structuredDoc.sections.filter((section) =>
    section.text.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Usage:
// const definitionSections = findSectionsByKeyword(structuredDoc, 'definition');
// const partiesSections = findSectionsByKeyword(structuredDoc, 'parties');

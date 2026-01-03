import mammoth from 'mammoth';

// Note: For PDF parsing in browser, you'll need to import dynamically
// npm install pdf-parse for Node.js or pdfjs-dist for browser

interface DocumentSection {
  id: string;
  text: string;
  start: number;
  end: number;
}

interface StructuredDocument {
  sections: DocumentSection[];
  originalFilename: string;
}

/**
 * Extract text from DOCX file using mammoth
 */
async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Extract text from PDF file
 * For browser usage, you'll need pdfjs-dist instead of pdf-parse
 */
async function extractTextFromPdf(file: File): Promise<string> {
  // Using pdfjs-dist for browser compatibility
  // First install: npm install pdfjs-dist

  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker path
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';

  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
}

/**
 * Split text into sections based on numbered headings or paragraphs
 * Supports patterns like:
 * - "1. Definitions"
 * - "Section 1: Definitions"
 * - "Article 1 - Definitions"
 * - Double newlines as section separators
 */
function splitIntoSections(text: string): Omit<DocumentSection, 'id'>[] {
  const sections: Omit<DocumentSection, 'id'>[] = [];

  // Pattern to match numbered sections (1., 2., etc.) or Section X:
  const sectionRegex = /(?:^|\n)(?:(?:\d+\.)|(?:Section\s+\d+:?)|(?:Article\s+\d+[-:]?))\s+[^\n]+/gi;
  const matches = [...text.matchAll(sectionRegex)];

  if (matches.length > 0) {
    // Split by numbered sections
    let lastEnd = 0;

    matches.forEach((match, index) => {
      const matchStart = match.index || 0;
      const nextMatchStart = matches[index + 1]?.index || text.length;

      const sectionText = text.substring(matchStart, nextMatchStart).trim();

      sections.push({
        text: sectionText,
        start: matchStart,
        end: nextMatchStart,
      });
    });
  } else {
    // Fallback: Split by double newlines (paragraphs)
    const paragraphs = text.split(/\n\n+/);
    let currentPosition = 0;

    paragraphs.forEach((paragraph) => {
      const trimmedParagraph = paragraph.trim();
      if (trimmedParagraph.length > 0) {
        const start = currentPosition;
        const end = start + trimmedParagraph.length;

        sections.push({
          text: trimmedParagraph,
          start,
          end,
        });

        currentPosition = end + 2; // Account for the double newline
      }
    });
  }

  return sections;
}

/**
 * Generate unique IDs for sections
 */
function generateSectionId(index: number, text: string): string {
  // Extract first few words for a meaningful ID
  const words = text.trim().split(/\s+/).slice(0, 3).join('-');
  const sanitized = words
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 30);

  return `sec${index + 1}-${sanitized}`;
}

/**
 * Main function to extract and structure document text
 */
export async function extractStructuredDocument(
  file: File
): Promise<StructuredDocument> {
  let fullText: string;

  // Extract text based on file type
  const fileType = file.type;

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    fullText = await extractTextFromDocx(file);
  } else if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
    fullText = await extractTextFromPdf(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  // Split into sections
  const sectionsWithoutIds = splitIntoSections(fullText);

  // Add IDs to sections
  const sections: DocumentSection[] = sectionsWithoutIds.map((section, index) => ({
    ...section,
    id: generateSectionId(index, section.text),
  }));

  return {
    sections,
    originalFilename: file.name,
  };
}

/**
 * Alternative: Extract with custom section pattern
 */
export async function extractStructuredDocumentWithPattern(
  file: File,
  sectionPattern?: RegExp
): Promise<StructuredDocument> {
  let fullText: string;

  // Extract text based on file type
  const fileType = file.type;

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    fullText = await extractTextFromDocx(file);
  } else if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
    fullText = await extractTextFromPdf(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  // Use custom pattern if provided
  if (sectionPattern) {
    const matches = [...fullText.matchAll(sectionPattern)];
    const sections: DocumentSection[] = [];

    matches.forEach((match, index) => {
      const matchStart = match.index || 0;
      const nextMatchStart = matches[index + 1]?.index || fullText.length;
      const sectionText = fullText.substring(matchStart, nextMatchStart).trim();

      sections.push({
        id: generateSectionId(index, sectionText),
        text: sectionText,
        start: matchStart,
        end: nextMatchStart,
      });
    });

    return {
      sections,
      originalFilename: file.name,
    };
  }

  // Default splitting
  const sectionsWithoutIds = splitIntoSections(fullText);
  const sections: DocumentSection[] = sectionsWithoutIds.map((section, index) => ({
    ...section,
    id: generateSectionId(index, section.text),
  }));

  return {
    sections,
    originalFilename: file.name,
  };
}

/**
 * Ths is the document extraction helper functions
 * The raw text from either the docx or pdf are extracted and then the text is structured for later use in redlines
 * they are split into sections, it looks for patterns like:
 * "1. Definitions"
 * "Section 2"
 *It also includes standard LMA Section Headers
 */

import mammoth from "mammoth";

// Standard LMA Section Headers
const LMA_STANDARD_SECTIONS = [
  "DEFINITIONS AND INTERPRETATION",
  "THE FACILITY",
  "UTILISATION",
  "REPAYMENT, PREPAYMENT AND CANCELLATION",
  "COSTS OF UTILISATION",
  "ADDITIONAL PAYMENT OBLIGATIONS",
  "TAX GROSS UP AND INDEMNITIES",
  "INCREASED COSTS",
  "OTHER INDEMNITIES",
  "MITIGATION BY THE LENDERS",
  "GUARANTEE AND INDEMNITY",
  "REPRESENTATIONS",
  "UNDERTAKINGS",
  "EVENTS OF DEFAULT",
  "CHANGES TO THE LENDERS",
  "CHANGES TO THE OBLIGORS",
  "ROLE OF THE AGENT AND THE ARRANGER",
  "CONDUCT OF BUSINESS BY THE FINANCE PARTIES",
  "SHARING AMONG THE FINANCE PARTIES",
  "PAYMENT MECHANICS",
  "SET-OFF",
  "NOTICES",
  "CALCULATIONS AND CERTIFICATES",
  "PARTIAL INVALIDITY",
  "REMEDIES AND WAIVERS",
  "AMENDMENTS AND WAIVERS",
  "CONFIDENTIALITY",
  "GOVERNING LAW",
  "ENFORCEMENT",
  "SCHEDULES",
  "APPENDICES",
];

export interface TextChange {
  type: "insertion" | "deletion" | "replacement";
  originalText?: string;
  position: { start: number; end: number };
  newText: string;
  authorId?: string;
  timestamp: Date;
  proposalId: string;
  decisionId: string;
}

export interface DocumentSection {
  id: string;
  clauseNumber: string;
  type:
    | "heading"
    | "clause"
    | "subclause"
    | "paragraph"
    | "recital"
    | "definition"
    | "signature_block";
  heading?: string;
  text: string;
  start: number;
  end: number;
  version: number;
  parentClause?: string;
  depth: number;
}

export interface Document {
  id: string;
  sections: DocumentSection[];
  originalFilename: string;
  fileType: "docx" | "pdf";
  uploadedAt: Date;
  uploadedBy: string;
  textChanges: TextChange[];
}

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText.trim();
}

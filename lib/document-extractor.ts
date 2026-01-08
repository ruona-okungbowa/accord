/**
 * Document extraction helper functions for Accord system
 * Extracts raw text from DOCX/PDF files and structures them for redlining workflow
 * Optimized for LMA (Loan Market Association) template patterns
 * Server-side compatible
 */

import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Extract text from DOCX file (server-side)
 */
export async function extractTextFromDocx(
  buffer: Buffer | ArrayBuffer
): Promise<string> {
  const arrayBuffer =
    buffer instanceof Buffer ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) : buffer;
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Extract text from PDF file (server-side)
 */
export async function extractTextFromPdf(
  buffer: Buffer | ArrayBuffer
): Promise<string> {
  const arrayBuffer =
    buffer instanceof Buffer ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) : buffer;

  const pdf = await getDocument({ data: arrayBuffer }).promise;
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

/**
 * Extract text from uploaded file based on type
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDocx(buffer);
  } else if (mimeType === "application/pdf") {
    return extractTextFromPdf(buffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

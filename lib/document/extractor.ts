/**
 * Document extraction helper functions for Accord system
 * Extracts raw text from DOCX/PDF files
 */

import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function splitPdf(
  pdfBuffer: Buffer,
  maxPages: number
): Promise<Buffer[]> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const totalPages = pdfDoc.getPageCount();
  const chunks: Buffer[] = [];

  for (let i = 0; i < totalPages; i += maxPages) {
    const newDoc = await PDFDocument.create();
    const pagesToCopy = Array.from(
      { length: Math.min(maxPages, totalPages - i) },
      (_, k) => i + k
    );
    const copiedPages = await newDoc.copyPages(pdfDoc, pagesToCopy);
    copiedPages.forEach((page) => newDoc.addPage(page));

    chunks.push(Buffer.from(await newDoc.save()));
  }
  return chunks;
}

/**
 * Extract text from PDF using Google Document AI, with automatic chunking for >15 pages.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const location = process.env.GOOGLE_CLOUD_LOCATION!;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID!;
  const processorId = process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID!;
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!location || !projectId || !processorId) {
    throw new Error(
      "Missing Document AI env vars (project/location/processor)."
    );
  }

  const apiEndpoint = `${location}-documentai.googleapis.com`;

  const client = new DocumentProcessorServiceClient({
    apiEndpoint,
    ...(keyFilename ? { keyFilename } : {}),
  });

  const processorName = client.processorPath(projectId, location, processorId);

  const chunks = await splitPdf(buffer, 15);

  let fullText = "";
  for (let idx = 0; idx < chunks.length; idx++) {
    const chunk = chunks[idx];

    const [result] = await client.processDocument({
      name: processorName,
      rawDocument: {
        content: chunk.toString("base64"),
        mimeType: "application/pdf",
      },
    });

    const chunkText = result.document?.text || "";
    fullText += (chunkText ? chunkText : "") + "\n\n";
  }

  return fullText.trim();
}

/**
 * TypeScript interfaces for document extraction
 */

export interface DocumentSection {
  id: string;
  text: string;
  start: number;
  end: number;
}

export interface StructuredDocument {
  sections: DocumentSection[];
  originalFilename: string;
}

export interface DealDataWithDocument {
  name: string;
  description?: string;
  currency: string;
  targetSigningDate?: string | null;
  role: string;
  document?: File | null;
  structuredContent?: StructuredDocument | null;
}

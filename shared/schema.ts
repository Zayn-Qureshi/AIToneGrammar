import { z } from "zod";

// Grammar correction interface
export interface GrammarError {
  message: string;
  offset: number;
  length: number;
  replacements: string[];
  context: string;
  rule?: string;
  category?: string;
}

// Tone analysis interface
export interface ToneAnalysis {
  tone: string;
  confidence: number;
  label: string;
}

// Request/Response schemas for API
export const checkTextSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
});

export type CheckTextRequest = z.infer<typeof checkTextSchema>;

export interface CheckTextResponse {
  corrections: GrammarError[];
  tone: ToneAnalysis;
  correctedText: string;
}

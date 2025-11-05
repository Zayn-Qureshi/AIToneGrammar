import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { checkTextSchema, type CheckTextResponse, type GrammarError, type ToneAnalysis } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/check", async (req, res) => {
    try {
      const { text } = checkTextSchema.parse(req.body);

      const [grammarResult, toneResult] = await Promise.all([
        checkGrammar(text),
        analyzeTone(text),
      ]);

      const correctedText = applyCorrections(text, grammarResult);

      const response: CheckTextResponse = {
        corrections: grammarResult,
        tone: toneResult,
        correctedText,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error checking text:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request", details: error.errors });
      } else {
        res.status(500).json({ 
          error: "Failed to check text", 
          message: error.message 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function checkGrammar(text: string): Promise<GrammarError[]> {
  try {
    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      new URLSearchParams({
        text: text,
        language: "en-US",
        enabledOnly: "false",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 15000,
      }
    );

    const matches = response.data.matches || [];
    
    return matches.map((match: any) => ({
      message: match.message,
      offset: match.offset,
      length: match.length,
      replacements: match.replacements
        .slice(0, 3)
        .map((r: any) => r.value),
      context: match.context?.text || "",
      rule: match.rule?.id,
      category: match.rule?.category?.name,
    }));
  } catch (error: any) {
    console.error("Grammar check error:", error.message);
    throw new Error("Grammar checking service unavailable");
  }
}

async function analyzeTone(text: string): Promise<ToneAnalysis> {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error("Hugging Face API key not configured");
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const results = response.data[0];
    if (!results || results.length === 0) {
      return {
        tone: "neutral",
        confidence: 0.5,
        label: "Neutral",
      };
    }

    const topResult = results.reduce((prev: any, current: any) =>
      prev.score > current.score ? prev : current
    );

    const label = topResult.label.toLowerCase();
    
    let toneLabel = "Neutral";
    if (label.includes("joy") || label.includes("surprise")) {
      toneLabel = "Informal & Positive";
    } else if (label.includes("anger") || label.includes("disgust")) {
      toneLabel = "Informal & Negative";
    } else if (label.includes("sadness") || label.includes("fear")) {
      toneLabel = "Informal & Cautious";
    } else {
      toneLabel = "Formal & Neutral";
    }

    return {
      tone: topResult.label,
      confidence: topResult.score,
      label: toneLabel,
    };
  } catch (error: any) {
    console.error("Tone analysis error:", error.message);
    
    return {
      tone: "neutral",
      confidence: 0.5,
      label: "Neutral",
    };
  }
}

function applyCorrections(text: string, errors: GrammarError[]): string {
  if (errors.length === 0) return text;

  const sortedErrors = [...errors].sort((a, b) => b.offset - a.offset);

  let correctedText = text;
  for (const error of sortedErrors) {
    if (error.replacements.length > 0) {
      correctedText =
        correctedText.substring(0, error.offset) +
        error.replacements[0] +
        correctedText.substring(error.offset + error.length);
    }
  }

  return correctedText;
}

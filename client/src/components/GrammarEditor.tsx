import { useState, useRef, useEffect } from "react";
import { type GrammarError } from "@shared/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface GrammarEditorProps {
  text: string;
  setText: (text: string) => void;
  errors: GrammarError[];
  isChecking: boolean;
}

interface HighlightedSegment {
  text: string;
  isError: boolean;
  error?: GrammarError;
}

export function GrammarEditor({
  text,
  setText,
  errors,
  isChecking,
}: GrammarEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const getHighlightedSegments = (): HighlightedSegment[] => {
    if (errors.length === 0) {
      return [{ text, isError: false }];
    }

    const segments: HighlightedSegment[] = [];
    let lastIndex = 0;

    const sortedErrors = [...errors].sort((a, b) => a.offset - b.offset);

    sortedErrors.forEach((error) => {
      if (error.offset > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, error.offset),
          isError: false,
        });
      }

      segments.push({
        text: text.substring(error.offset, error.offset + error.length),
        isError: true,
        error,
      });

      lastIndex = error.offset + error.length;
    });

    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isError: false,
      });
    }

    return segments;
  };

  const applyCorrection = (error: GrammarError, replacement: string) => {
    const newText =
      text.substring(0, error.offset) +
      replacement +
      text.substring(error.offset + error.length);
    setText(newText);
    setOpenPopoverId(null);
  };

  const segments = getHighlightedSegments();

  return (
    <div className="relative">
      <div className="relative rounded-xl border border-input bg-card overflow-hidden">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[60vh] p-6 text-base leading-relaxed bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          placeholder="Type or paste your text here to check for grammar errors and analyze tone..."
          disabled={isChecking}
          data-testid="textarea-editor"
        />

        {errors.length > 0 && (
          <div
            className="absolute inset-0 p-6 text-base leading-relaxed pointer-events-none font-mono whitespace-pre-wrap break-words overflow-hidden"
            aria-hidden="true"
          >
            {segments.map((segment, index) =>
              segment.isError ? (
                <Popover
                  key={index}
                  open={openPopoverId === index}
                  onOpenChange={(open) => setOpenPopoverId(open ? index : null)}
                >
                  <PopoverTrigger asChild>
                    <span
                      className="relative inline pointer-events-auto cursor-pointer hover:bg-destructive/10 transition-colors"
                      style={{
                        borderBottom: "2px wavy #ef4444",
                        color: "transparent",
                      }}
                      data-testid={`error-highlight-${index}`}
                    >
                      {segment.text}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-4"
                    data-testid={`error-tooltip-${index}`}
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {segment.error?.message}
                        </p>
                        {segment.error?.category && (
                          <p className="text-xs text-muted-foreground">
                            {segment.error.category}
                          </p>
                        )}
                      </div>

                      {segment.error?.replacements &&
                        segment.error.replacements.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Suggestions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {segment.error.replacements
                                .slice(0, 3)
                                .map((replacement, idx) => (
                                  <Button
                                    key={idx}
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      segment.error &&
                                      applyCorrection(segment.error, replacement)
                                    }
                                    data-testid={`button-apply-${index}-${idx}`}
                                    className="gap-1"
                                  >
                                    <Check className="h-3 w-3" />
                                    {replacement}
                                  </Button>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <span key={index} style={{ color: "transparent" }}>
                  {segment.text}
                </span>
              )
            )}
          </div>
        )}
      </div>

      {isChecking && (
        <p className="text-sm text-muted-foreground mt-2 animate-pulse" data-testid="text-analyzing">
          Analyzing your text...
        </p>
      )}
    </div>
  );
}

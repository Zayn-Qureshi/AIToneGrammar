import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { useState } from "react";

interface ActionBarProps {
  onCheck: () => void;
  isChecking: boolean;
  hasErrors: boolean;
  correctedText: string;
  disabled?: boolean;
}

export function ActionBar({
  onCheck,
  isChecking,
  hasErrors,
  correctedText,
  disabled,
}: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <Button
        size="lg"
        onClick={onCheck}
        disabled={isChecking || disabled}
        className="px-8"
        data-testid="button-check-text"
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Check Text
          </>
        )}
      </Button>

      {hasErrors && correctedText && (
        <Button
          size="lg"
          variant="outline"
          onClick={handleCopy}
          disabled={copied}
          className="px-6"
          data-testid="button-copy-corrected"
        >
          {copied ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4 text-chart-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Corrected Text
            </>
          )}
        </Button>
      )}
    </div>
  );
}

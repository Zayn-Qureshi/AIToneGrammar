import { type ToneAnalysis } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ToneIndicatorProps {
  tone: ToneAnalysis | null;
}

export function ToneIndicator({ tone }: ToneIndicatorProps) {
  if (!tone) {
    return (
      <div className="space-y-2" data-testid="tone-indicator-empty">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Tone Detection
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-muted" />
      </div>
    );
  }

  const getToneColor = (toneLabel: string) => {
    const label = toneLabel.toLowerCase();
    if (label.includes("formal") || label.includes("neutral")) {
      return "bg-chart-2";
    }
    return "bg-chart-1";
  };

  const getToneBadgeVariant = (toneLabel: string) => {
    const label = toneLabel.toLowerCase();
    if (label.includes("formal") || label.includes("neutral")) {
      return "default" as const;
    }
    return "secondary" as const;
  };

  return (
    <div className="space-y-2" data-testid="tone-indicator">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Tone Detection</p>
        <Badge variant={getToneBadgeVariant(tone.label)} data-testid="tone-badge">
          {tone.label}
        </Badge>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${getToneColor(tone.label)} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${Math.round(tone.confidence * 100)}%` }}
          data-testid="tone-confidence-bar"
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {Math.round(tone.confidence * 100)}% confidence
      </p>
    </div>
  );
}

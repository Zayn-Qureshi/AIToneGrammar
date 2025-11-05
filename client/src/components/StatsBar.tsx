interface StatsBarProps {
  text: string;
  errorCount: number;
}

export function StatsBar({ text, errorCount }: StatsBarProps) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <div data-testid="stat-words">
        <span className="font-medium">{wordCount}</span> words
      </div>
      <div data-testid="stat-characters">
        <span className="font-medium">{charCount}</span> characters
      </div>
      {errorCount > 0 && (
        <div data-testid="stat-errors" className="text-destructive font-medium">
          {errorCount} {errorCount === 1 ? "issue" : "issues"} found
        </div>
      )}
    </div>
  );
}

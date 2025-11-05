import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type CheckTextResponse, type GrammarError, type ToneAnalysis } from "@shared/schema";
import { GrammarEditor } from "@/components/GrammarEditor";
import { ToneIndicator } from "@/components/ToneIndicator";
import { StatsBar } from "@/components/StatsBar";
import { ActionBar } from "@/components/ActionBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [tone, setTone] = useState<ToneAnalysis | null>(null);
  const [correctedText, setCorrectedText] = useState("");
  const { toast } = useToast();

  const checkTextMutation = useMutation({
    mutationFn: async (textToCheck: string) => {
      const response = await apiRequest(
        "POST",
        "/api/check",
        { text: textToCheck }
      );
      return await response.json() as CheckTextResponse;
    },
    onSuccess: (data) => {
      const corrections = data.corrections || [];
      setErrors(corrections);
      setTone(data.tone || null);
      setCorrectedText(data.correctedText || text);
      
      if (corrections.length === 0) {
        toast({
          title: "Great work!",
          description: "No grammar issues found in your text.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error checking text",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleCheck = () => {
    if (!text.trim()) {
      toast({
        title: "No text to check",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return;
    }
    checkTextMutation.mutate(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="flex items-center justify-between mb-8 lg:mb-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                AI Writing Assistant
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Grammar checking and tone analysis
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          <StatsBar text={text} errorCount={errors.length} />

          <ToneIndicator tone={tone} />

          <GrammarEditor
            text={text}
            setText={setText}
            errors={errors}
            setErrors={setErrors}
            isChecking={checkTextMutation.isPending}
          />

          <ActionBar
            onCheck={handleCheck}
            isChecking={checkTextMutation.isPending}
            hasErrors={errors.length > 0}
            correctedText={correctedText}
            disabled={!text.trim()}
          />
        </div>
      </div>
    </div>
  );
}

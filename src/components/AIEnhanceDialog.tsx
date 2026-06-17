"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X, Loader2, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIEnhanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enhanceType: string;
  originalContent: string;
  enhancedContent: string | null;
  summary: string | null;
  isGenerating: boolean;
  onApply: () => void;
}

const enhanceLabels: Record<string, { label: string; icon: string }> = {
  "improve-writing": { label: "Improve Writing", icon: "✨" },
  "fix-grammar": { label: "Fix Grammar", icon: "📝" },
  "make-shorter": { label: "Make Shorter", icon: "📏" },
  "make-longer": { label: "Make Longer", icon: "📖" },
  "change-tone": { label: "Change Tone", icon: "🎭" },
  "translate-arabic": { label: "Translate to Arabic", icon: "🇸🇦" },
  "translate-english": { label: "Translate to English", icon: "🇬🇧" },
};

export function AIEnhanceDialog({
  open,
  onOpenChange,
  enhanceType,
  originalContent,
  enhancedContent,
  summary,
  isGenerating,
  onApply,
}: AIEnhanceDialogProps) {
  const info = enhanceLabels[enhanceType] || { label: enhanceType, icon: "✨" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col rounded-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-primary" />
            {info.icon} {info.label}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest">
            Preview the enhanced content before applying changes.
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Generating enhancement...
              </p>
            </div>
          </div>
        ) : enhancedContent ? (
          <div className="flex-1 overflow-auto space-y-4">
            {summary && (
              <div className="bg-primary/5 border border-primary/20 p-3 text-[10px] font-bold text-muted-foreground">
                <span className="text-primary uppercase tracking-widest">Changes: </span>
                {summary}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  Original
                </div>
                <div className="border border-border bg-muted/30 p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {originalContent || "No content"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                  <Sparkles className="h-3 w-3" />
                  Enhanced
                </div>
                <div className="border border-primary/30 bg-primary/5 p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {enhancedContent}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-20 text-xs text-muted-foreground">
            No content to preview.
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-none h-9 text-[10px] font-black uppercase tracking-widest gap-2"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
          <Button
            onClick={onApply}
            disabled={!enhancedContent || isGenerating}
            className="rounded-none h-9 text-[10px] font-black uppercase tracking-widest gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


"use client"

import { useState, useEffect, useCallback } from "react";
import { Document } from "@/lib/types";
import { useFirestore, useUser } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { parseMarkdown, isRTL } from "@/lib/markdown";
import { aiContentSuggestions } from "@/ai/flows/ai-content-suggestions";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Save, Sparkles, Columns2, ChevronLeft, PanelRight, FileText, AlignLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface EditorViewProps {
  initialDoc: Document;
}

export function EditorView({ initialDoc }: EditorViewProps) {
  const [currentDoc, setCurrentDoc] = useState<Document>(initialDoc);
  const [html, setHtml] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [viewMode, setViewMode] = useState<"both" | "editor" | "preview">("both");
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const updateHtml = useCallback(async (content: string) => {
    const rendered = await parseMarkdown(content);
    setHtml(rendered);
  }, []);

  useEffect(() => {
    updateHtml(currentDoc.content);
  }, [currentDoc.content, updateHtml]);

  const handleSave = useCallback(() => {
    if (!firestore || !user) return;
    setIsSaving(true);
    const docRef = doc(firestore, 'users', user.uid, 'documents', currentDoc.id);
    const updateData = {
      title: currentDoc.title,
      content: currentDoc.content,
      summary: currentDoc.summary || "",
      updatedAt: Date.now()
    };
    
    updateDoc(docRef, updateData)
      .then(() => {
        toast({ title: "Saved", description: "All changes synced to cloud." });
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      })
      .finally(() => setIsSaving(false));
  }, [currentDoc, firestore, user, toast]);

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasChanged = currentDoc.content !== initialDoc.content || 
                         currentDoc.title !== initialDoc.title || 
                         currentDoc.summary !== initialDoc.summary;

      if (firestore && user && hasChanged) {
        const docRef = doc(firestore, 'users', user.uid, 'documents', currentDoc.id);
        updateDoc(docRef, {
          title: currentDoc.title,
          content: currentDoc.content,
          summary: currentDoc.summary || "",
          updatedAt: Date.now()
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentDoc, firestore, user, initialDoc]);

  const handleAISuggestion = async () => {
    if (!currentDoc.content.trim()) return;
    setIsSuggesting(true);
    try {
      const result = await aiContentSuggestions({ markdownContent: currentDoc.content });
      setCurrentDoc(prev => ({ 
        ...prev, 
        title: result.title, 
        summary: result.summary 
      }));
      toast({ title: "AI Enhanced", description: "Generated title and summary." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Failed", description: "Could not analyze content." });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCurrentDoc(prev => ({ ...prev, content: value || "" }));
  };

  const rtl = isRTL(currentDoc.content);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />
      
      <div className="border-b bg-background px-4 h-14 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-md shrink-0">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input 
              value={currentDoc.title}
              onChange={(e) => setCurrentDoc(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Untitled"
              className={cn(
                "h-8 border-none bg-transparent focus-visible:ring-0 p-0 text-sm font-bold tracking-tight w-full truncate",
                isRTL(currentDoc.title) ? "text-right" : "text-left"
              )}
              dir={isRTL(currentDoc.title) ? "rtl" : "ltr"}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAISuggestion}
            disabled={isSuggesting}
            className="hidden sm:flex h-8 gap-2 border-border/50 bg-secondary/30 hover:bg-secondary/50 text-xs font-semibold"
          >
            <Sparkles className={cn("h-3 w-3", isSuggesting && "animate-pulse")} />
            AI Prompt
          </Button>
          <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/50">
            <Button 
              variant={viewMode === "editor" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("editor")} 
              className="h-7 w-7 rounded-md"
            >
              <FileText className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewMode === "both" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("both")} 
              className="h-7 w-7 rounded-md"
            >
              <Columns2 className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewMode === "preview" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("preview")} 
              className="h-7 w-7 rounded-md"
            >
              <PanelRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isSaving}
            className="h-8 gap-2 bg-primary text-primary-foreground font-bold px-4"
          >
            <Save className={cn("h-3.5 w-3.5", isSaving && "animate-spin")} />
            Deploy
          </Button>
        </div>
      </div>

      {currentDoc.summary && (
        <div className="bg-primary/5 border-b px-8 py-2 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-500">
          <AlignLeft className="h-3 w-3 text-primary opacity-50 shrink-0" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
            <span className="text-primary mr-2 opacity-100 font-black">AI Summary:</span>
            {currentDoc.summary}
          </p>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === "both" || viewMode === "editor") && (
          <div className="flex-1 h-full overflow-hidden bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={currentDoc.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Source Code Pro",
                wordWrap: "on",
                padding: { top: 32, bottom: 32 },
                lineNumbers: "on",
                lineHeight: 1.8,
                scrollBeyondLastLine: true,
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
              }}
            />
          </div>
        )}

        {(viewMode === "both" || viewMode === "preview") && (
          <div className={cn(
            "flex-1 bg-background overflow-y-auto p-8 sm:p-16 prose-markdown border-l",
            viewMode === "preview" && "max-w-4xl mx-auto px-6"
          )} dir={rtl ? "rtl" : "ltr"}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {!html && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
                <FileText className="h-16 w-16 mb-4 stroke-[1]" />
                <p className="text-sm font-medium">Empty Document</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Document } from "@/lib/types";
import { useFirestore, useUser } from "@/firebase";
import { doc, collection, setDoc, updateDoc } from "firebase/firestore";
import { parseMarkdown, isRTL } from "@/lib/markdown";
import { aiContentSuggestions } from "@/ai/flows/ai-content-suggestions";
import { aiEnhanceContent } from "@/ai/flows/ai-enhance-content";
import { EnhanceType } from "@/ai/flows/ai-enhance-types";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { AIEnhanceDialog } from "@/components/AIEnhanceDialog";
import { Save, Sparkles, Columns2, ChevronLeft, PanelRight, FileText, AlignLeft, AlignRight, ChevronDown, Wand2, SpellCheck, Shrink, Expand, Languages, Speech, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// ─── GitHub Markdown CSS injection ──────────────────────────────────────────
// Mirrors exactly what markdown-live-preview does: inject a <link> into <head>
// and swap it when the theme changes.
const GH_MD_CSS_LIGHT = '/github-markdown-light.css';
const GH_MD_CSS_DARK  = '/github-markdown-dark.css';
const GH_MD_LINK_ID   = 'gh-markdown-link';

function setMarkdownCss(isDark: boolean) {
  if (typeof document === 'undefined') return;
  const href = isDark ? GH_MD_CSS_DARK : GH_MD_CSS_LIGHT;
  let link = document.getElementById(GH_MD_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id   = GH_MD_LINK_ID;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== href) {
    link.setAttribute('href', href);
  }
}

function isDarkTheme(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

// ─── Component ───────────────────────────────────────────────────────────────

interface EditorViewProps {
  initialDoc: Document;
  isGuest?: boolean;
}

export function EditorView({ initialDoc, isGuest }: EditorViewProps) {
  const [currentDoc, setCurrentDoc] = useState<Document>(initialDoc);
  const [html, setHtml]             = useState("");
  const [isSaving, setIsSaving]     = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [viewMode, setViewMode]     = useState<"both" | "editor" | "preview">("both");
  const [dark, setDark]             = useState(false);
  // Manual text-direction: 'ltr' | 'rtl' | 'auto' (auto uses content detection)
  const [textDir, setTextDir]       = useState<"ltr" | "rtl" | "auto">("ltr");
  const resolvedDir = textDir === "auto" ? (isRTL(currentDoc.content) ? "rtl" : "ltr") : textDir;

  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  // ── AI Enhancement Dialog state ──
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiEnhanceType, setAiEnhanceType] = useState<string>("improve-writing");
  const [aiEnhancedContent, setAiEnhancedContent] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingEnhance, setIsGeneratingEnhance] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { toast }     = useToast();
  const firestore     = useFirestore();
  const { user }      = useUser();
  const previewRef    = useRef<HTMLDivElement>(null);

  // ── Detect and sync theme with the GitHub MD stylesheet ──────────────────
  useEffect(() => {
    const currentDark = isDarkTheme();
    setDark(currentDark);
    setMarkdownCss(currentDark);

    // Watch for class changes on <html> (ThemeToggle adds/removes "dark")
    const observer = new MutationObserver(() => {
      const nowDark = isDarkTheme();
      setDark(nowDark);
      setMarkdownCss(nowDark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // ── Markdown → HTML rendering ────────────────────────────────────────────
  const updateHtml = useCallback(async (content: string) => {
    const rendered = await parseMarkdown(content);
    setHtml(rendered);
  }, []);

  useEffect(() => {
    updateHtml(currentDoc.content);
  }, [currentDoc.content, updateHtml]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!firestore || !user || isGuest) return;
    setIsSaving(true);
    const docRef   = doc(firestore, 'users', user.uid, 'documents', currentDoc.id);
    const updateData = {
      title:     currentDoc.title,
      content:   currentDoc.content,
      summary:   currentDoc.summary || "",
      updatedAt: Date.now()
    };

    updateDoc(docRef, updateData)
      .then(() => toast({ title: "Saved", description: "All changes synced to cloud." }))
      .catch(() => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path, operation: 'update', requestResourceData: updateData
        }));
      })
      .finally(() => setIsSaving(false));
  }, [currentDoc, firestore, user, toast]);

  // ── Auto-save (debounced 2 s) ────────────────────────────────────────────
  useEffect(() => {
    if (isGuest) return;
    const timer = setTimeout(() => {
      const hasChanged =
        currentDoc.content !== initialDoc.content ||
        currentDoc.title   !== initialDoc.title   ||
        currentDoc.summary !== initialDoc.summary;

      if (firestore && user && hasChanged) {
        const docRef = doc(firestore, 'users', user.uid, 'documents', currentDoc.id);
        updateDoc(docRef, {
          title:     currentDoc.title,
          content:   currentDoc.content,
          summary:   currentDoc.summary || "",
          updatedAt: Date.now()
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentDoc, firestore, user, initialDoc]);

  // ── AI suggestions (title + summary) ──
  const handleAISuggestion = async () => {
    if (!currentDoc.content.trim()) return;
    setIsSuggesting(true);
    try {
      const result = await aiContentSuggestions({ markdownContent: currentDoc.content });
      setCurrentDoc(prev => ({ ...prev, title: result.title, summary: result.summary }));
      toast({ title: "AI Enhanced", description: "Generated title and summary." });
    } catch {
      toast({ variant: "destructive", title: "AI Failed", description: "Could not analyze content." });
    } finally {
      setIsSuggesting(false);
    }
  };

  // ── AI Content Enhancement ──
  const handleEnhanceContent = async (type: string) => {
    if (!currentDoc.content.trim()) {
      toast({ variant: "destructive", title: "No Content", description: "Write something first." });
      return;
    }
    setAiEnhanceType(type);
    setAiEnhancedContent(null);
    setAiSummary(null);
    setAiDialogOpen(true);
    setIsGeneratingEnhance(true);

    try {
      const result = await aiEnhanceContent({
        content: currentDoc.content,
        enhanceType: type as EnhanceType,
      });
      setAiEnhancedContent(result.enhancedContent);
      setAiSummary(result.summary);
    } catch {
      toast({ variant: "destructive", title: "Enhancement Failed", description: "Could not enhance content." });
      setAiDialogOpen(false);
    } finally {
      setIsGeneratingEnhance(false);
    }
  };

  const handleApplyEnhancement = () => {
    if (!aiEnhancedContent) return;

    const isTranslation = aiEnhanceType === "translate-arabic" || aiEnhanceType === "translate-english";

    if (isTranslation) {
      if (!firestore || !user) {
        toast({ variant: "destructive", title: "Sign in required", description: "Sign in to create a translated document." });
        return;
      }
      const suffix = aiEnhanceType === "translate-arabic" ? " (Arabic)" : " (English)";
      const docData = {
        title: currentDoc.title + suffix,
        content: aiEnhancedContent,
        updatedAt: Date.now(),
        userId: user.uid,
        folderId: currentDoc.folderId || "",
      };
      const docRef = doc(collection(firestore, "users", user.uid, "documents"));
      setDoc(docRef, docData).catch(e => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: docRef.path, operation: "create", requestResourceData: docData,
        }));
      });
      toast({ title: "New file created", description: `"${currentDoc.title}${suffix}" has been created.` });
      router.push(`/editor/${docRef.id}`);
    } else {
      setCurrentDoc(prev => ({ ...prev, content: aiEnhancedContent! }));
      if (!isGuest) {
        toast({ title: "Applied", description: "Enhanced content has been applied." });
      }
    }
    setAiDialogOpen(false);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (isGuest) return;
    setCurrentDoc(prev => ({ ...prev, content: value || "" }));
  };

  const handleEditorBeforeMount = (monaco: any) => {
    monaco.editor.defineTheme('transparent-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
      }
    });
    monaco.editor.defineTheme('transparent-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
      }
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      {/* ── Toolbar ── */}
      <div className="border-b bg-background/80 backdrop-blur-md px-2 sm:px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-md shrink-0">
            <Link href="/"><ChevronLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={currentDoc.title}
              onChange={(e) => isGuest ? null : setCurrentDoc(prev => ({ ...prev, title: e.target.value }))}
              readOnly={isGuest}
              placeholder={isGuest ? "Demo Document" : "Untitled"}
              className={cn(
                "h-8 border-none bg-transparent focus-visible:ring-0 p-0 text-sm font-bold tracking-tight w-full truncate",
                isRTL(currentDoc.title) ? "text-right" : "text-left"
              )}
              dir={isRTL(currentDoc.title) ? "rtl" : "ltr"}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 ml-2 sm:ml-4">
          {/* AI Enhance — dropdown with options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isSuggesting || isGeneratingEnhance}
                className="hidden sm:flex h-8 gap-2 border-border/50 bg-secondary/30 hover:bg-secondary/50 text-xs font-semibold"
              >
                <Sparkles className={cn("h-3 w-3", (isSuggesting || isGeneratingEnhance) && "animate-pulse")} />
                <span className="hidden md:inline">Enhance</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Content Enhancements</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEnhanceContent("improve-writing")} className="gap-2 text-xs font-medium">
                <Wand2 className="h-3.5 w-3.5" /> Improve Writing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("fix-grammar")} className="gap-2 text-xs font-medium">
                <SpellCheck className="h-3.5 w-3.5" /> Fix Grammar & Spelling
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("make-shorter")} className="gap-2 text-xs font-medium">
                <Shrink className="h-3.5 w-3.5" /> Make Shorter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("make-longer")} className="gap-2 text-xs font-medium">
                <Expand className="h-3.5 w-3.5" /> Make Longer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("change-tone")} className="gap-2 text-xs font-medium">
                <Speech className="h-3.5 w-3.5" /> Professional Tone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Translate</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEnhanceContent("translate-arabic")} className="gap-2 text-xs font-medium">
                <Languages className="h-3.5 w-3.5" /> إلى العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("translate-english")} className="gap-2 text-xs font-medium">
                <Languages className="h-3.5 w-3.5" /> To English
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Title & Summary</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleAISuggestion} disabled={isSuggesting} className="gap-2 text-xs font-medium">
                <Sparkles className={cn("h-3.5 w-3.5", isSuggesting && "animate-pulse")} />
                Generate Title & Summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More actions dropdown (mobile) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8 rounded-md">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Enhance</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEnhanceContent("improve-writing")} className="gap-2 text-xs font-medium">
                <Wand2 className="h-3.5 w-3.5" /> Improve Writing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("fix-grammar")} className="gap-2 text-xs font-medium">
                <SpellCheck className="h-3.5 w-3.5" /> Fix Grammar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("make-shorter")} className="gap-2 text-xs font-medium">
                <Shrink className="h-3.5 w-3.5" /> Make Shorter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("make-longer")} className="gap-2 text-xs font-medium">
                <Expand className="h-3.5 w-3.5" /> Make Longer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("change-tone")} className="gap-2 text-xs font-medium">
                <Speech className="h-3.5 w-3.5" /> Professional Tone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Translate</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEnhanceContent("translate-arabic")} className="gap-2 text-xs font-medium">
                <Languages className="h-3.5 w-3.5" /> إلى العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEnhanceContent("translate-english")} className="gap-2 text-xs font-medium">
                <Languages className="h-3.5 w-3.5" /> To English
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Text Direction</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTextDir("ltr")} className={cn("text-xs font-medium gap-2", textDir === "ltr" && "bg-muted")}>
                <AlignLeft className="h-3.5 w-3.5" />LTR
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTextDir("rtl")} className={cn("text-xs font-medium gap-2", textDir === "rtl" && "bg-muted")}>
                <AlignRight className="h-3.5 w-3.5" />RTL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTextDir("auto")} className={cn("text-xs font-medium gap-2", textDir === "auto" && "bg-muted")}>
                <span className="text-[10px] font-black w-3.5 text-center">A</span>Auto
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAISuggestion} disabled={isSuggesting} className="gap-2 text-xs font-medium">
                <Sparkles className={cn("h-3.5 w-3.5", isSuggesting && "animate-pulse")} />
                Generate Title & Summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Direction — desktop only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex h-8 gap-1.5 border-border/50 bg-secondary/30 hover:bg-secondary/50 text-xs font-semibold"
              >
                {resolvedDir === "rtl" ? (
                  <AlignRight className="h-3 w-3" />
                ) : (
                  <AlignLeft className="h-3 w-3" />
                )}
                {textDir === "ltr" ? "LTR" : textDir === "rtl" ? "RTL" : "Auto"}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-bold">Text Direction</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTextDir("ltr")} className={cn("text-xs font-medium gap-2", textDir === "ltr" && "bg-muted")}>
                <AlignLeft className="h-3.5 w-3.5" />LTR — Left to Right
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTextDir("rtl")} className={cn("text-xs font-medium gap-2", textDir === "rtl" && "bg-muted")}>
                <AlignRight className="h-3.5 w-3.5" />RTL — Right to Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTextDir("auto")} className={cn("text-xs font-medium gap-2", textDir === "auto" && "bg-muted")}>
                <span className="text-[10px] font-black w-3.5 text-center">A</span>Auto — Detect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View-mode switcher */}
          <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/50">
            <Button variant={viewMode === "editor"  ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("editor")}  className="h-7 w-7 rounded-md">
              <FileText className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "both"    ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("both")}    className="h-7 w-7 rounded-md">
              <Columns2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "preview" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("preview")} className="h-7 w-7 rounded-md">
              <PanelRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {isGuest ? (
            <Button
              size="sm"
              disabled
              className="h-8 gap-2 bg-muted text-muted-foreground font-bold px-3 sm:px-4 text-[10px] sm:text-xs cursor-not-allowed"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign in to Save</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 gap-2 bg-primary text-primary-foreground font-bold px-3 sm:px-4 text-[10px] sm:text-xs"
            >
              <Save className={cn("h-3.5 w-3.5", isSaving && "animate-spin")} />
              <span className="hidden sm:inline">Deploy</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── AI summary strip ── */}
      {currentDoc.summary && (
        <div className="bg-primary/5 border-b px-4 sm:px-8 py-2 flex items-center gap-3">
          <AlignLeft className="h-3 w-3 text-primary opacity-50 shrink-0" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
            <span className="text-primary mr-2 opacity-100 font-black">AI Summary:</span>
            {currentDoc.summary}
          </p>
        </div>
      )}

      {/* ── Panes ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Editor pane — textarea on mobile, Monaco on desktop */}
        {(viewMode === "both" || viewMode === "editor") && (
          <div className="flex-1 h-full overflow-hidden bg-card">
            {isMobile ? (
              <textarea
                value={currentDoc.content}
                onChange={(e) => handleEditorChange(e.target.value)}
                readOnly={isGuest}
                className="w-full h-full resize-none bg-transparent p-4 sm:p-8 font-mono text-sm leading-relaxed outline-none"
                style={{ fontFamily: "'Source Code Pro', monospace" }}
                dir={resolvedDir}
              />
            ) : (
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={currentDoc.content}
                onChange={handleEditorChange}
                beforeMount={handleEditorBeforeMount}
                theme={dark ? "transparent-dark" : "transparent-light"}
                options={{
                  minimap:                    { enabled: false },
                  fontSize:                   14,
                  fontFamily:                 "Source Code Pro, monospace",
                  wordWrap:                   "on",
                  padding:                    { top: 32, bottom: 32 },
                  lineNumbers:                "on",
                  lineHeight:                 1.8,
                  scrollBeyondLastLine:       false,
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling:            true,
                  hover:                      { enabled: false },
                  quickSuggestions:           false,
                  folding:                    false,
                  automaticLayout:            true,
                  readOnly:                   isGuest,
                  domReadOnly:                isGuest,
                }}
              />
            )}
          </div>
        )}

        {/* ── Preview — styled exactly like markdown-live-preview ── */}
        {(viewMode === "both" || viewMode === "preview") && (
          <div
            className={cn(
              "flex-1 overflow-y-auto border-l md:border-l border-t md:border-t-0 bg-background",
            )}
            dir={resolvedDir}
          >
            <div
              ref={previewRef}
              id="md-preview-output"
              /* markdown-body is the key class — GitHub MD CSS scopes everything under it */
              className="markdown-body sm:px-8"
              style={{ padding: '16px 16px 32px 16px', minHeight: '100%' }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {!html && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 py-32">
                <FileText className="h-16 w-16 mb-4 stroke-[1]" />
                <p className="text-sm font-medium">Empty Document</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── AI Enhancement Dialog ── */}
      <AIEnhanceDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        enhanceType={aiEnhanceType}
        originalContent={currentDoc.content}
        enhancedContent={aiEnhancedContent}
        summary={aiSummary}
        isGenerating={isGeneratingEnhance}
        onApply={handleApplyEnhancement}
      />
    </div>
  );
}

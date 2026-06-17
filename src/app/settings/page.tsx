"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { useBranding } from "@/components/BrandingProvider";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Sparkles, Layout, Check, Palette, Eye, ShieldAlert, Laptop, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface ThemeItem {
  id: string;
  name: string;
  colors: string[]; // Primary, Background, Text
  desc: string;
}

const THEMES: ThemeItem[] = [
  { id: "default", name: "Default Prose", colors: ["#000000", "#ffffff", "#000000"], desc: "Standard clean dark/light theme" },
  { id: "vercel", name: "Vercel", colors: ["#000000", "#fafafa", "#000000"], desc: "Sleek geometric minimalist theme" },
  { id: "supabase", name: "Supabase", colors: ["#3ecf8e", "#1c1c1c", "#ffffff"], desc: "Developer centric dark & green theme" },
  { id: "claude", name: "Claude", colors: ["#d97706", "#fbfbfa", "#1f1f1f"], desc: "Warm cozy researcher-friendly theme" },
  { id: "neobrutualism", name: "Neobrutalism", colors: ["#ff5a5a", "#ffffff", "#000000"], desc: "Bold retro borders and pop colors" },
  { id: "zen", name: "Zen", colors: ["#10b981", "#f4f4f5", "#18181b"], desc: "Peaceful clean minimalist theme" },
  { id: "mono", name: "Mono", colors: ["#3f3f46", "#fafafa", "#18181b"], desc: "Classic high contrast typewriter style" },
  { id: "notebook", name: "Notebook", colors: ["#f59e0b", "#fefdf6", "#1c1917"], desc: "Warm yellow ruled paper style" },
  { id: "light-green", name: "Light Green", colors: ["#22c55e", "#f0fdf4", "#166534"], desc: "Fresh organic botanical vibes" },
  { id: "astro-vista", name: "Astro Vista", colors: ["#8b5cf6", "#f9fafb", "#1f2937"], desc: "Deep space cosmic purple gradients" },
  { id: "whatsapp", name: "Whatsapp", colors: ["#25d366", "#f0f2f5", "#111b21"], desc: "Chummy chat dialogue green vibes" }
];

const PRESETS = [
  { label: "Default", color: "" },
  { label: "Neon Pink", color: "#ec4899" },
  { label: "Cyber Orange", color: "#f97316" },
  { label: "Retro Teal", color: "#14b8a6" },
  { label: "Imperial Blue", color: "#3b82f6" },
  { label: "Crimson Red", color: "#ef4444" }
];

export default function SettingsPage() {
  const { user, loading: authLoading } = useUser();
  const { settings, updateSettings, loading: settingsLoading } = useBranding();
  const router = useRouter();
  const { toast } = useToast();

  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [saving, setSaving] = useState(false);

  // Load current values
  useEffect(() => {
    if (!settingsLoading) {
      setBrandName(settings.brandName || "");
      setBrandLogo(settings.brandLogo || "");
      setCustomColor(settings.customColor || "");
    }
  }, [settings, settingsLoading]);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        brandName,
        brandLogo,
        customColor
      });
      toast({
        title: "Settings Saved",
        description: "Your brand and theme settings have been updated.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setBrandName("ProsePortal");
    setBrandLogo("⚡");
    setCustomColor("");
    await updateSettings({
      theme: "default",
      brandName: "ProsePortal",
      brandLogo: "⚡",
      customColor: ""
    });
    toast({
      title: "Reset Complete",
      description: "Default brand and theme configuration restored.",
    });
  };

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse mb-2" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Loading workspace config...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-8">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-md">
              <Link href="/">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Workspace Settings</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Customize colors, select themes, and control branding parameters.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="h-9 px-4 text-xs font-bold uppercase tracking-widest rounded-none border-dashed border-destructive hover:bg-destructive/10 hover:text-destructive">
            Reset Defaults
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Controls Panel */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Theme Gallery */}
            <Card className="rounded-none border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Theme Library
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider">
                  Apply a pre-configured theme design to customize the app's visual system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {THEMES.map((theme) => {
                    const isSelected = settings.theme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => updateSettings({ theme: theme.id })}
                        className={`text-left p-4 border transition-all rounded-none relative flex flex-col justify-between h-28 group ${
                          isSelected 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "border-border hover:border-foreground/50 bg-card"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest">{theme.name}</span>
                            {isSelected && (
                              <div className="bg-primary text-primary-foreground p-0.5 rounded-full">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-normal">{theme.desc}</p>
                        </div>
                        
                        {/* Theme palette dots */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {theme.colors.map((c, i) => (
                            <span 
                              key={i} 
                              className="h-3.5 w-3.5 rounded-full border border-border/20 shadow-sm"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 2. Custom Branding Form */}
            <Card className="rounded-none border-border">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Own Branding Parameters
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider">
                  Customize the application identity by changing logos, names, and accent colors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brand-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand Title</Label>
                      <Input
                        id="brand-name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="ProsePortal"
                        className="rounded-none border-border uppercase font-bold text-xs tracking-wider"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand-logo" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand Logo Emoji</Label>
                      <Input
                        id="brand-logo"
                        value={brandLogo}
                        onChange={(e) => setBrandLogo(e.target.value)}
                        placeholder="⚡"
                        maxLength={2}
                        className="rounded-none border-border text-center font-bold text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Custom Theme Primary Color</Label>
                    
                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 pb-2">
                      {PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setCustomColor(p.color)}
                          className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all rounded-none ${
                            customColor === p.color 
                              ? "bg-primary text-primary-foreground border-primary" 
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          <span 
                            className="inline-block h-2 w-2 rounded-full mr-1.5"
                            style={{ backgroundColor: p.color || "#000000" }}
                          />
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Hex Input */}
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={customColor || "#000000"}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="h-10 w-12 p-0.5 rounded-none border border-border cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#ec4899"
                        className="rounded-none border-border font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t flex justify-end">
                    <Button type="submit" disabled={saving} className="rounded-none px-6 font-bold uppercase text-xs tracking-wider">
                      {saving ? "Saving Changes..." : "Apply Custom Branding"}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Live Preview Panel */}
          <div className="space-y-8">
            <Card className="rounded-none border-border sticky top-24">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  Live Preview
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">
                  Preview how branding updates look inside the app workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* 1. Header preview */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Workspace Header</span>
                  <div className="border border-border p-3 bg-background flex items-center justify-between rounded-none shadow-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-1.5 rounded-xl flex items-center justify-center w-7 h-7 select-none text-[12px] font-bold"
                        style={{ backgroundColor: customColor || "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        {brandLogo || "⚡"}
                      </div>
                      <span className="font-extrabold text-sm tracking-tight">{brandName || "ProsePortal"}</span>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-border/80 flex items-center justify-center bg-muted/50">
                      <Laptop className="h-2.5 w-2.5 opacity-60" />
                    </div>
                  </div>
                </div>

                {/* 2. Button & Control theme preview */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Buttons & Highlights</span>
                  <div className="border border-border p-4 bg-background space-y-3 rounded-none">
                    <button 
                      className="w-full text-center py-2 text-[10px] font-black uppercase tracking-widest shadow transition-transform select-none rounded-none"
                      style={{ backgroundColor: customColor || "var(--primary)", color: "var(--primary-foreground)" }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Workspace Button
                    </button>
                    <div className="flex items-center gap-2">
                      <span 
                        className="h-2 w-2 rounded-full animate-ping"
                        style={{ backgroundColor: customColor || "var(--primary)" }}
                      />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Accent styling active</span>
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-3 bg-muted/40 border border-border flex gap-2.5 rounded-none">
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-[9px] leading-relaxed font-bold text-muted-foreground uppercase">
                    Your branding and theme variables automatically propagate into editor tools, preview rendering interfaces, and folder trees.
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}

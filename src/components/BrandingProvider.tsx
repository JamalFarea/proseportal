"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

export interface BrandingSettings {
  theme: string;
  brandName: string;
  brandLogo: string;
  customColor: string;
}

interface BrandingContextType {
  settings: BrandingSettings;
  updateSettings: (newSettings: Partial<BrandingSettings>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: BrandingSettings = {
  theme: "default",
  brandName: "ProsePortal",
  brandLogo: "⚡",
  customColor: "",
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [settings, setSettings] = useState<BrandingSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // 1. Sync settings from Firestore or LocalStorage
  useEffect(() => {
    // If not logged in, load from localStorage
    if (!user) {
      const local = localStorage.getItem("pp_branding");
      if (local) {
        try {
          setSettings(JSON.parse(local));
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
      return;
    }

    if (!firestore) return;

    // Load from Firestore with live sync
    const docRef = doc(firestore, "users", user.uid, "documents", "settings");
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as BrandingSettings;
        setSettings({ ...defaultSettings, ...data });
      } else {
        // Fallback to local if document doesn't exist
        const local = localStorage.getItem("pp_branding");
        if (local) {
          try {
            setSettings(JSON.parse(local));
          } catch (e) {
            // ignore
          }
        }
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore settings fetch failed: ", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  // 2. Apply theme & custom brand colors dynamically to document element
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    
    // Apply data-theme attribute
    if (settings.theme && settings.theme !== "default") {
      root.setAttribute("data-theme", settings.theme);
    } else {
      root.removeAttribute("data-theme");
    }

    // Apply custom branding color if defined
    if (settings.customColor) {
      root.style.setProperty("--primary", settings.customColor);
      root.style.setProperty("--ring", settings.customColor);
      
      // Compute helper variations if custom color is present
      // If it's a hex color, we can set custom primary-foreground and opacity states
      if (settings.customColor.startsWith("#")) {
        root.style.setProperty("--primary-foreground", "#ffffff");
      }
    } else {
      // Clear custom color overrides
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--primary-foreground");
    }
  }, [settings]);

  // 3. Update settings helper
  const updateSettings = async (newSettings: Partial<BrandingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Always persist to local storage
    localStorage.setItem("pp_branding", JSON.stringify(updated));

    // Persist to Firestore if user is authenticated
    if (user && firestore) {
      const docRef = doc(firestore, "users", user.uid, "documents", "settings");
      await setDoc(docRef, updated, { merge: true });
    }
  };

  return (
    <BrandingContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}

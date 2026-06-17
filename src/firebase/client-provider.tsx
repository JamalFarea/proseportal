'use client';

import React, { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { initializeFirebase } from './init';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, firestore, auth } = useMemo(() => initializeFirebase(), []);

  // If Firebase is not initialized, we show a helpful setup screen
  // instead of letting the app crash or show weird behavior.
  if (!firebaseApp || !firestore || !auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 font-body">
        <div className="max-w-md w-full border border-black p-10 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-black p-3">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Setup Required</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Firebase is not yet configured. Please connect your project in the Firebase Studio sidebar or update your <code className="bg-muted px-1">.env</code> file with valid credentials.
          </p>
          <div className="pt-4">
            <Button 
              className="w-full rounded-none bg-black text-white hover:bg-black/90 font-bold uppercase text-xs tracking-widest h-12"
              onClick={() => window.location.reload()}
            >
              Check Configuration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}

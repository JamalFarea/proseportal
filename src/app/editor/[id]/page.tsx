
"use client"

import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { Document } from "@/lib/types";
import { getGuestDocument, isGuestId } from "@/lib/guest-data";
import { EditorView } from "@/components/EditorView";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";

function EditorContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const isGuestDoc = typeof id === "string" && isGuestId(id);
  const ownerUid = searchParams.get("owner");
  const isShared = !!ownerUid && ownerUid !== user?.uid;

  const [guestDoc, setGuestDoc] = useState<(Document & { id: string }) | null>(null);

  useEffect(() => {
    if (isGuestDoc && typeof id === "string") {
      setGuestDoc(getGuestDocument(id) || null);
    }
  }, [id, isGuestDoc]);

  const docRef = useMemo(() => {
    if (!firestore || !user || typeof id !== 'string' || isGuestDoc) return null;
    const uid = ownerUid || user.uid;
    return doc(firestore, 'users', uid, 'documents', id);
  }, [firestore, user, id, isGuestDoc, ownerUid]);

  const { data: document, loading: docLoading, error } = useDoc(docRef);

  if (authLoading || docLoading || (isGuestDoc && !guestDoc)) {
    return (
      <div className="h-screen w-screen flex flex-col bg-background p-4 gap-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="flex-1 flex gap-4">
          <Skeleton className="flex-1 h-full rounded-xl" />
          <Skeleton className="flex-1 h-full rounded-xl" />
        </div>
      </div>
    );
  }

  const resolvedDoc = isGuestDoc ? guestDoc : (document ? { ...document, id: id as string } as Document : null);

  if (!resolvedDoc) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground font-medium">Document not found or access denied.</p>
        <button onClick={() => router.push('/')} className="text-primary font-bold hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <>
      {isShared && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/10 border-b border-primary/20 px-4 py-1.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
          <ShieldCheck className="h-3 w-3" />
          Viewing document from shared workspace — read-only
        </div>
      )}
      <EditorView initialDoc={resolvedDoc} isGuest={isGuestDoc} isViewer={isShared} />
    </>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex flex-col bg-background p-4 gap-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="flex-1 flex gap-4">
          <Skeleton className="flex-1 h-full rounded-xl" />
          <Skeleton className="flex-1 h-full rounded-xl" />
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

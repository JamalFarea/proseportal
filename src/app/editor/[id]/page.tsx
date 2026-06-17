
"use client"

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { Document } from "@/lib/types";
import { GuestDocument, getGuestDocument, isGuestId } from "@/lib/guest-data";
import { EditorView } from "@/components/EditorView";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditorPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const isGuestDoc = typeof id === "string" && isGuestId(id);
  const [guestDoc, setGuestDoc] = useState<(Document & { id: string }) | null>(null);

  useEffect(() => {
    if (isGuestDoc && typeof id === "string") {
      setGuestDoc(getGuestDocument(id) || null);
    }
  }, [id, isGuestDoc]);

  const docRef = useMemo(() => {
    if (!firestore || !user || typeof id !== 'string' || isGuestDoc) return null;
    return doc(firestore, 'users', user.uid, 'documents', id);
  }, [firestore, user, id, isGuestDoc]);

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

  return <EditorView initialDoc={resolvedDoc} isGuest={isGuestDoc} />;
}

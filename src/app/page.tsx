
"use client"

import { useState, useEffect, useMemo } from "react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { Document, Folder } from "@/lib/types";
import { Header } from "@/components/Header";
import { DocumentCard } from "@/components/DocumentCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileX, Folder as FolderIcon, Hash, Settings2, ShieldCheck, Cloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const docsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'documents'), orderBy('updatedAt', 'desc'));
  }, [firestore, user]);

  const foldersQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'folders'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: documents = [], loading: docsLoading } = useCollection(docsQuery);
  const { data: folders = [], loading: foldersLoading } = useCollection(foldersQuery);

  const handleCreateNew = () => {
    if (!firestore || !user) return;
    const docData = {
      title: "Untitled Document",
      content: "",
      updatedAt: Date.now(),
      userId: user.uid,
      folderId: selectedFolderId || ""
    };
    const docRef = doc(collection(firestore, 'users', user.uid, 'documents'));
    setDoc(docRef, docData).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: docData
      }));
    });
    router.push(`/editor/${docRef.id}`);
  };

  const handleCreateFolder = () => {
    if (!firestore || !user) return;
    const folderName = prompt("Folder Name:");
    if (!folderName) return;

    const folderData = {
      name: folderName,
      userId: user.uid,
      createdAt: Date.now()
    };
    const folderRef = doc(collection(firestore, 'users', user.uid, 'folders'));
    setDoc(folderRef, folderData).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: folderRef.path,
        operation: 'create',
        requestResourceData: folderData
      }));
    });
  };

  const handleDelete = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'documents', id);
    deleteDoc(docRef).catch(async () => {
       errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    });
  };

  const handleMoveToFolder = (docId: string, folderId: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'documents', docId);
    updateDoc(docRef, { folderId, updatedAt: Date.now() }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { folderId }
      }));
    });
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolderId ? doc.folderId === selectedFolderId : true;
    return matchesSearch && matchesFolder;
  }) as Document[];

  if (authLoading || docsLoading || foldersLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 space-y-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </aside>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 space-y-10">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-none space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <Cloud className="h-3.5 w-3.5" />
              Cloud Sync: Active
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
              Your workspace is connected to Firestore production.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Folders</h2>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none transition-colors" onClick={handleCreateFolder}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="space-y-0.5">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start gap-3 h-9 text-xs font-bold uppercase tracking-widest transition-all rounded-none px-3",
                  selectedFolderId === null ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-muted"
                )}
                onClick={() => setSelectedFolderId(null)}
              >
                <Hash className="h-3.5 w-3.5" />
                All Projects
              </Button>
              {folders.map(folder => (
                <Button 
                  key={folder.id}
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start gap-3 h-9 text-xs font-bold uppercase tracking-widest transition-all rounded-none px-3",
                    selectedFolderId === folder.id ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-muted"
                  )}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <FolderIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{folder.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">System</h2>
            <div className="space-y-0.5">
              <Button variant="ghost" className="w-full justify-start gap-3 h-9 text-xs font-bold uppercase tracking-widest rounded-none px-3 hover:bg-muted">
                <Settings2 className="h-3.5 w-3.5" />
                Settings
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
                {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : "Overview"}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                <span>{filteredDocs.length} Documents</span>
                <span>/</span>
                <span className="text-black dark:text-white">Authenticated Session</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="FILTER..." 
                  className="pl-10 h-10 w-48 md:w-64 bg-transparent rounded-none border-border focus-visible:ring-black dark:focus-visible:ring-white font-bold uppercase text-[10px] tracking-widest"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateNew} className="gap-2 rounded-none px-6 bg-black hover:opacity-90 dark:bg-white text-white dark:text-black font-black h-10 uppercase text-[10px] tracking-widest transition-transform active:scale-95">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </div>
          </div>

          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map(doc => (
                <DocumentCard 
                  key={doc.id} 
                  doc={doc} 
                  onDelete={handleDelete} 
                  folders={folders as Folder[]} 
                  onMove={handleMoveToFolder}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border border-border border-dashed bg-muted/5">
              <FileX className="h-10 w-10 text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">No content found</h3>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
                {searchQuery ? "Clear search to see all" : "Create a document to get started"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

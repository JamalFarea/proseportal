import { Document } from './types';

const STORAGE_KEY = 'proseportal_docs';

export function getDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function getDocument(id: string): Document | undefined {
  const docs = getDocuments();
  return docs.find(d => d.id === id);
}

export function saveDocument(doc: Document) {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === doc.id);
  if (index >= 0) {
    docs[index] = { ...doc, updatedAt: Date.now() };
  } else {
    docs.push({ ...doc, updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function deleteDocument(id: string) {
  const docs = getDocuments();
  const filtered = docs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function createNewDocument(): Omit<Document, 'userId'> & { userId?: string } {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: 'Untitled Document',
    content: '',
    updatedAt: Date.now(),
    userId: '',
  };
}


export interface Document {
  id: string;
  title: string;
  content: string;
  summary?: string;
  updatedAt: number;
  folderId?: string;
  userId: string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: number;
}

export type WorkspaceRole = "editor" | "viewer";

export interface WorkspaceMember {
  role: WorkspaceRole;
  email: string;
  displayName: string;
  addedAt: number;
}

export interface SharedWorkspace {
  role: WorkspaceRole;
  ownerEmail: string;
  ownerName: string;
  addedAt: number;
}

export interface Invite {
  id: string;
  ownerUid: string;
  ownerEmail: string;
  ownerName: string;
  invitedEmail: string;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "declined";
  invitedAt: number;
}

export function generateInviteId(ownerUid: string, email: string): string {
  const key = `${ownerUid}_${email.toLowerCase().trim()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `invite_${Math.abs(hash).toString(36)}`;
}

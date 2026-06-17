"use client"

import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/firebase";
import { doc, setDoc, collection, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { X, UserPlus, Users, Mail, Shield, Trash2 } from "lucide-react";
import type { WorkspaceMember, WorkspaceRole } from "@/lib/workspace-sharing";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("editor");
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState<(WorkspaceMember & { uid: string })[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const loadMembers = async () => {
    if (!firestore || !user) return;
    setLoadingMembers(true);
    try {
      const snap = await getDocs(query(
        collection(firestore, "users", user.uid, "workspace-members"),
        orderBy("addedAt", "desc")
      ));
      setMembers(snap.docs.map(d => ({ uid: d.id, ...d.data() as WorkspaceMember })));
    } catch {}
    setLoadingMembers(false);
  };

  useEffect(() => {
    if (open) loadMembers();
  }, [open]);

  const handleInvite = async () => {
    if (!firestore || !user || !email.trim()) return;
    setSending(true);

    try {
      const inviteId = `invite_${user.uid}_${email.toLowerCase().trim()}`.replace(/[^a-z0-9_@.]/gi, "_");
      const inviteRef = doc(firestore, "invites", inviteId);

      await setDoc(inviteRef, {
        ownerUid: user.uid,
        ownerEmail: user.email || "",
        ownerName: user.displayName || "Workspace Owner",
        invitedEmail: email.toLowerCase().trim(),
        role,
        status: "pending",
        invitedAt: Date.now(),
      });

      toast({
        title: "Invitation Sent",
        description: `${email} has been invited as ${role}. They'll receive an email.`,
      });
      setEmail("");
    } catch {
      toast({
        variant: "destructive",
        title: "Invite Failed",
        description: "Could not send invitation. Try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleRemoveMember = async (memberUid: string) => {
    if (!firestore || !user) return;

    try {
      await deleteDoc(doc(firestore, "users", user.uid, "workspace-members", memberUid));
      setMembers(prev => prev.filter(m => m.uid !== memberUid));
      toast({ title: "Member Removed", description: "Access revoked." });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not remove member.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
            <Users className="h-4 w-4" />
            Share Workspace
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest">
            Invite people to collaborate on your documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Role
              </Label>
              <Select value={role} onValueChange={(v: WorkspaceRole) => setRole(v)}>
                <SelectTrigger className="w-28 rounded-none h-10 text-xs font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor" className="text-xs font-bold">Editor</SelectItem>
                  <SelectItem value="viewer" className="text-xs font-bold">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleInvite}
              disabled={sending || !email.trim()}
              className="rounded-none h-10 px-4 bg-black hover:opacity-90 text-white dark:bg-white dark:text-black font-black text-[10px] uppercase tracking-widest"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              {sending ? "..." : "Invite"}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Workspace Members ({members.length})
          </h4>

          {loadingMembers ? (
            <p className="text-xs text-muted-foreground animate-pulse">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-xs text-muted-foreground font-medium">
              No members yet. Invite someone to collaborate.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.uid}
                  className="flex items-center justify-between p-2 bg-muted/30 border border-border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                        {member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{member.displayName || member.email}</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary">
                      {member.role}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveMember(member.uid)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-none text-[10px] font-black uppercase tracking-widest"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

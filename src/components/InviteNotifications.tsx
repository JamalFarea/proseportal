"use client"

import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/firebase";
import { collection, query, where, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Check, X } from "lucide-react";
import type { Invite } from "@/lib/workspace-sharing";

export function InviteNotifications() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!firestore || !user?.email) return;

    const loadInvites = async () => {
      try {
        const snap = await getDocs(query(
          collection(firestore, "invites"),
          where("invitedEmail", "==", user.email!.toLowerCase().trim()),
          where("status", "==", "pending")
        ));
        setPendingInvites(snap.docs.map(d => ({
          id: d.id,
          ...d.data() as Omit<Invite, "id">
        })));
      } catch {}
    };

    loadInvites();
  }, [firestore, user]);

  const handleAccept = async (invite: Invite) => {
    if (!firestore || !user) return;
    setLoading(true);

    try {
      await updateDoc(doc(firestore, "invites", invite.id), {
        status: "accepted",
      });

      await setDoc(doc(firestore, "users", invite.ownerUid, "workspace-members", user.uid), {
        role: invite.role,
        email: user.email,
        displayName: user.displayName || "User",
        addedAt: Date.now(),
      });

      await setDoc(doc(firestore, "users", user.uid, "shared-workspaces", invite.ownerUid), {
        role: invite.role,
        ownerEmail: invite.ownerEmail,
        ownerName: invite.ownerName,
        addedAt: Date.now(),
      });

      setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
      toast({
        title: "Invitation Accepted",
        description: `You now have ${invite.role} access to ${invite.ownerName}'s workspace.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not accept invitation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (invite: Invite) => {
    if (!firestore) return;

    try {
      await updateDoc(doc(firestore, "invites", invite.id), {
        status: "declined",
      });
      setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
    } catch {}
  };

  if (pendingInvites.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {pendingInvites.map(invite => (
        <div
          key={invite.id}
          className="bg-popover border border-border shadow-lg p-4 rounded-none flex items-start gap-3"
        >
          <div className="bg-primary/10 p-2 rounded-full">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold">
              Workspace Invitation
            </p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              {invite.ownerName} invited you as <span className="font-black uppercase">{invite.role}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => handleAccept(invite)}
                disabled={loading}
                className="rounded-none h-7 text-[10px] font-black uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black px-3"
              >
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDecline(invite)}
                disabled={loading}
                className="rounded-none h-7 text-[10px] font-black uppercase tracking-widest px-3"
              >
                <X className="h-3 w-3 mr-1" />
                Decline
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

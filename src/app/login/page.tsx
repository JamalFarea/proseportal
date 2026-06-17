"use client"

import { useState, useEffect } from "react";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Layout, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const createUserProfile = async (uid: string, email: string, displayName?: string | null, photoURL?: string | null) => {
    if (!firestore) return;
    const profileRef = doc(firestore, "users", uid);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) {
      await setDoc(profileRef, {
        email: email.toLowerCase().trim(),
        displayName: displayName || email.split("@")[0],
        photoURL: photoURL || "",
        createdAt: Date.now(),
      });
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user.uid, result.user.email || "", result.user.displayName, result.user.photoURL);
    } catch (error: any) {
      setAuthError(error.code);
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setAuthError(null);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(result.user.uid, email);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user.email) {
          await createUserProfile(result.user.uid, result.user.email, result.user.displayName, result.user.photoURL);
        }
      }
    } catch (error: any) {
      setAuthError(error.code);
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-body">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-2 rounded-none mb-4">
            <Layout className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">ProsePortal</h1>
        </div>
        
        {authError === 'auth/unauthorized-domain' && (
          <Alert variant="destructive" className="rounded-none border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-[10px] font-black uppercase tracking-widest">Unauthorized Domain</AlertTitle>
            <AlertDescription className="text-[10px] font-bold mt-2 leading-relaxed">
              This domain is not authorized in Firebase. Add this domain to your "Authorized Domains" in the Firebase Console:
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 font-mono lowercase break-all select-all">
                {typeof window !== 'undefined' ? window.location.hostname : ''}
              </div>
              <Button variant="link" asChild className="p-0 h-auto text-[10px] font-black uppercase tracking-widest mt-2 text-destructive">
                <a href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-2255477767-8263b'}/authentication/providers`} target="_blank" rel="noopener noreferrer">
                  Go to Console <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="w-full border border-border shadow-2xl rounded-none p-2 bg-card">
          <CardHeader className="space-y-1 flex flex-col items-center pb-8 pt-6">
            <CardTitle className="text-xl font-black tracking-tighter uppercase">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Access your personal workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Button 
              variant="outline" 
              className="w-full rounded-none h-12 font-black border border-border hover:bg-primary hover:text-primary-foreground transition-all uppercase text-[10px] tracking-[0.2em]" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
                <span className="bg-card px-4 text-muted-foreground">
                  Or use email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest opacity-70">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className="rounded-none border-border h-12 focus-visible:ring-primary font-medium bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest opacity-70">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="rounded-none border-border h-12 focus-visible:ring-primary font-medium bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full rounded-none h-12 bg-primary text-primary-foreground hover:opacity-90 font-black uppercase text-[10px] tracking-[0.2em] mt-2 transition-transform active:scale-[0.98]" type="submit" disabled={loading}>
                {loading ? "PROCESSING..." : (isSignUp ? "Create Account" : "Access Workspace")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-6">
            <Button 
              variant="link" 
              className="w-full text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-primary transition-colors" 
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Back to Sign In" : "New? Create an account"}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <ShieldCheck className="h-3 w-3" />
          Secure Enterprise Authentication
        </div>
      </div>
    </div>
  );
}

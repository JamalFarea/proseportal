
"use client"

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Layout, LogOut, User, Eye } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBranding } from "./BrandingProvider";

export function Header() {
  const { user } = useUser();
  const auth = useAuth();
  const { settings } = useBranding();

  const handleLogout = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 flex h-14 sm:h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 font-extrabold text-lg sm:text-xl tracking-tighter hover:opacity-90 transition-opacity">
          <div className="bg-primary p-1.5 rounded-xl flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground select-none">
            {settings.brandLogo ? (
              <span className="text-xs sm:text-sm leading-none font-bold">{settings.brandLogo}</span>
            ) : (
              <Layout className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </div>
          <span className="hidden sm:inline">{settings.brandName || "ProsePortal"}</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user.displayName || "Workspace"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings">
                    <User className="mr-2 h-4 w-4" />
                    <span>Workspace Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2.5 py-1">
                <Eye className="h-3 w-3" />
                Guest
              </div>
              <Button asChild size="sm" className="font-semibold h-9 rounded-xl px-5">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

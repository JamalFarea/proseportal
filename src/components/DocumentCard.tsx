
"use client"

import { Document, Folder } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar, FileText, FolderInput, AlignLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { isRTL } from "@/lib/markdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  doc: Document;
  onDelete?: (id: string) => void;
  folders?: Folder[];
  onMove?: (docId: string, folderId: string) => void;
  isGuest?: boolean;
}

export function DocumentCard({ doc, onDelete, folders, onMove, isGuest }: DocumentCardProps) {
  const rtl = isRTL(doc.title);
  
  return (
    <Card className="group transition-all hover:border-black rounded-none shadow-none border-border flex flex-col h-full bg-white dark:bg-card">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between">
          <div className="bg-muted p-2">
            <FileText className="h-4 w-4 text-black dark:text-white" />
          </div>
          {!isGuest && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {folders && onMove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                      <FolderInput className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs uppercase tracking-widest font-bold">Move to Folder</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onMove(doc.id, "")} className="text-xs font-medium">
                      None (Root)
                    </DropdownMenuItem>
                    {folders.map(f => (
                      <DropdownMenuItem key={f.id} onClick={() => onMove(doc.id, f.id)} className="text-xs font-medium">
                        {f.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(doc.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        <CardTitle 
          className={cn("text-base mt-4 font-black tracking-tight uppercase line-clamp-1", rtl ? "text-right" : "text-left")}
          dir={rtl ? "rtl" : "ltr"}
        >
          {doc.title || "Untitled"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-5 flex-grow space-y-2">
        {doc.summary && (
          <div className="bg-primary/5 p-2 border-l-2 border-primary mb-2">
            <div className="flex items-center gap-1.5 mb-1 text-[8px] font-black uppercase tracking-widest text-primary opacity-60">
              <AlignLeft className="h-2 w-2" />
              AI Summary
            </div>
            <p className="text-[10px] font-bold leading-relaxed text-foreground/80 italic">
              {doc.summary}
            </p>
          </div>
        )}
        <p 
          className={cn("text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium", rtl ? "text-right" : "text-left")}
          dir={rtl ? "rtl" : "ltr"}
        >
          {doc.content || "Empty content..."}
        </p>
      </CardContent>
      <CardFooter className="pt-3 px-5 pb-5 flex items-center justify-between border-t border-border mt-auto">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          <Calendar className="h-3 w-3" />
          {formatDistanceToNow(doc.updatedAt, { addSuffix: true })}
        </div>
        <Button asChild size="sm" variant="outline" className="h-8 rounded-none border-border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all px-4 font-bold uppercase text-[10px] tracking-widest">
          <Link href={`/editor/${doc.id}`}>
            {isGuest ? "View" : "Edit"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

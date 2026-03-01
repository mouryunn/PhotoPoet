"use client";

import { Feather } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <Feather className="w-6 h-6 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-foreground">PhotoPoet</h1>
      </div>
    </header>
  );
}

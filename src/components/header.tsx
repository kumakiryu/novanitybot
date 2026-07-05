"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useSession } from "next-auth/react";

interface HeaderProps {
  title: string;
  sub?: string;
}

export function Header({ title, sub }: HeaderProps) {
  const { data: session } = useSession();
  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-sm flex items-center px-5 gap-4 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <h1 className="font-semibold text-sm text-white">{title}</h1>
        {sub && <p className="text-xs text-zinc-600 hidden sm:block">{sub}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-1.5">
          <Search size={12} className="text-zinc-600" />
          <span className="text-xs text-zinc-600">Quick search...</span>
          <kbd className="text-[10px] text-zinc-700 bg-zinc-800 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>

        <button className="relative w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-fuchsia-500 rounded-full" />
        </button>

        {session?.user?.image ? (
          <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold text-xs">
            {session?.user?.name?.[0] ?? "A"}
          </div>
        )}
      </div>
    </header>
  );
}

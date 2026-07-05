"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Code2, MessageSquare, ShieldCheck,
  Briefcase, Ticket, Settings, LogOut, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",           label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard/embed",     label: "Embed Builder",icon: Code2           },
  { href: "/dashboard/compose",   label: "Messages",     icon: MessageSquare   },
  { href: "/dashboard/verify",    label: "Verification", icon: ShieldCheck     },
  { href: "/dashboard/portfolio", label: "Portfolio",    icon: Briefcase       },
  { href: "/dashboard/tickets",   label: "Tickets",      icon: Ticket          },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#0c0c0e] border-r border-white/[0.04] flex flex-col z-40">
      {/* Logo */}
      <div className="p-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-fuchsia-500/25">
            NV
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-none">No Vanity</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 py-2">Main</p>
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-fuchsia-500/15 text-fuchsia-400 font-medium"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <item.icon size={15} />
              {item.label}
              {active && <ChevronRight size={12} className="ml-auto text-fuchsia-400" />}
            </Link>
          );
        })}

        <div className="pt-2 mt-2 border-t border-white/[0.04]">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 py-2">System</p>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-fuchsia-500/15 text-fuchsia-400 font-medium"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Settings size={15} />
            Settings
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 px-2 py-2">
          {session?.user?.image ? (
            <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold text-sm">
              {session?.user?.name?.[0] ?? "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{session?.user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-zinc-600">Administrator</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

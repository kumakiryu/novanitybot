"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Users, CheckCircle2, Server, Activity, TrendingUp, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/utils";
import type { VerificationEvent, PortfolioProject } from "@/types";
import Link from "next/link";

const WEEK_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function DashboardPage() {
  const [events,   setEvents]   = useState<VerificationEvent[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: ev }, { data: proj }] = await Promise.all([
        supabase.from("verification_events").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("portfolio_projects").select("*").limit(3),
      ]);
      setEvents(ev ?? []);
      setProjects(proj ?? []);
      setLoading(false);
    }
    load();
  }, []);

  // Build chart data from events
  const chartData = WEEK_DAYS.map(day => ({
    day,
    count: events.filter(e => {
      const d = new Date(e.created_at);
      return d.toLocaleDateString("en-US", { weekday: "short" }) === day && e.event_type === "verified";
    }).length,
  }));

  const totalVerified = events.filter(e => e.event_type === "verified").length;
  const recentActivity = events.slice(0, 6);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Dashboard" sub="Welcome back, Admin" />
      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Verified", value: String(totalVerified), icon: CheckCircle2, color: "text-fuchsia-400 bg-fuchsia-500/10" },
                { label: "Active Servers",  value: "1",                   icon: Server,       color: "text-purple-400 bg-purple-500/10"  },
                { label: "Verification Events", value: String(events.length), icon: Activity, color: "text-emerald-400 bg-emerald-500/10" },
                { label: "Projects",        value: String(projects.length),icon: LayoutDashboard, color: "text-amber-400 bg-amber-500/10" },
              ].map(s => (
                <div key={s.label} className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-zinc-600 text-xs font-medium uppercase tracking-wider">{s.label}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                      <s.icon size={15} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 bg-[#111113] border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-semibold text-sm text-white mb-1">Verifications This Week</h3>
                <p className="text-xs text-zinc-600 mb-5">{totalVerified} total events tracked</p>
                <ResponsiveContainer width="100%" height={180} key="dash-chart">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dash-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d946ef" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#fafafa" }} itemStyle={{ color: "#d946ef" }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#d946ef" strokeWidth={2} fill="url(#dash-gradient)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Activity */}
              <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-semibold text-sm text-white mb-4">Recent Activity</h3>
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-zinc-600 text-center py-8">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map(a => (
                      <div key={a.id} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.event_type === "verified" ? "bg-fuchsia-400" : a.event_type === "joined" ? "bg-emerald-400" : "bg-red-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white capitalize">{a.event_type}</p>
                          <p className="text-[10px] text-zinc-600">{formatDate(a.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Send Panel",      href: "/dashboard/verify",    color: "fuchsia" },
                { label: "Build Embed",     href: "/dashboard/embed",     color: "purple"  },
                { label: "Send Message",    href: "/dashboard/compose",   color: "blue"    },
                { label: "Add Project",     href: "/dashboard/portfolio", color: "emerald" },
              ].map(a => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="bg-[#111113] border border-white/[0.06] rounded-xl p-4 hover:border-fuchsia-500/20 hover:bg-fuchsia-500/5 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center mb-3 group-hover:bg-fuchsia-500/20 transition-colors">
                    <Plus size={15} className="text-fuchsia-400" />
                  </div>
                  <p className="text-sm font-medium text-white">{a.label}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

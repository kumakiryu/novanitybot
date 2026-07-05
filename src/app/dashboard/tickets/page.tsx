"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import type { Ticket } from "@/types";
import { Plus, MoreHorizontal, X, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = { open: "Open", progress: "In Progress", closed: "Closed" };
const STATUS_STYLES: Record<string, string> = {
  open:     "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  progress: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
  closed:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};
const PRIORITY_STYLES: Record<string, string> = {
  high:   "bg-red-500/10 text-red-400 border border-red-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  low:    "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter,  setFilter]  = useState("all");
  const [adding,  setAdding]  = useState(false);
  const [form, setForm] = useState({ subject: "", username: "", content: "", priority: "medium" });

  const load = () => supabase.from("tickets").select("*").order("created_at", { ascending: false }).then(({ data }) => setTickets(data ?? []));
  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);
  const counts = { all: tickets.length, open: tickets.filter(t => t.status === "open").length, progress: tickets.filter(t => t.status === "progress").length, closed: tickets.filter(t => t.status === "closed").length };

  const addTicket = async () => {
    if (!form.subject.trim()) return;
    await supabase.from("tickets").insert({ ...form, status: "open" });
    setForm({ subject: "", username: "", content: "", priority: "medium" });
    setAdding(false);
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setTickets(t => t.map(x => x.id === id ? { ...x, status: status as any } : x));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Ticket Manager" sub="Track commissions and support requests" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {(["all","open","progress","closed"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-fuchsia-500 text-white" : "bg-zinc-800 text-zinc-500 hover:text-zinc-200 border border-white/[0.06]"}`}>
                  {STATUS_LABELS[f] ?? "All"}
                  <span className={`px-1.5 py-px rounded text-[10px] ${filter === f ? "bg-white/20" : "bg-zinc-700 text-zinc-400"}`}>{counts[f]}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-medium rounded-xl transition-all">
              {adding ? <><X size={14} />Cancel</> : <><Plus size={14} />New Ticket</>}
            </button>
          </div>

          {adding && (
            <div className="bg-[#111113] border border-fuchsia-500/20 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-white">New Ticket</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-zinc-500 block mb-1">Subject *</label><input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50" placeholder="Ticket subject" /></div>
                <div><label className="text-xs text-zinc-500 block mb-1">Username</label><input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50" placeholder="user#0000" /></div>
              </div>
              <div><label className="text-xs text-zinc-500 block mb-1">Details</label><textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} className="w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 resize-none" /></div>
              <div><label className="text-xs text-zinc-500 block mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500/50">
                  {["low","medium","high"].map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <button onClick={addTicket} className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-medium rounded-xl transition-all">
                <Check size={14} />Create Ticket
              </button>
            </div>
          )}

          <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["ID","User","Subject","Priority","Status","Created",""].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-zinc-600 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-xs text-zinc-600 py-12">No tickets found</td></tr>
                ) : filtered.map(t => (
                  <tr key={t.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">TK-{String(t.ticket_num).padStart(3,"0")}</td>
                    <td className="px-4 py-3 text-xs text-white font-medium">{t.username ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-zinc-300 max-w-[200px] truncate">{t.subject}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span></td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_STYLES[t.status]}`}>{STATUS_LABELS[t.status]}</span></td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{formatDate(t.created_at)}</td>
                    <td className="px-4 py-3">
                      <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)} className="bg-zinc-800 border border-white/[0.06] rounded text-xs text-zinc-300 px-2 py-1 focus:outline-none">
                        <option value="open">Open</option>
                        <option value="progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

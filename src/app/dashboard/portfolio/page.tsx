"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import type { PortfolioProject } from "@/types";
import { Plus, Star, Globe, Trash2, Edit2, Check, X } from "lucide-react";

const inputCls = "w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 transition-all";
const CATS = ["All","Web App","Graphics","Open Source","Other"];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter,   setFilter]   = useState("All");
  const [adding,   setAdding]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image_url: "", live_url: "", category: "Web App" });

  const load = () => supabase.from("portfolio_projects").select("*").order("created_at", { ascending: false }).then(({ data }) => setProjects(data ?? []));
  useEffect(() => { load(); }, []);

  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await supabase.from("portfolio_projects").insert(form);
    await load();
    setForm({ title: "", description: "", image_url: "", live_url: "", category: "Web App" });
    setAdding(false);
    setSaving(false);
  };

  const remove = async (id: string) => {
    await supabase.from("portfolio_projects").delete().eq("id", id);
    setProjects(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Portfolio Manager" sub="Showcase your projects" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-5">
          {/* Filter + add */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {CATS.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === c ? "bg-fuchsia-500 text-white" : "bg-zinc-800 text-zinc-500 hover:text-zinc-200 border border-white/[0.06]"}`}>{c}</button>
              ))}
            </div>
            <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-medium rounded-xl transition-all">
              {adding ? <><X size={14} />Cancel</> : <><Plus size={14} />Add Project</>}
            </button>
          </div>

          {/* Add form */}
          {adding && (
            <div className="bg-[#111113] border border-fuchsia-500/20 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-white mb-2">New Project</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-zinc-500 block mb-1">Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Project name" /></div>
                <div><label className="text-xs text-zinc-500 block mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                    {["Web App","Graphics","Open Source","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-zinc-500 block mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-zinc-500 block mb-1">Image URL</label><input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className={inputCls} placeholder="https://..." /></div>
                <div><label className="text-xs text-zinc-500 block mb-1">Live URL</label><input value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} className={inputCls} placeholder="https://..." /></div>
              </div>
              <button onClick={save} disabled={saving || !form.title.trim()} className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-all">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
                Save Project
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden hover:border-fuchsia-500/20 transition-all group">
                <div className="relative h-44 bg-zinc-900 overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 text-[10px] px-2 py-0.5 rounded-md font-medium">{p.category}</span>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => remove(p.id)} className="w-7 h-7 bg-black/60 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20"><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{p.title}</h4>
                      {p.description && <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{p.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
                      <Star size={11} fill="currentColor" /><span className="text-xs font-medium">{p.stars}</span>
                    </div>
                  </div>
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-zinc-500 hover:text-fuchsia-400 transition-colors">
                      <Globe size={11} />View Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-16 text-zinc-600 text-sm">No projects yet. Click &quot;Add Project&quot; to get started.</div>}
        </div>
      </main>
    </div>
  );
}

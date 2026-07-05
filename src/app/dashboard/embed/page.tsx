"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import { hexToInt, intToHex } from "@/lib/utils";
import type { EmbedTemplate } from "@/types";
import { Check, RefreshCw, Sparkles, Copy, Trash2 } from "lucide-react";

const COLOR_PRESETS = ["#d946ef","#a855f7","#6366f1","#3b82f6","#22c55e","#f59e0b","#ef4444","#ffffff"];

function DiscordPreview({ title, description, footer, color, author, thumbnail, imageUrl, btnLabel, btnStyle }: {
  title: string; description: string; footer: string; color: string;
  author: string; thumbnail: string; imageUrl: string;
  btnLabel: string; btnStyle: string;
}) {
  const [clicked, setClicked] = useState(false);
  const btnColors: Record<string, string> = {
    Success: "bg-[#3ba55d] hover:bg-[#2d7d46] text-white",
    Primary: "bg-[#5865f2] hover:bg-[#4752c4] text-white",
    Danger:  "bg-[#ed4245] hover:bg-[#c03537] text-white",
    Secondary:"bg-[#4e5058] text-white",
  };
  return (
    <div className="bg-[#313338] rounded-xl p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">NV</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">NO VANITY</span>
            <span className="bg-[#5865f2] text-white text-[10px] px-1.5 rounded">APP</span>
          </div>
          <div className="rounded border-l-4 bg-[#2b2d31] max-w-sm overflow-hidden" style={{ borderColor: color }}>
            {author && <div className="px-3 pt-2.5 text-[#e0e1e5] text-xs font-medium flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-fuchsia-500" />{author}</div>}
            <div className="px-3 py-3 flex gap-3">
              <div className="flex-1">
                {title && <p className="text-[#e0e1e5] font-semibold text-sm mb-1">{title}</p>}
                {description && <p className="text-[#b5bac1] text-xs leading-relaxed whitespace-pre-line">{description}</p>}
              </div>
              {thumbnail && <img src={thumbnail} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            </div>
            {imageUrl && <img src={imageUrl} alt="" className="w-full max-h-40 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            {footer && <div className="px-3 pb-2.5 text-[#87898c] text-[10px]">{footer} · {new Date().toLocaleDateString()}</div>}
          </div>
          <div className="mt-2">
            <button onClick={() => setClicked(!clicked)} className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${clicked ? "bg-emerald-500/20 text-emerald-400" : (btnColors[btnStyle] ?? btnColors.Success)}`}>
              {clicked ? "✓ Verified!" : btnLabel || "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmbedPage() {
  const [templates, setTemplates] = useState<EmbedTemplate[]>([]);
  const [title,       setTitle]       = useState("NO VANITY");
  const [description, setDescription] = useState("Verification Required. Click Verify to gain access.");
  const [footer,      setFooter]      = useState("NO VANITY Verification System");
  const [color,       setColor]       = useState("#d946ef");
  const [author,      setAuthor]      = useState("");
  const [thumbnail,   setThumbnail]   = useState("");
  const [imageUrl,    setImageUrl]    = useState("");
  const [btnLabel,    setBtnLabel]    = useState("Verify");
  const [btnStyle,    setBtnStyle]    = useState("Success");
  const [tab,         setTab]         = useState<"content"|"style"|"button">("content");
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    supabase.from("embed_templates").select("*").order("created_at").then(({ data }) => setTemplates(data ?? []));
  }, []);

  const loadTemplate = (t: EmbedTemplate) => {
    setTitle(t.title ?? "");
    setDescription(t.description ?? "");
    setFooter(t.footer ?? "");
    setColor(intToHex(t.color));
    setAuthor(t.author ?? "");
    setThumbnail(t.thumbnail ?? "");
    setImageUrl(t.image_url ?? "");
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    await supabase.from("embed_templates").insert({
      name: templateName, title, description, footer,
      color: hexToInt(color), author, thumbnail, image_url: imageUrl,
    });
    const { data } = await supabase.from("embed_templates").select("*").order("created_at");
    setTemplates(data ?? []);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteTemplate = async (id: string) => {
    await supabase.from("embed_templates").delete().eq("id", id);
    setTemplates(t => t.filter(x => x.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Embed Builder" sub="Design and preview Discord embeds" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          {/* Editor */}
          <div className="space-y-5">
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="flex border-b border-white/[0.06] px-5 pt-4 gap-1">
                {(["content","style","button"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-medium rounded-t capitalize transition-colors ${tab === t ? "text-fuchsia-400 bg-fuchsia-500/10 border-b-2 border-fuchsia-500" : "text-zinc-600 hover:text-zinc-300"}`}>
                    {t === "content" ? "Content" : t === "style" ? "Style" : "Button"}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {tab === "content" && (
                  <>
                    <Field label="Title"><input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="Embed title" /></Field>
                    <Field label="Description"><textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className={`${inputCls} resize-none`} placeholder="Embed description..." /></Field>
                    <Field label="Author Name"><input value={author} onChange={e => setAuthor(e.target.value)} className={inputCls} placeholder="Optional author" /></Field>
                    <Field label="Footer"><input value={footer} onChange={e => setFooter(e.target.value)} className={inputCls} placeholder="Footer text" /></Field>
                  </>
                )}
                {tab === "style" && (
                  <>
                    <Field label="Color">
                      <div className="flex items-center gap-2 flex-wrap">
                        {COLOR_PRESETS.map(c => (
                          <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-lg border-2 transition-all" style={{ backgroundColor: c, borderColor: color === c ? "#fff" : "transparent", transform: color === c ? "scale(1.1)" : "scale(1)" }} />
                        ))}
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border border-white/10 bg-transparent" />
                        <span className="text-xs font-mono text-zinc-500">{color.toUpperCase()}</span>
                      </div>
                    </Field>
                    <Field label="Thumbnail URL"><input value={thumbnail} onChange={e => setThumbnail(e.target.value)} className={inputCls} placeholder="https://..." /></Field>
                    <Field label="Image URL"><input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={inputCls} placeholder="https://..." /></Field>
                  </>
                )}
                {tab === "button" && (
                  <>
                    <Field label="Button Label"><input value={btnLabel} onChange={e => setBtnLabel(e.target.value)} className={inputCls} placeholder="Verify" /></Field>
                    <Field label="Button Style">
                      <div className="grid grid-cols-2 gap-2">
                        {["Success","Primary","Danger","Secondary"].map(s => (
                          <button key={s} onClick={() => setBtnStyle(s)} className={`py-2 rounded-lg text-xs font-medium border transition-all ${btnStyle === s ? "border-fuchsia-500/60 bg-fuchsia-500/10 text-fuchsia-400" : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"}`}>{s}</button>
                        ))}
                      </div>
                    </Field>
                  </>
                )}
              </div>

              {/* Save template */}
              <div className="px-5 pb-5 flex gap-2">
                <input value={templateName} onChange={e => setTemplateName(e.target.value)} className={`${inputCls} flex-1`} placeholder="Template name..." />
                <button onClick={saveTemplate} disabled={saving || !templateName.trim()} className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-all">
                  {saved ? <><Check size={14} />Saved!</> : <><Sparkles size={14} />Save</>}
                </button>
              </div>
            </div>

            {/* Template library */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
              <h3 className="font-semibold text-sm text-white mb-3">Template Library</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {templates.map(t => (
                  <div key={t.id} className="relative group p-3 rounded-lg border border-white/[0.06] hover:border-fuchsia-500/30 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all" onClick={() => loadTemplate(t)}>
                    <div className="w-full h-1.5 rounded-full mb-2" style={{ backgroundColor: intToHex(t.color) }} />
                    <p className="text-xs font-medium text-white truncate">{t.name}</p>
                    <p className="text-[10px] text-zinc-600 truncate">{t.title}</p>
                    <button onClick={e => { e.stopPropagation(); deleteTemplate(t.id); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-medium text-white">Live Preview</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-zinc-600">Real-time</span>
                </div>
              </div>
              <div className="p-4">
                <DiscordPreview title={title} description={description} footer={footer} color={color} author={author} thumbnail={thumbnail} imageUrl={imageUrl} btnLabel={btnLabel} btnStyle={btnStyle} />
              </div>
            </div>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify({ title, description, footer, color: hexToInt(color), author, thumbnail, image_url: imageUrl, button_label: btnLabel, button_style: btnStyle }, null, 2))} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/[0.06] text-zinc-300 text-sm font-medium rounded-lg transition-all">
              <Copy size={13} />Copy JSON
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">{label}</label>{children}</div>;
}

const inputCls = "w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all";

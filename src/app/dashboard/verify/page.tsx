"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";
import { hexToInt, intToHex } from "@/lib/utils";
import type { VerificationConfig } from "@/types";
import { CheckCircle2, AlertCircle, Send, Zap, Check } from "lucide-react";

const inputCls = "w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 font-mono transition-all";

const DEFAULT_GUILD = "default";

export default function VerifyPage() {
  const [config,    setConfig]    = useState<Partial<VerificationConfig>>({
    verified_role_id: "", webhook_url: "",
    embed_title: "NO VANITY", embed_description: "Verification Required. Click Verify to gain access.",
    embed_color: 0xd946ef, embed_footer: "NO VANITY Verification System",
    button_label: "Verify", button_style: "Success",
    success_message: "🎉 You have been successfully verified!",
    log_verified: true, log_joined: true, log_left: false, log_errors: true,
  });
  const [saved,      setSaved]      = useState(false);
  const [panelCh,    setPanelCh]    = useState("");
  const [panelSent,  setPanelSent]  = useState(false);
  const [panelError, setPanelError] = useState("");
  const [panelLoading, setPanelLoading] = useState(false);

  useEffect(() => {
    supabase.from("verification_configs").select("*").eq("guild_id", DEFAULT_GUILD).single()
      .then(({ data }) => { if (data) setConfig(data); });
  }, []);

  const save = async () => {
    await supabase.from("verification_configs").upsert({ ...config, guild_id: DEFAULT_GUILD, updated_at: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sendPanel = async () => {
    if (!panelCh.trim()) return;
    setPanelLoading(true);
    setPanelError("");
    try {
      const res = await fetch("/api/bot/panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: panelCh.trim(), config }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
      setPanelSent(true);
      setTimeout(() => setPanelSent(false), 3000);
    } catch (e: unknown) {
      setPanelError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setPanelLoading(false);
    }
  };

  const Toggle = ({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!val)} className={`w-9 h-5 rounded-full relative transition-colors ${val ? "bg-fuchsia-500" : "bg-zinc-700"}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${val ? "left-4" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Verification Manager" sub="Configure role assignment and logging" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-5">
            {/* Role */}
            <Section title="Verification Role" sub="The role assigned when a member verifies. Get the ID from: Server Settings → Roles → right-click → Copy Role ID.">
              <input value={config.verified_role_id ?? ""} onChange={e => setConfig(c => ({ ...c, verified_role_id: e.target.value }))} className={inputCls} placeholder="e.g. 987654321098765432" />
              {config.verified_role_id && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mt-2">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-mono">Role ID: {config.verified_role_id}</span>
                </div>
              )}
            </Section>

            {/* Embed */}
            <Section title="Embed Content" sub="Customize the verification embed sent by /setupverify.">
              <div className="space-y-3">
                <F label="Title"><input value={config.embed_title ?? ""} onChange={e => setConfig(c => ({ ...c, embed_title: e.target.value }))} className={inputCls} /></F>
                <F label="Description"><textarea value={config.embed_description ?? ""} onChange={e => setConfig(c => ({ ...c, embed_description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} /></F>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Footer"><input value={config.embed_footer ?? ""} onChange={e => setConfig(c => ({ ...c, embed_footer: e.target.value }))} className={inputCls} /></F>
                  <F label="Color">
                    <div className="flex items-center gap-2">
                      <input type="color" value={intToHex(config.embed_color ?? 0xd946ef)} onChange={e => setConfig(c => ({ ...c, embed_color: hexToInt(e.target.value) }))} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent" />
                      <span className="text-xs font-mono text-zinc-500">{intToHex(config.embed_color ?? 0xd946ef)}</span>
                    </div>
                  </F>
                </div>
              </div>
            </Section>

            {/* Button */}
            <Section title="Verify Button" sub="Label and style of the button on the verification panel.">
              <div className="grid grid-cols-2 gap-3">
                <F label="Label"><input value={config.button_label ?? ""} onChange={e => setConfig(c => ({ ...c, button_label: e.target.value }))} className={inputCls} /></F>
                <F label="Style">
                  <select value={config.button_style ?? "Success"} onChange={e => setConfig(c => ({ ...c, button_style: e.target.value as any }))} className={inputCls}>
                    {["Success","Primary","Danger","Secondary"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </F>
              </div>
              <F label="Success Message"><input value={config.success_message ?? ""} onChange={e => setConfig(c => ({ ...c, success_message: e.target.value }))} className={`${inputCls} mt-3`} /></F>
            </Section>

            {/* Webhook */}
            <Section title="Webhook Logging" sub="Log verification events to a Discord webhook.">
              <input value={config.webhook_url ?? ""} onChange={e => setConfig(c => ({ ...c, webhook_url: e.target.value }))} className={inputCls} placeholder="https://discord.com/api/webhooks/..." />
              <div className="mt-3 space-y-2.5">
                {[
                  { label: "Member Verified", key: "log_verified" as const },
                  { label: "Member Joined",   key: "log_joined"   as const },
                  { label: "Member Left",     key: "log_left"     as const },
                  { label: "Bot Errors",      key: "log_errors"   as const },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-sm text-zinc-300">{label}</span>
                    <Toggle val={!!config[key]} onChange={v => setConfig(c => ({ ...c, [key]: v }))} />
                  </div>
                ))}
              </div>
            </Section>

            <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]">
              {saved ? <><Check size={15} />Saved!</> : <><Zap size={15} />Save Configuration</>}
            </button>
          </div>

          {/* Send panel + requirements */}
          <div className="space-y-4">
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-1">Send Verification Panel</h4>
              <p className="text-xs text-zinc-600 mb-3">Send the embed + verify button to a channel.</p>
              <input value={panelCh} onChange={e => setPanelCh(e.target.value)} className={`${inputCls} mb-2`} placeholder="Channel ID" />
              {panelError && <p className="text-xs text-red-400 mb-2">{panelError}</p>}
              <button onClick={sendPanel} disabled={panelLoading || !panelCh.trim()} className="w-full flex items-center justify-center gap-2 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all">
                {panelLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : panelSent ? <><Check size={14} />Sent!</> : <><Send size={14} />Send Panel</>}
              </button>
            </div>

            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
              <h4 className="text-xs font-medium text-white mb-3">Requirements</h4>
              {[
                { label: "Role ID configured",   ok: !!config.verified_role_id },
                { label: "Embed title set",       ok: !!config.embed_title      },
                { label: "Webhook configured",    ok: !!config.webhook_url      },
                { label: "Bot token in .env",     ok: true                       },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2 py-1.5">
                  {r.ok ? <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" /> : <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />}
                  <span className={`text-xs ${r.ok ? "text-zinc-300" : "text-zinc-500"}`}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
      <h3 className="font-semibold text-sm text-white mb-0.5">{title}</h3>
      <p className="text-xs text-zinc-600 mb-4">{sub}</p>
      {children}
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">{label}</label>{children}</div>;
}

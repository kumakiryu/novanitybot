"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Bot, Database, Shield, Zap, Eye, EyeOff, Copy, Check, AlertCircle } from "lucide-react";

const inputCls = "w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 font-mono transition-all";

const TABS = [
  { key: "bot",      label: "Bot Config",    icon: Bot      },
  { key: "supabase", label: "Supabase",      icon: Database },
  { key: "discord",  label: "Discord OAuth", icon: Shield   },
  { key: "railway",  label: "Railway",       icon: Zap      },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function SettingsPage() {
  const [tab,      setTab]      = useState<TabKey>("bot");
  const [showTok,  setShowTok]  = useState(false);
  const [copied,   setCopied]   = useState("");
  const [saved,    setSaved]    = useState(false);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ENV_VARS = [
    { key: "DISCORD_TOKEN",              desc: "Bot → Reset Token in Dev Portal"    },
    { key: "DISCORD_CLIENT_ID",          desc: "General Information → Application ID" },
    { key: "DISCORD_CLIENT_SECRET",      desc: "OAuth2 → Client Secret"             },
    { key: "NEXT_PUBLIC_SUPABASE_URL",   desc: "Project → Settings → API → Project URL" },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Project → Settings → API → anon key" },
    { key: "SUPABASE_SERVICE_ROLE_KEY",  desc: "Project → Settings → API → service_role key" },
    { key: "NEXTAUTH_SECRET",            desc: "Generate: openssl rand -base64 32"  },
    { key: "NEXTAUTH_URL",               desc: "Your Railway app URL"               },
    { key: "ADMIN_DISCORD_IDS",          desc: "Your Discord user ID (comma-separated)" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Settings" sub="Configure bot, database, and deployment" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 xl:grid-cols-[180px_1fr] gap-6">
          {/* Tab nav */}
          <div className="flex xl:flex-col gap-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${tab === t.key ? "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"}`}>
                <t.icon size={14} />
                <span className="hidden xl:block">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-5">
            {tab === "bot" && (
              <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-6 space-y-5">
                <div><h3 className="font-semibold text-white">Bot Configuration</h3><p className="text-xs text-zinc-600 mt-0.5">Discord bot credentials from the Developer Portal.</p></div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-500">Bot Token</label>
                  <div className="flex gap-2">
                    <input type={showTok ? "text" : "password"} defaultValue="your_bot_token" className={`${inputCls} flex-1`} />
                    <button onClick={() => setShowTok(!showTok)} className="px-3 py-2 bg-zinc-800 border border-white/[0.06] rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors">{showTok ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-500">Client ID (Application ID)</label>
                  <input defaultValue="" className={inputCls} placeholder="From: General Information → Application ID" />
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2">
                  <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">Never share your bot token. Rotate it immediately in the Dev Portal if exposed.</p>
                </div>
              </div>
            )}

            {tab === "supabase" && (
              <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-6 space-y-5">
                <div><h3 className="font-semibold text-white">Supabase Configuration</h3><p className="text-xs text-zinc-600 mt-0.5">Connect your Supabase project. Find these at: app.supabase.com → Project → Settings → API.</p></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">Project URL</label><input defaultValue="" className={inputCls} placeholder="https://xxxx.supabase.co" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">Anon / Public Key</label><input defaultValue="" className={inputCls} placeholder="eyJhbGci..." /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">Service Role Key</label><input type="password" defaultValue="" className={inputCls} placeholder="eyJhbGci..." /></div>
                <div className="bg-zinc-900 rounded-xl p-4">
                  <p className="text-xs font-medium text-zinc-400 mb-3">Database Tables</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["users","servers","verification_configs","embed_templates","portfolio_projects","tickets"].map(t => (
                      <div key={t} className="flex items-center gap-2 p-2 rounded bg-zinc-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        <span className="font-mono text-xs text-zinc-500">{t}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600 mt-3">Run <code className="text-fuchsia-400">supabase/schema.sql</code> in Supabase SQL Editor to create all tables.</p>
                </div>
              </div>
            )}

            {tab === "discord" && (
              <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-6 space-y-5">
                <div><h3 className="font-semibold text-white">Discord OAuth2</h3><p className="text-xs text-zinc-600 mt-0.5">For admin login via Discord. Set up at: discord.com/developers/applications → OAuth2.</p></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">Client ID</label><input defaultValue="" className={inputCls} placeholder="Application ID" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">Client Secret</label><input type="password" defaultValue="" className={inputCls} placeholder="••••••••••••••••" /></div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-500">Redirect URI — add this to Discord</label>
                  <div className="flex gap-2">
                    <input readOnly value="https://your-app.railway.app/api/auth/callback/discord" className={`${inputCls} flex-1 text-zinc-500`} />
                    <button onClick={() => copy("https://your-app.railway.app/api/auth/callback/discord", "redirect")} className="px-3 py-2 bg-zinc-800 border border-white/[0.06] rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors">
                      {copied === "redirect" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-zinc-500">Admin Discord IDs</label><input defaultValue="" className={inputCls} placeholder="123456789,987654321" /><p className="text-xs text-zinc-600">Comma-separated Discord user IDs allowed to access the panel.</p></div>
              </div>
            )}

            {tab === "railway" && (
              <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-6 space-y-5">
                <div><h3 className="font-semibold text-white">Railway Deployment</h3><p className="text-xs text-zinc-600 mt-0.5">Add these environment variables in: Railway → Project → Variables.</p></div>
                <div className="space-y-2">
                  {ENV_VARS.map(v => (
                    <div key={v.key} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-white/[0.04]">
                      <div className="w-2 h-2 rounded-full bg-zinc-700 flex-shrink-0" />
                      <span className="font-mono text-xs text-white flex-1">{v.key}</span>
                      <span className="text-xs text-zinc-600 hidden sm:block text-right max-w-[200px] truncate">{v.desc}</span>
                      <button onClick={() => copy(v.key, v.key)} className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0">
                        {copied === v.key ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                  <p className="text-xs text-fuchsia-300 font-medium mb-1">Deploy to Railway</p>
                  <p className="text-xs text-fuchsia-300/70">Push webapp/ to GitHub → Railway → New Project → Deploy from GitHub → select the repo → set variables above → Railway will auto-build and deploy.</p>
                </div>
              </div>
            )}

            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-400 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]">
              {saved ? <><Check size={15} />Saved!</> : <><Zap size={15} />Save Changes</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

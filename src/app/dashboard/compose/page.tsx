"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Send, FileText, Clock, Check } from "lucide-react";

const inputCls = "w-full bg-zinc-900 border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 transition-all";

export default function ComposePage() {
  const [channelId,  setChannelId]  = useState("");
  const [msgType,    setMsgType]    = useState<"text"|"embed">("text");
  const [content,    setContent]    = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedColor, setEmbedColor] = useState("#d946ef");
  const [scheduled,  setScheduled]  = useState(false);
  const [schedDate,  setSchedDate]  = useState("");
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const [error,      setError]      = useState("");

  const handleSend = async () => {
    if (!channelId.trim() || !content.trim()) return;
    setSending(true);
    setError("");
    try {
      const payload: Record<string, unknown> =
        msgType === "text"
          ? { content }
          : { embeds: [{ title: embedTitle, description: content, color: parseInt(embedColor.replace("#",""),16), timestamp: new Date().toISOString() }] };

      const res = await fetch("/api/bot/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: channelId.trim(), payload }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to send");
      }

      setSent(true);
      setContent("");
      setTimeout(() => setSent(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Message Composer" sub="Send messages as your bot" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Destination */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
            <h3 className="font-semibold text-sm text-white mb-4">Destination</h3>
            <label className="text-xs font-medium text-zinc-500 block mb-1.5">Channel ID</label>
            <input value={channelId} onChange={e => setChannelId(e.target.value)} className={inputCls} placeholder="Right-click channel → Copy Channel ID" />
            <p className="text-xs text-zinc-600 mt-1.5">Enable Developer Mode in Discord to copy channel IDs.</p>
          </div>

          {/* Message */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-white">Message</h3>
              <div className="flex gap-1 bg-zinc-900 rounded-lg p-1">
                {(["text","embed"] as const).map(t => (
                  <button key={t} onClick={() => setMsgType(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${msgType === t ? "bg-fuchsia-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                    {t === "text" ? "Plain Text" : "Rich Embed"}
                  </button>
                ))}
              </div>
            </div>

            {msgType === "embed" && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="text-xs font-medium text-zinc-500 block mb-1.5">Embed Title</label><input value={embedTitle} onChange={e => setEmbedTitle(e.target.value)} className={inputCls} placeholder="Title" /></div>
                <div><label className="text-xs font-medium text-zinc-500 block mb-1.5">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={embedColor} onChange={e => setEmbedColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent" />
                    <span className="text-xs font-mono text-zinc-500">{embedColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

            <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} className={`${inputCls} resize-none`} placeholder={msgType === "text" ? "Write your message..." : "Enter embed description..."} />
          </div>

          {/* Schedule */}
          <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-zinc-600" />
                <div>
                  <p className="text-sm font-medium text-white">Schedule Message</p>
                  <p className="text-xs text-zinc-600">Send at a specific time</p>
                </div>
              </div>
              <button onClick={() => setScheduled(!scheduled)} className={`w-10 h-5 rounded-full relative transition-colors ${scheduled ? "bg-fuchsia-500" : "bg-zinc-700"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${scheduled ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            {scheduled && (
              <input type="datetime-local" value={schedDate} onChange={e => setSchedDate(e.target.value)} className={`${inputCls} mt-3`} />
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{error}</div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSend} disabled={sending || !channelId.trim() || !content.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]">
              {sending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : sent ? <Check size={15} /> : <Send size={15} />}
              {sending ? "Sending..." : sent ? "Sent!" : "Send Now"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/[0.06] text-zinc-300 text-sm font-medium rounded-xl transition-all">
              <FileText size={14} />Save Draft
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("discord", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-fuchsia-500 mb-4 shadow-lg shadow-fuchsia-500/30">
            <span className="text-white font-bold text-xl">NV</span>
          </div>
          <h1 className="text-2xl font-bold text-white">No Vanity</h1>
          <p className="text-zinc-500 text-sm mt-1">Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
          <p className="text-zinc-500 text-sm mb-6">Access is restricted to authorized administrators only.</p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#5865f2] hover:bg-[#4752c4] text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="white">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
            )}
            {loading ? "Connecting..." : "Continue with Discord"}
          </button>

          <p className="text-zinc-600 text-xs text-center mt-4">
            Only users in the admin allowlist can sign in.
          </p>
        </div>

        <p className="text-zinc-700 text-xs text-center mt-4">
          No Vanity Control Panel · Secure Admin Access
        </p>
      </div>
    </div>
  );
}

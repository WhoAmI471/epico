"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { RequireAuth } from "../../shared/auth/RequireAuth";
import { RequireOnboarding } from "../../shared/auth/RequireOnboarding";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState(session?.user?.name || "");
  const [saved, setSaved] = useState(false);

  const user = session?.user;
  const initials = (() => {
    const raw = String(displayName || user?.name || "U").trim();
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return raw.slice(0, 2).toUpperCase() || "U";
  })();

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <RequireAuth>
      <RequireOnboarding>
        <div className="min-h-screen bg-[#131618] text-zinc-50">
          {/* Desktop centering */}
          <div className="mx-auto w-full max-w-lg lg:border-x lg:border-white/[0.06] min-h-screen flex flex-col">

            {/* Header */}
            <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] sticky top-0 bg-[#131618] z-10">
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-zinc-400"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="flex items-center gap-2 flex-1">
                <Image src="/group-17.svg" alt="Epico" width={28} height={24} className="h-6 w-auto" />
                <span className="text-[15px] font-semibold tracking-tight">Profile</span>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 space-y-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 rounded-2xl bg-[#1b1e23] p-5 ring-1 ring-white/[0.06]">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-xl font-bold shadow-lg">
                  {user?.image ? (
                    <img src={user.image} alt={displayName} className="h-14 w-14 rounded-2xl object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-zinc-100 truncate">{displayName || "User"}</p>
                  <p className="text-[12px] text-zinc-500 truncate">{user?.email || "No email"}</p>
                </div>
              </div>

              {/* Account section */}
              <section className="rounded-2xl bg-[#1b1e23] p-5 ring-1 ring-white/[0.06]">
                <h2 className="text-[13px] font-semibold text-zinc-100 mb-4">Account</h2>

                <div className="space-y-3">
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium text-zinc-500">Display name</p>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl bg-white/[0.05] px-4 py-3 text-[13px] text-zinc-100 placeholder:text-zinc-600 ring-1 ring-white/[0.06] focus:outline-none focus:ring-emerald-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium text-zinc-500">Email</p>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full rounded-xl bg-white/[0.03] px-4 py-3 text-[13px] text-zinc-500 ring-1 ring-white/[0.04] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[13px] font-semibold text-black hover:bg-emerald-400 transition-colors active:scale-[0.98]"
                  >
                    {saved ? "Saved ✓" : "Save"}
                  </button>
                </div>
              </section>

              {/* Auth section */}
              <section className="rounded-2xl bg-[#1b1e23] p-5 ring-1 ring-white/[0.06]">
                <h2 className="text-[13px] font-semibold text-zinc-100 mb-4">Authentication</h2>

                <div className="flex items-center gap-3 mb-5">
                  {/* Provider badge */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                    <svg width="18" height="18" viewBox="0 0 20 20">
                      <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.8 2.31-2.35 3.25l-.03.2 3.4 2.64.46.05c2.18-2.01 3.63-4.96 3.63-7.81z" fill="#4285F4"/>
                      <path d="M10 20c2.7 0 4.96-.89 6.62-2.41l-3.4-2.64c-.91.64-2.1 1.04-3.22 1.04-2.5 0-4.61-1.64-5.37-3.9l-.2.02-3.53 2.73-.05.19C2.68 17.92 6.15 20 10 20z" fill="#34A853"/>
                      <path d="M4.63 12.09A6.07 6.07 0 0 1 4.3 10c0-.73.13-1.43.32-2.09l-.01-.22-3.57-2.77-.19.1A10.02 10.02 0 0 0 0 10c0 1.61.38 3.14 1.05 4.5l3.58-2.41z" fill="#FBBC05"/>
                      <path d="M10 3.97c1.75 0 2.93.76 3.6 1.38l2.64-2.57C14.95 1.19 12.7 0 10 0 6.15 0 2.68 2.08 1.05 5.5l3.57 2.77C5.39 5.6 7.5 3.97 10 3.97z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-200">Google</p>
                    <p className="text-[11px] text-zinc-500">{user?.email || "Connected"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/auth" })}
                  className="w-full rounded-xl bg-rose-500/10 py-3 text-[13px] font-semibold text-rose-400 ring-1 ring-rose-500/30 hover:bg-rose-500/20 transition-colors active:scale-[0.98]"
                >
                  Sign out
                </button>
              </section>
            </main>
          </div>
        </div>
      </RequireOnboarding>
    </RequireAuth>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

function getKey(user) {
  const id = user?.id || user?.email || user?.name || "anonymous";
  return `epico:onboarded:${id}`;
}

/* ── Mascot: blue circles (empty) → green triangles (typing) ── */
function Mascot({ hasText }) {
  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* Eyes */}
      <div className="flex gap-8 mb-4">
        {hasText ? (
          <>
            <div
              className="w-10 h-10 transition-all duration-500"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                background: "#22c55e",
              }}
            />
            <div
              className="w-10 h-10 transition-all duration-500"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                background: "#22c55e",
              }}
            />
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-blue-500 transition-all duration-500" />
            <div className="w-10 h-10 rounded-full bg-blue-500 transition-all duration-500" />
          </>
        )}
      </div>
      {/* Smile */}
      <div
        className="w-16 h-8 transition-colors duration-500"
        style={{
          borderBottom: `4px solid ${hasText ? "#22c55e" : "#3b82f6"}`,
          borderLeft: `4px solid ${hasText ? "#22c55e" : "#3b82f6"}`,
          borderRight: `4px solid ${hasText ? "#22c55e" : "#3b82f6"}`,
          borderRadius: "0 0 9999px 9999px",
        }}
      />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const storageKey = useMemo(
    () => (session?.user ? getKey(session.user) : null),
    [session?.user],
  );

  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!storageKey) return;
    const onboarded = localStorage.getItem(storageKey) === "1";
    if (onboarded) router.replace("/");
  }, [status, storageKey, router]);

  async function handleFinish() {
    if (!storageKey) return;
    setLoading(true);
    try {
      localStorage.setItem(storageKey, "1");
      const userId = session?.user?.id || session?.user?.sub;
      if (userId) {
        const displayName = session?.user?.name || "User";
        localStorage.setItem(`epico:displayName:${userId}`, displayName);
        if (productName.trim()) {
          localStorage.setItem(`epico:productName:${userId}`, productName.trim());
        }
      }
      await update?.();
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && productName.trim() && !loading) {
      handleFinish();
    }
  }

  if (status !== "authenticated") return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#131618] text-zinc-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <Image src="/group-17.svg" alt="Epico" width={36} height={32} className="h-7 w-auto" />
          <span className="text-[17px] font-semibold tracking-tight">Epico</span>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Меню"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="#a1a1aa" />
            <circle cx="10" cy="10" r="1.5" fill="#a1a1aa" />
            <circle cx="10" cy="16" r="1.5" fill="#a1a1aa" />
          </svg>
        </button>
      </header>

      {/* Product name input — below header */}
      <div className="px-4 pt-2 pb-1">
        <div className="flex items-center gap-2 rounded-2xl bg-[#1b1e23] ring-1 ring-white/[0.06] px-4 py-3">
          <input
            type="text"
            autoFocus
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter product name"
            className="flex-1 bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            aria-label="Продолжить"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2a2d33] text-zinc-300 hover:bg-white/20 transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Welcome text */}
      <main className="flex flex-1 flex-col px-4 pb-8">
        <div className="mt-6 mb-2">
          <h1 className="text-[30px] font-bold leading-tight text-white">
            Welcome to Epico!
          </h1>
          <p className="mt-1.5 text-[14px] text-zinc-400">
            Create the first space for your product
          </p>
        </div>

        {/* Mascot */}
        <div className="flex flex-1 items-center justify-center">
          <Mascot hasText={productName.length > 0} />
        </div>
      </main>
    </div>
  );
}

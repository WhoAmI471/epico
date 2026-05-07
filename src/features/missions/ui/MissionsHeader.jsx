"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function MissionsHeader({
  projectTitle,
  onOpenFilters,
  filtersActive,
}) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAuthed = status === "authenticated";

  const displayName =
    session?.user?.name ||
    session?.telegram?.username ||
    session?.telegram?.first_name ||
    "User";

  const avatarInitial = (() => {
    const raw = String(displayName || "").replace(/^@/, "").trim();
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return raw.slice(0, 2).toUpperCase() || "U";
  })();

  return (
    <header className="bg-[#0d0d0f] px-4 pt-2 pb-0">
      {/* Top row: logo + menu */}
      <div className="flex items-center justify-between py-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/group-17.svg"
            alt="Epico"
            width={40}
            height={36}
            priority
            className="h-8 w-auto"
          />
          <span className="text-[17px] font-semibold tracking-tight text-white">
            Epico
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2" ref={menuRef}>
          {/* Filter button */}
          <button
            type="button"
            onClick={onOpenFilters}
            aria-label="Фильтры"
            className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5h14M6 10h8M9 15h2"
                stroke={filtersActive ? "#4ade80" : "#a1a1aa"}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {filtersActive && (
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* 3-dot menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="4" r="1.5" fill="#a1a1aa" />
                <circle cx="10" cy="10" r="1.5" fill="#a1a1aa" />
                <circle cx="10" cy="16" r="1.5" fill="#a1a1aa" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-50 min-w-[160px] rounded-2xl bg-[#1a1a1f] py-1 ring-1 ring-white/10 shadow-2xl">
                {isAuthed ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-semibold">
                        {avatarInitial}
                      </span>
                      Профиль
                    </Link>
                    <div className="my-1 h-px bg-white/10" />
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-white/5"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/auth" });
                      }}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Войти
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product name row */}
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-white">
          {projectTitle || "Без названия"}
        </h1>
      </div>
    </header>
  );
}

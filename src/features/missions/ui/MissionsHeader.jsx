"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function MissionsHeader({
  projectTitle,
  onOpenFilters,
  filtersActive,
  onOpenProjectMenu,
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
    <header className="bg-[#131618] px-4 pt-3 pb-0">
      {/* Top row: logo + 3-dot menu */}
      <div className="flex items-center justify-between py-1.5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/group-17.svg"
            alt="Epico"
            width={24}
            height={22}
            priority
            className="h-6 w-auto"
          />
          <span className="text-[28px] font-semi tracking-tight text-white">
            Epico
          </span>
        </div>

        {/* 3-dot menu */}
        <div className="relative" ref={menuRef}>
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
            <div className="absolute right-0 top-10 z-50 min-w-[160px] rounded-2xl bg-[#1b1e23] py-1 ring-1 ring-white/10 shadow-2xl">
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

      {/* Product name row + filter icon */}
      <div className="flex items-center justify-between pb-3 pt-1">
        <button
          type="button"
          onClick={onOpenProjectMenu}
          className="flex items-center gap-1.5 group min-w-0"
        >
          <h1 className="text-[22px] font-bold tracking-tight text-white truncate group-hover:text-zinc-200 transition-colors">
            {projectTitle || "Без названия"}
          </h1>
          {/* dropdown chevron */}
          {/* <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="flex-shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors mt-0.5"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
        </button>

        {/* Filter button */}
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Фильтры"
          className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
        >
          {/* Funnel icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 3.5h14l-5.25 6.3V15l-3.5-1.75V9.8L2 3.5z"
              stroke={filtersActive ? "#4ade80" : "#a1a1aa"}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {filtersActive && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>
    </header>
  );
}

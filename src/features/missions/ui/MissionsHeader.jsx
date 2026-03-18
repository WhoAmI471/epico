"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IconButton, Button } from "../../../shared/ui";

export function MissionsHeader() {
  const { data: session, status } = useSession();

  const displayName =
    session?.user?.name ||
    session?.telegram?.username ||
    session?.telegram?.first_name ||
    "User";

  const isAuthed = status === "authenticated";

  const avatarInitial = (() => {
    const raw = String(displayName || "")
      .replace(/^@/, "")
      .trim();
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return raw.slice(0, 2).toUpperCase() || "U";
  })();

  return (
    <header className="mb-0 rounded-none bg-[#080A0E] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/group-17.svg"
            alt="Epico logo"
            width={54}
            height={50}
            priority
            className="h-[44px] w-auto"
          />
          <div className="text-2xl font-semibold tracking-tight">Epico</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-900/80 px-4 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700/80 hover:bg-zinc-800"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online
          </button>

          <IconButton size="md" variant="solid" aria-label="Help">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[13px] font-semibold">
              ?
            </span>
          </IconButton>

          {isAuthed ? (
            <>
              <Link href="/profile" aria-label="Open profile">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 ring-1 ring-zinc-700/80 hover:bg-zinc-800">
                  <span className="text-xs font-semibold text-zinc-200">
                    {avatarInitial}
                  </span>
                </span>
              </Link>
              <Button
                variant="solid"
                size="sm"
                className="rounded-full"
                onClick={() => signOut({ callbackUrl: "/auth" })}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth" aria-label="Sign in">
              <IconButton size="md" variant="solid">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold">
                  👤
                </span>
              </IconButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


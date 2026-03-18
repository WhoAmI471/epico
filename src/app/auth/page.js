"use client";

import Link from "next/link";
import { Button, TextInput, classNames } from "../../shared/ui";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#05060a] to-[#050509] text-zinc-50">
      <main className="mx-auto flex w-full max-w-md flex-col px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-violet-500/40">
            <span className="text-lg font-bold leading-none">E</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Epico</h1>
            <p className="text-xs text-zinc-500">Sign in prototype page</p>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-950/80 p-5 ring-1 ring-zinc-900">
          <h2 className="text-sm font-semibold">Sign in</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Это UI‑каркас. Подключим реальную авторизацию позже.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <p className="mb-1 text-[11px] font-medium text-zinc-300">
                Email
              </p>
              <TextInput type="email" placeholder="you@company.com" />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-medium text-zinc-300">
                Password
              </p>
              <TextInput type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Button
              variant="solid"
              size="sm"
              className="rounded-full"
              onClick={() => alert("Auth prototype: not connected yet")}
            >
              Sign in
            </Button>
            <Link
              href="/"
              className={classNames(
                "text-[11px] font-medium text-emerald-400 hover:text-emerald-300",
              )}
            >
              Back to missions
            </Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Demo links:{" "}
          <Link href="/" className="text-zinc-200 hover:underline">
            Missions
          </Link>{" "}
          ·{" "}
          <Link href="/profile" className="text-zinc-200 hover:underline">
            Profile
          </Link>
        </div>
      </main>
    </div>
  );
}


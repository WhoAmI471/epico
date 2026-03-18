"use client";

import Link from "next/link";
import { Button, TextInput, classNames } from "../../shared/ui";
import { RequireAuth } from "../../shared/auth/RequireAuth";
import { RequireOnboarding } from "../../shared/auth/RequireOnboarding";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <RequireOnboarding>
      <div className="flex min-h-screen bg-gradient-to-b from-[#06070b] to-[#10101b] text-zinc-50">
          <main className="mx-auto flex w-full max-w-2xl flex-col px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-violet-500/40">
              <span className="text-lg font-bold leading-none">E</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Profile</h1>
              <p className="text-xs text-zinc-500">User settings prototype</p>
            </div>
          </div>
          <Link
            href="/"
            className={classNames(
              "text-[11px] font-medium text-emerald-400 hover:text-emerald-300",
            )}
          >
            Back to missions
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl bg-zinc-950/80 p-5 ring-1 ring-zinc-900">
            <h2 className="text-sm font-semibold">Account</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Каркас профиля. Данные пока не сохраняются.
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <p className="mb-1 text-[11px] font-medium text-zinc-300">
                  Display name
                </p>
                <TextInput placeholder="Leonid Lapidus" />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-medium text-zinc-300">
                  Username
                </p>
                <TextInput placeholder="@leonidlapidus" />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => alert("Profile prototype: not saved")}
              >
                Save
              </Button>
            </div>
          </section>

          <section className="rounded-2xl bg-zinc-950/80 p-5 ring-1 ring-zinc-900">
            <h2 className="text-sm font-semibold">Security</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Будущие настройки безопасности.
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <p className="mb-1 text-[11px] font-medium text-zinc-300">
                  Current password
                </p>
                <TextInput type="password" placeholder="••••••••" />
              </div>
              <div>
                <p className="mb-1 text-[11px] font-medium text-zinc-300">
                  New password
                </p>
                <TextInput type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="solid"
                size="sm"
                onClick={() => alert("Profile prototype: not connected")}
              >
                Update password
              </Button>
              <Link href="/auth" className="my-auto text-[11px] text-zinc-400 hover:text-zinc-200">
                Go to auth
              </Link>
            </div>
          </section>
        </div>
          </main>
        </div>
      </RequireOnboarding>
    </RequireAuth>
  );
}


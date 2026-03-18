"use client";

import Link from "next/link";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button, classNames } from "../../shared/ui";

export default function AuthPage() {
  const telegramBot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
    ?.replace(/^@/, "")
    ?.trim();

  useEffect(() => {
    if (!telegramBot) return;

    // Used by Telegram Login Widget `data-onauth="onTelegramAuth(user)"`
    window.onTelegramAuth = (user) => {
      signIn("telegram", {
        telegramData: JSON.stringify(user),
        callbackUrl: "/",
      });
    };

    const container = document.getElementById("telegram-login-container");
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", telegramBot);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [telegramBot]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#06070b] to-[#10101b] text-zinc-50">
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
            Выберите способ входа.
          </p>

          <div className="mt-5 space-y-2.5">
            <Button
              variant="solid"
              size="md"
              className="w-full justify-center"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Continue with Google
            </Button>

            <div className="rounded-xl bg-zinc-950/60 p-3 ring-1 ring-zinc-900">
              <p className="text-[11px] font-medium text-zinc-300">
                Continue with Telegram
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                {telegramBot
                  ? `Bot: @${telegramBot}`
                  : "Укажи NEXT_PUBLIC_TELEGRAM_BOT_USERNAME в .env.local"}
              </p>

              {telegramBot ? (
                <div
                  id="telegram-login-container"
                  className="mt-4 flex items-center justify-center"
                />
              ) : (
                <Button
                  variant="solid"
                  size="sm"
                  className="mt-3 w-full justify-center opacity-60"
                  disabled
                >
                  Telegram not configured
                </Button>
              )}
            </div>
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

        <div className="mt-4 text-[11px] text-zinc-500">
          <Link
            href="/"
            className={classNames(
              "font-medium text-emerald-400 hover:text-emerald-300",
            )}
          >
            Back to missions
          </Link>
        </div>
      </main>
    </div>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const telegramBot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
    ?.replace(/^@/, "")
    ?.trim();

  useEffect(() => {
    if (!telegramBot) return;

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

    return () => { container.innerHTML = ""; };
  }, [telegramBot]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d0f] text-zinc-50">
      <main className="flex flex-1 flex-col px-5 pb-10">
        {/* Logo */}
        <div className="mt-6 mb-10 flex items-center gap-2.5">
          <Image src="/group-17.svg" alt="Epico" width={24} height={22} />
          <span className="text-[20px] font-semibold">Epico</span>
        </div>

        {/* Welcome text */}
        <div className="mb-8">
          <h1 className="text-[30px] font-bold leading-tight">
            Добро пожаловать <br/>в Epico!
          </h1>
          <p className="mt-2 text-[14px] text-zinc-400">
            Войдите в систему, чтобы управлять заданиями по разработке продуктов.
          </p>
        </div>

        {/* Auth buttons */}
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[15px] font-semibold text-black hover:bg-zinc-100 transition-colors active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.8 2.31-2.35 3.25l-.03.2 3.4 2.64.46.05c2.18-2.01 3.63-4.96 3.63-7.81z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.96-.89 6.62-2.41l-3.4-2.64c-.91.64-2.1 1.04-3.22 1.04-2.5 0-4.61-1.64-5.37-3.9l-.2.02-3.53 2.73-.05.19C2.68 17.92 6.15 20 10 20z" fill="#34A853"/>
              <path d="M4.63 12.09A6.07 6.07 0 0 1 4.3 10c0-.73.13-1.43.32-2.09l-.01-.22-3.57-2.77-.19.1A10.02 10.02 0 0 0 0 10c0 1.61.38 3.14 1.05 4.5l3.58-2.41z" fill="#FBBC05"/>
              <path d="M10 3.97c1.75 0 2.93.76 3.6 1.38l2.64-2.57C14.95 1.19 12.7 0 10 0 6.15 0 2.68 2.08 1.05 5.5l3.57 2.77C5.39 5.6 7.5 3.97 10 3.97z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Telegram */}
          {/* <div className="rounded-2xl bg-[#1a1a1f] ring-1 ring-white/[0.06] overflow-hidden">
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#229ED9]">
                  <svg width="16" height="14" viewBox="0 0 24 20" fill="white">
                    <path d="M22.26 1.67L18.97 18.1c-.24 1.07-.87 1.34-1.77.83l-4.87-3.59-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96 8.98-8.1c.39-.35-.08-.54-.6-.2L5.42 12.48.6 10.98c-1.07-.33-1.08-1.07.22-1.58L21.04.24c.89-.33 1.67.2 1.22 1.43z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-zinc-100">Telegram</p>
                  {telegramBot ? (
                    <p className="text-[11px] text-zinc-500">@{telegramBot}</p>
                  ) : (
                    <p className="text-[11px] text-zinc-600">Not configured</p>
                  )}
                </div>
              </div>

              {telegramBot ? (
                <div id="telegram-login-container" className="flex items-center justify-center py-1" />
              ) : (
                <div className="rounded-xl bg-white/[0.03] px-4 py-3 text-[11px] text-zinc-600 ring-1 ring-white/[0.04]">
                  Укажи NEXT_PUBLIC_TELEGRAM_BOT_USERNAME в .env.local для включения входа через Telegram.
                </div>
              )}
            </div>
          </div> */}
        </div>

        {/* Demo link */}
        {/* <div className="mt-auto pt-10 text-center">
          <Link
            href="/"
            className="text-[13px] text-emerald-400 hover:text-emerald-300"
          >
            Перейти без авторизации →
          </Link>
        </div> */}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

function getKey(user) {
  const id = user?.id || user?.email || user?.name || "anonymous";
  return `epico:onboarded:${id}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const storageKey = useMemo(
    () => (session?.user ? getKey(session.user) : null),
    [session?.user],
  );

  const [step, setStep] = useState(0); // 0 = welcome, 1 = name, 2 = product
  const [displayName, setDisplayName] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    setDisplayName(session?.user?.name || "");
  }, [status, session?.user?.name]);

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
        localStorage.setItem(`epico:displayName:${userId}`, displayName.trim() || "User");
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

  if (status !== "authenticated") return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d0f] text-zinc-50">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3">
        <Image src="/group-17.svg" alt="Epico" width={36} height={32} className="h-7 w-auto" />
        <span className="text-[17px] font-semibold">Epico</span>
      </div>

      {/* Content */}
      <main className="flex flex-1 flex-col px-5 pb-8">
        {step === 0 && (
          <WelcomeStep onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <NameStep
            displayName={displayName}
            setDisplayName={setDisplayName}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <ProductStep
            productName={productName}
            setProductName={setProductName}
            onFinish={handleFinish}
            loading={loading}
            disabled={!displayName.trim()}
          />
        )}
      </main>
    </div>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-8 mb-6">
        <h1 className="text-[28px] font-bold leading-tight">
          Welcome to Epico!
        </h1>
        <p className="mt-2 text-[14px] text-zinc-400">
          Create the first task for your product
        </p>
      </div>

      {/* Animated logo */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute h-48 w-48 rounded-full bg-emerald-500/5 animate-pulse" />
          <div className="absolute h-36 w-36 rounded-full bg-emerald-500/10" />
          {/* Logo */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#1a1a1f]">
            <Image src="/group-17.svg" alt="Epico" width={56} height={50} className="h-12 w-auto" />
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {/* Step indicators */}
        <div className="mb-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-emerald-500 transition-all"
              style={{ width: i === 0 ? "24px" : "6px", opacity: i === 0 ? 1 : 0.3 }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-2xl bg-emerald-500 py-4 text-[15px] font-semibold text-black hover:bg-emerald-400 transition-colors active:scale-[0.98]"
        >
          Начать →
        </button>
      </div>
    </div>
  );
}

function NameStep({ displayName, setDisplayName, onNext }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-8 mb-6">
        <h1 className="text-[28px] font-bold leading-tight">
          Welcome to Epico!
        </h1>
        <p className="mt-2 text-[14px] text-zinc-400">
          Please fill in the fields below
        </p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <p className="mb-2 text-[13px] font-medium text-zinc-300">Your name</p>
        <input
          type="text"
          autoFocus
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && displayName.trim() && onNext()}
          placeholder="Enter your name"
          className="w-full rounded-2xl bg-[#1a1a1f] px-4 py-4 text-[15px] text-zinc-100 placeholder:text-zinc-600 ring-1 ring-white/[0.06] focus:outline-none focus:ring-emerald-500/60"
        />
      </div>

      {/* Keyboard illustration placeholder */}
      <div className="flex flex-1 items-end">
        <div className="mt-auto w-full">
          {/* Step indicators */}
          <div className="mb-6 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === 1 ? "24px" : "6px",
                  backgroundColor: i <= 1 ? "#22c55e" : "#3f3f46",
                  opacity: i === 1 ? 1 : 0.5,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!displayName.trim()}
            className="w-full rounded-2xl bg-emerald-500 py-4 text-[15px] font-semibold text-black hover:bg-emerald-400 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Продолжить →
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductStep({ productName, setProductName, onFinish, loading, disabled }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-8 mb-6">
        <h1 className="text-[28px] font-bold leading-tight">
          Add the first mission
        </h1>
        <p className="mt-2 text-[14px] text-zinc-400">
          Give a name to your product
        </p>
      </div>

      {/* Product name input */}
      <div className="mb-4">
        <p className="mb-2 text-[13px] font-medium text-zinc-300">Product name</p>
        <input
          type="text"
          autoFocus
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onFinish()}
          placeholder="Wonderful Product"
          className="w-full rounded-2xl bg-[#1a1a1f] px-4 py-4 text-[15px] text-zinc-100 placeholder:text-zinc-600 ring-1 ring-white/[0.06] focus:outline-none focus:ring-emerald-500/60"
        />
      </div>

      {/* Preview card */}
      {productName.trim() && (
        <div className="rounded-2xl bg-[#1a1a1f] p-4 ring-1 ring-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <span className="text-sm font-bold text-white">
                {productName.trim()[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zinc-100">{productName.trim()}</p>
              <p className="text-[11px] text-zinc-500">В работе</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto">
        {/* Step indicators */}
        <div className="mb-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === 2 ? "24px" : "6px",
                backgroundColor: "#22c55e",
                opacity: i === 2 ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onFinish}
          disabled={loading || disabled}
          className="w-full rounded-2xl bg-emerald-500 py-4 text-[15px] font-semibold text-black hover:bg-emerald-400 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Сохранение..." : "Начать работу →"}
        </button>
      </div>
    </div>
  );
}

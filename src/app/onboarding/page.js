"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, TextInput, classNames } from "../../shared/ui";

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

  const [displayName, setDisplayName] = useState("");
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

  async function handleSave() {
    if (!storageKey) return;
    setLoading(true);
    try {
      localStorage.setItem(storageKey, "1");
      // Store onboarding display name for project creation.
      const userId = session?.user?.id || session?.user?.sub;
      if (userId) {
        localStorage.setItem(
          `epico:displayName:${userId}`,
          displayName.trim(),
        );
      }
      // Persisting display name to backend would require a DB.
      // For now, keep it local and allow the rest of the app to proceed.
      await update?.();
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  if (status !== "authenticated") return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#06070b] to-[#10101b] text-zinc-50">
      <main className="mx-auto flex w-full max-w-md flex-col px-6 py-10">
        <div className="mb-6">
          <h1 className="text-lg font-semibold tracking-tight">Welcome</h1>
          <p className="mt-1 text-xs text-zinc-500">
            First-time setup: please fill required field.
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950/80 p-5 ring-1 ring-zinc-900">
          <p className="mb-1 text-[11px] font-medium text-zinc-300">
            Display name
          </p>
          <TextInput
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />

          <div className="mt-5 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={loading || !displayName.trim()}
              className={classNames(
                !displayName.trim() && "opacity-60",
              )}
            >
              {loading ? "Saving..." : "Save and continue"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}


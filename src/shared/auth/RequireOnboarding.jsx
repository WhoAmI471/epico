"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function getKey(user) {
  const id =
    user?.id ||
    user?.email ||
    user?.name ||
    "anonymous";
  return `epico:onboarded:${id}`;
}

export function RequireOnboarding({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const storageKey = useMemo(
    () => (session?.user ? getKey(session.user) : null),
    [session?.user],
  );

  const [resolved, setResolved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!storageKey) return;

    const onboarded = localStorage.getItem(storageKey) === "1";
    if (!onboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    setResolved(true);
  }, [status, storageKey, pathname, router]);

  if (!mounted) return null;
  if (status === "loading" || !resolved) return null;
  return children;
}


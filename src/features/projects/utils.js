export function deriveHandleFromSession(sessionUser, displayName) {
  const telegramUsername = sessionUser?.telegram?.username;
  if (telegramUsername) {
    const normalized = String(telegramUsername).replace(/^@/, "").trim();
    return normalized ? `@${normalized}` : "@user";
  }

  const name = sessionUser?.name || displayName || "user";
  const normalized = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);

  return normalized ? `@${normalized}` : "@user";
}


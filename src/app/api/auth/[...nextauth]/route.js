import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import crypto from "crypto";

function verifyTelegramAuth(payload, botToken) {
  if (!payload || typeof payload !== "object") return null;
  if (!botToken) return null;

  const { hash, ...data } = payload;
  if (!hash) return null;

  const dataCheckString = Object.keys(data)
    .filter((key) => data[key] !== undefined && data[key] !== null)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) return null;

  // Optional anti-replay: 10 minutes window
  if (data.auth_date) {
    const authDateMs = Number(data.auth_date) * 1000;
    if (Number.isFinite(authDateMs)) {
      const maxAgeMs = 10 * 60 * 1000;
      if (Date.now() - authDateMs > maxAgeMs) return null;
    }
  }

  return data;
}

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        telegramData: { label: "telegramData", type: "text" },
      },
      async authorize(credentials) {
        const raw = credentials?.telegramData;
        if (!raw) return null;

        let payload;
        try {
          payload = typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          return null;
        }

        const verified = verifyTelegramAuth(
          payload,
          process.env.TELEGRAM_BOT_TOKEN,
        );
        if (!verified) return null;

        return {
          id: `tg:${verified.id}`,
          name:
            verified.first_name ||
            verified.username ||
            `Telegram ${verified.id}`,
          image: verified.photo_url || null,
          telegram: verified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ensure stable identifier for onboarding storage.
      // NextAuth already sets `token.sub` for both OAuth & Credentials.
      if (user?.id) token.userId = user.id;
      if (!token.userId) token.userId = token.sub;

      if (user?.telegram) token.telegram = user.telegram;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.userId || token.sub;
      }
      if (token?.telegram) session.telegram = token.telegram;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const ADMIN_IDS = (process.env.ADMIN_DISCORD_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId:     process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email guilds" } },
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      // Only allow users whose Discord ID is in ADMIN_DISCORD_IDS
      if (!profile?.id) return false;
      if (ADMIN_IDS.length === 0) return true; // open access if no IDs configured
      return ADMIN_IDS.includes(String(profile.id));
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id as string;
        token.avatar    = (profile as any).avatar as string | null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.discordId = token.discordId as string;
      session.user.avatar    = token.avatar as string | null;
      return session;
    },
  },

  pages: {
    signIn:  "/login",
    error:   "/login",
  },
});

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      discordId: string;
      avatar: string | null;
    };
  }
}

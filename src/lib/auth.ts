import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read",
    }),
  ],
  session: {
    strategy: "jwt", // ← теперь JWT-сессии
  },

  callbacks: {
    // Срабатывает на первой авторизации и при обновлении JWT
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;

      }
      return token;
    },
    // Срабатывает при getSession() / useSession() и передаёт токен в браузер
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.id = token.id ?? token.sub;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

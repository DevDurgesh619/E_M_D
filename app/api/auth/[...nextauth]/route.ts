// File Path: /app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // We must use the 'jwt' strategy for middleware to work correctly.
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // This callback runs first, adding the user's role to the JWT.
    async jwt({ token, user }) {
      if (user) {
        // On initial sign in, user object is available
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },

    // This callback runs second, adding data from the token to the client-side session.
    async session({ session, token }) {
      if (session.user) {
        // The token contains the data we put in it during the jwt callback
        // @ts-ignore
        session.user.role = token.role; 
        // The user ID is stored in the 'sub' (subject) property of the token
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
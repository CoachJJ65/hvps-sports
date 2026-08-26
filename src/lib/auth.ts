import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

function sessionUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!valid) {
          return null;
        }

        return sessionUser(user);
      },
    }),
    CredentialsProvider({
      id: 'pin',
      name: 'PIN',
      credentials: {
        pin: { label: 'PIN', type: 'password' },
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const pin = credentials?.pin?.trim();
        if (!pin) {
          return null;
        }

        const email = credentials?.email?.trim().toLowerCase();
        if (email) {
          const user = await db.user.findUnique({ where: { email } });
          if (!user?.pin_hash) return null;
          const match = await bcrypt.compare(pin, user.pin_hash);
          return match ? sessionUser(user) : null;
        }

        const users = await db.user.findMany({
          where: { pin_hash: { not: null } },
        });
        for (const user of users) {
          if (!user.pin_hash) continue;
          const match = await bcrypt.compare(pin, user.pin_hash);
          if (match) return sessionUser(user);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

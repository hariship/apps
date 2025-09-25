import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getClient } from '@/lib/database';
import * as bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await getClient();
        try {
          const result = await client.query(
            'SELECT * FROM users WHERE email = $1 AND active = true',
            [credentials.email]
          );

          if (result.rows.length === 0) {
            return null;
          }

          const user = result.rows[0];
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await client.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
          );

          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        } finally {
          client.release();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
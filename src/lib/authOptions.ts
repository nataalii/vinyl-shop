import connect from '@/lib/mongoose';
import UserModel from '@/models/User';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'E-mail address',
          type: 'email',
          placeholder: 'jsmith@jsmith.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        await connect();
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const { email } = credentials;
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new Error('No user found with this email address');
        }

        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) {
          throw new Error('Password Not Correct');
        }

        return { _id: user.id } as User;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

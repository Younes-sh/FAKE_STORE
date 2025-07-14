import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // بسیار مهم برای اینکه سشن‌ها در API قابل استفاده باشند
  },
  secret: process.env.NEXTAUTH_SECRET, // حتماً در فایل .env.local تنظیم شود
  pages: {
    signIn: "/login", // اگر صفحه لاگین اختصاصی داری
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      return session;
    },
  },
};

export default NextAuth(authOptions);

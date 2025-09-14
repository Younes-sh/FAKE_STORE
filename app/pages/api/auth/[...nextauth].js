// pages/api/auth/[...nextauth].js
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
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email }).select(
            "+password +emailVerified +isActive +role"
          );
          if (!user) throw new Error("کاربری با این ایمیل یافت نشد");
          if (!user.emailVerified)
            throw new Error("لطفاً ایمیل خود را قبل از ورود تأیید کنید");
          if (user.isActive === false)
            throw new Error("حساب شما غیرفعال است. لطفاً با پشتیبانی تماس بگیرید");
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("رمز عبور نامعتبر است");

          // console.log(`کاربر وارد شد: ${user.email} با نقش: ${user.role}`);

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role?.toLowerCase() || "user", // نقش به حروف کوچک تبدیل شد
            isVerified: !!user.emailVerified,
            isActive: user.isActive,
          };
        } catch (error) {
          console.error("خطای احراز هویت:", error.message);
          throw new Error(error.message || "احراز هویت ناموفق بود");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 2 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // در sign-in اولیه: داده‌ها از authorize
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isActive = user.isActive;
        return token;
      }

      // همگام‌سازی با دیتابیس فقط در trigger="update" (مثل تغییر نقش)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
        // اختیاری: query دیتابیس برای تأیید تغییرات
        try {
          await dbConnect();
          const dbUser = await User.findById(token.id).select("role username emailVerified isActive");
          if (dbUser) {
            token.role = dbUser.role?.toLowerCase();
            token.username = dbUser.username;
            token.isVerified = !!dbUser.emailVerified;
            token.isActive = dbUser.isActive;
          }
        } catch (error) {
          console.error("خطا در همگام‌سازی jwt با دیتابیس:", error);
          // token را بدون تغییر برگردان (fallback)
        }
        return token;
      }

      // برای درخواست‌های عادی: token را بدون query دیتابیس برگردان (بهینه‌سازی عملکرد)
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          username: token.username,
          role: token.role,
          isVerified: token.isVerified,
          isActive: token.isActive,
        };
      }
      // console.log("Session:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      // console.log(`کاربر وارد شد: ${user.email} با نقش: ${user.role}`);
    },
    async signOut({ token }) {
      // console.log(`کاربر خارج شد: ${token.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
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
          const email = String(credentials?.email || "").trim().toLowerCase();
          const password = String(credentials?.password || "");

          if (!email || !password) {
            throw new Error("ایمیل یا رمز عبور نامعتبر است");
          }

          const user = await User.findOne({ email }).select(
            "+password +emailVerified +isActive +role"
          );
          if (!user) {
            throw new Error("کاربری با این ایمیل یافت نشد");
          }
          if (!user.emailVerified) {
            throw new Error("لطفاً ایمیل خود را قبل از ورود تأیید کنید");
          }
          if (user.isActive === false) {
            throw new Error("حساب شما غیرفعال است. لطفاً با پشتیبانی تماس بگیرید");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("رمز عبور نامعتبر است");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role?.toLowerCase() || "user",
            isVerified: !!user.emailVerified,
            isActive: user.isActive,
          };
        } catch (error) {
          console.error("خطای احراز هویت:", error.message);
          throw new Error(error.message || "احراز هویت ناموفق بود");
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       email: profile.email,
    //       username: profile.name,
    //       role: "user",
    //       isVerified: profile.email_verified,
    //       isActive: true,
    //     };
    //   },
    // }),
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isActive = user.isActive;
      }
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
      console.log(`کاربر وارد شد: ${user.email} با نقش: ${user.role}`);
    },
    async signOut({ token }) {
      console.log(`کاربر خارج شد: ${token.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
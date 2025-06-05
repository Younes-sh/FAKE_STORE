// pages/api/auth/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt", // استفاده از JWT برای ذخیره session سمت کلاینت
  },
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
          throw new Error("این ایمیل ثبت نشده است.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("رمز عبور اشتباه است.");
        }

        return {
          id: user.id.toString(),  // 👈 اطمینان حاصل کن که به رشته تبدیل شده
          email: user.email,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",       // مسیر ورود
    error: "/auth/error",   // صفحه نمایش خطا
  },
  callbacks: {
    // اطلاعاتی که وارد JWT می‌شوند
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
      }
      return token;
    },

    // اطلاعات JWT که وارد session می‌شوند
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

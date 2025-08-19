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
      async authorize(credentials, req) {
        try {
          await dbConnect();

          // یافتن کاربر با ایمیل وارد شده
          const user = await User.findOne({ email: credentials.email }).select("+password");
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // 🚫 جلوگیری از ورود بدون تأیید ایمیل
          if (!user.emailVerified) {
            throw new Error("Please verify your email before logging in");
          }
          // بررسی صحت رمز عبور
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          // لاگ برای بررسی‌های امنیتی
          console.log(`User logged in: ${user.email} with role: ${user.role}`);

          return {
            id: user._id.toString(), // تبدیل ObjectId به string
            email: user.email,
            username: user.username,
            role: user.role || 'user', // مقدار پیش‌فرض 'user' اگر نقش تعریف نشده باشد
            isVerified: user.isVerified // اضافه کردن فیلدهای اضافی در صورت نیاز
          };
        } catch (error) {
          console.error("Authentication error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 ساعت
    updateAge: 2 * 60 * 60, // هر 2 ساعت session به روز شود
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error", // صفحه نمایش خطاهای احراز هویت
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // هنگام لاگین اطلاعات کاربر را به توکن اضافه می‌کنیم
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.isVerified = user.isVerified;
      }

      // در صورت استفاده از قابلیت updateSession
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      // اطلاعات توکن را به سشن اضافه می‌کنیم
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        role: token.role,
        isVerified: token.isVerified
      };
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // مدیریت ریدایرکت‌ها پس از لاگین/لاگاوت
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // لاگ رویدادهای ورود
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ session, token }) {
      // لاگ رویدادهای خروج
      console.log(`User signed out: ${token.email}`);
    }
  },
  debug: process.env.NODE_ENV === "development", // فعال کردن حالت دیباگ فقط در محیط توسعه
};

export default NextAuth(authOptions);
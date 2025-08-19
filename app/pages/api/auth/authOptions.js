// pages/api/auth/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 2 * 60 * 60,
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

        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");

        if (!email || !password) {
          throw new Error("Invalid email or password");
        }

        // چون password در schema select:false است
        const user = await User.findOne({ email }).select("+password +emailVerified +isActive");
        if (!user) throw new Error("Invalid email or password");

        if (user.isActive === false) {
          throw new Error("Your account is deactivated. Please contact support.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        const ok = await bcrypt.compare(password, user.password || "");
        if (!ok) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role || "user",
          emailVerified: !!user.emailVerified,
          isActive: user.isActive !== false,
        };
      },
    }),
  ],
  // این‌ها را هم اینجا نگه داریم تا منبع واحد باشند
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.isActive = user.isActive;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.uid,
        email: token.email,
        username: token.username,
        role: token.role,
        emailVerified: token.emailVerified,
        isActive: token.isActive,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user?.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },
};

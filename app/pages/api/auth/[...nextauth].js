import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("کاربری با این ایمیل یافت نشد");
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("رمز عبور نامعتبر است");
        
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 1 روز
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development" // فعال کردن حالت debug در توسعه
};

export default NextAuth(authOptions);
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../models/user";
import dbConnect from "./dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  await dbConnect();
  const user = await User.findOne({ email: credentials.email }).select("+password");

  if (!user) {
    console.error("User not found for email:", credentials.email);
    return null;
  }

  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) {
    console.error("Invalid password for email:", credentials.email);
    return null;
  }

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}

    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

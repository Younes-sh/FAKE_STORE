// pages/api/auth/[...nextauth].js
import NextAuthModule from "next-auth";

const NextAuth = NextAuthModule.default;

export const authOptions = {
  providers: [
    {
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Authorize called with:", { 
            email: credentials?.email,
            hasPassword: !!credentials?.password 
          });

          const { default: dbConnect } = await import("@/lib/dbConnect");
          const { default: User } = await import("@/models/user");
          const { default: bcrypt } = await import("bcryptjs");

          await dbConnect();
          console.log("✅ Database connected");

          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing email or password");
            return null;
          }

          const email = credentials.email.trim().toLowerCase();
          console.log("🔍 Searching for user:", email);

          const user = await User.findOne({ email }).select("+password +emailVerified +isActive +role");
          console.log("👤 User found:", user ? "yes" : "no");

          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          if (!user.isActive) {
            console.log("❌ User not active");
            return null;
          }

          // 🔥 تست: چک کردن مستقیم پسورد
          console.log("🔑 Comparing passwords...");
          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log("🔑 Password valid:", isValid);

          if (!isValid) {
            console.log("❌ Invalid password");
            return null;
          }

          console.log("✅ Authorization successful for:", email);
          
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role || "user",
            image: user.image || null,
          };

        } catch (error) {
          console.error("❌ Auth error:", error);
          return null;
        }
      }
    }
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
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
        token.image = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    }
  },
  debug: true, // 🔥 فعال کردن دیباگ
};

export default NextAuth(authOptions);
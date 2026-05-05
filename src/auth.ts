import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminHash) return null;

        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        if (email !== adminEmail) return null;
        const ok = await bcrypt.compare(password, adminHash);
        if (!ok) return null;

        return { id: "admin", email, name: "Administrateur" };
      },
    }),
  ],
});

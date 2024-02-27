import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],

  async session({ session }) {},

  async signIn({ profile }) {},
});

export { handler as GET, handler as POST };

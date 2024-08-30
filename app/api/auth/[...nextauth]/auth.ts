// app/api/auth/[...nextauth]/auth.ts
import type { Account, NextAuthOptions, Profile } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "../../../../utils/mongodb";
import type { AdapterUser } from "next-auth/adapters";


interface CustomUser extends AdapterUser {
  _id: string;
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        await connect();

        try {
          const user = await User.findOne({ email: credentials.email });
          if (user && (await bcrypt.compare(credentials.password, user.password))) {
            return user as CustomUser; // Cast the user to the CustomUser type
          }
        } catch (err) {
          console.error("Error authorizing user:", err);
          throw new Error("Invalid credentials");
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      
    }: {
        user: any; account: any
      
    }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "github") {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.error("Error saving user:", err);
          return false;
        }
      }
      return false;
    },
  },
};

export default NextAuth(authOptions);

import { saltAndHashPassword } from "@/utils/password";
import client from "@/lib/mongodb";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";

const publicRoutes = ["/", "/about", "/signin", "/signup"];
const authRoutes = ["/signin", "/signup"];

const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          name: profile.name as string,
          email: profile.email as string,
          image: profile.picture as string,
          firstName: profile.given_name as string,
          lastName: profile.family_name as string,
          emailVerified: profile.email_verified,
        };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        let user = null;

        const pwHash = await saltAndHashPassword(
          credentials.password as string
        );

        user = await client.db("smart-mess").collection("users").findOne({
          email: credentials.email,
          password: pwHash,
        });

        if (!user) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name as string,
          email: user.email as string,
          emailVerified: user.emailVerified as Date,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Allow access to public routes for all users
      if (publicRoutes.includes(pathname)) {
        return true;
      }

      // Redirect logged-in users away from auth routes
      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true; // Allow access to auth pages if not logged in
      }

      // Allow access if the user is authenticated
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.emailVerified = user.emailVerified as Date;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.emailVerified = token.emailVerified;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthConfig;

export default authConfig;

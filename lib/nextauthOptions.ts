import CredentialsProvider from "next-auth/providers/credentials";

import { NextAuthOptions, User } from "next-auth";
import bcrypt from "bcryptjs";


export const authOptions:NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dan@gmail.com"},
        password: {label: "Password",type: "password",placeholder: "enter password"},
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email  || !credentials.password) {
          throw new Error("please provide atleast one identifier!");
        }
        try {
          const user = await prisma?.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
          if (!user) {
            return null;
          }
          const isPasswordValid = await bcrypt.compare(credentials.password,user.password)
          if(!isPasswordValid){
            return null;
          }
          return {
            email: user.email,
            id: user.id.toString(),
            name:user.username,
            image:user.avatar
          };
        } catch (error) {
          console.error("failed to logged in!", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }:any) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages:{
     error:"/error"
  },
  session: {
    strategy: "jwt",
  },
};

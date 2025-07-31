import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { NextAuthOptions, User } from "next-auth";
import bcrypt from "bcryptjs";


export const authOptions:NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phoneNumber: { label: "phone Number", type: "Number", placeholder: "dan@gmail.com"},
        password: {label: "Password",type: "password",placeholder: "enter password"},
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.phoneNumber  || !credentials.password) {
          throw new Error("please provide atleast one identifier!");
        }
        if(credentials.phoneNumber.length > 10 || credentials.phoneNumber.length < 10 ){
            throw new Error("enter 10 digit number!")
        }
        try {
          const user = await prisma?.user.findUnique({
            where: {
              email: credentials.phoneNumber,
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

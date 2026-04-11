import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import ConnectDb from "./src/lib/db"
import User from "./src/model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import { truncate } from "node:fs/promises";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({

            credentials: {
                email: { label: "email" },
                password: { label: "Password", type: "password" },
            },


            async authorize(credentials: any) {
                await ConnectDb();
                const email = credentials.email as string;
                const pass = credentials.password as string;
                // console.log("this is email and passworfdkjdfkjhd" , email , pass);

                const alreadyEmail = await User.findOne({ email });
                if (!alreadyEmail) {
                    throw new Error("Email and password is incorrect")
                }


                // console.log("emil" , alreadyEmail);

                const isMatch = await bcrypt.compare(pass, alreadyEmail.password);
                // console.log("hjdjhd0",isMatch);
                if (!isMatch) {
                    throw new Error("Email and password is incorrect")
                }

                const obj = {
                    id: alreadyEmail._id.toString(),
                    name: alreadyEmail.name,
                    email: alreadyEmail.email,
                    role: alreadyEmail.role,
                }



                return obj;

            }
        }),


        Google({
            clientId: process.env.ClIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        })
    ],




    callbacks: {

        async signIn({ account, user }: any) {
            await ConnectDb();
            if (account.provider == "google") {
                let DbUser = await User.findOne({ email: user?.email })
                if (!DbUser) {
                    DbUser = await User.create({
                        name: user?.name,
                        email: user?.email,
                        image: user?.image
                    })
                }

                user.id = DbUser._id.toString();
                user.role = DbUser.role
            }

            return true


        },




        jwt({ token, user }: any) {
            if (user) {
                token.id = user?.id,
                    token.name = user?.name,
                    token.email = user?.email,
                    token.role = user?.role
            }
            return token
        },
        session({ token, session }: any) {

            if (session.user) {
                session.user.id = token?.id as string
                session.user.name = token?.name as string
                session.user.email = token?.email as string
                session.user.role = token?.role as string
            }
            return session

        }

    }
    ,

    pages: {
        signIn: "/login",
        error: "/login"
    },

    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60
    },
    secret: process.env.AUTH_SECRET
})

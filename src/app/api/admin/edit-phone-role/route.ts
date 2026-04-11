import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import User from "@/model/user.model";
// import { User } from "lucide-react";

export async function POST(req:NextRequest){
    try {
        await ConnectDb();
        const {role , phone} = await req.json();
        const session  = await auth();
        const user = await User.findOneAndUpdate({email:session?.user?.email} ,{role , phone} , {new:true});

        return NextResponse.json({
            data:user
        })

    } catch (error) {
        console.log("Edit-phone-role error", error);
        return NextResponse.json({
            status:500
        })

    }

}

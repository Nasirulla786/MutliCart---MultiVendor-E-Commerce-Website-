import ConnectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import User from "@/model/user.model";


export  async function POST(req:NextRequest){
    try {
        await ConnectDb();
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
          }
        const formdata = await req.formData();
        const name = formdata.get("name") as string;
        const file = formdata.get("image")  as File |null
        if (!name && !file) {
            return NextResponse.json({ message: "At least one field required" });
          }

        let imageURl;
        if(file){
            imageURl = await uploadOnCloudinary(file);
        }


       const updatedUser =   await User.findOneAndUpdate({email:session?.user?.email} ,{name , image:imageURl} , {new:true});



        return NextResponse.json(
            {  updatedUser },
            { status: 200 }
        )






    } catch (error) {
        console.log("Edit profile api error", error);
        return NextResponse.json(
            { message: "Internal server erorr" },
            { status: 500 }
        )


    }

}

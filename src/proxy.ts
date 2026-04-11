import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

export async function proxy(req:NextRequest){
    const pathName = req.nextUrl.pathname;
    const publicRoutes = ["/login" ,"/register"];
    if(publicRoutes.some((path)=>pathName.startsWith(path))){
        return NextResponse.next();
    }
    const session = await auth();
    if(!session || session==null){
        const loginUrl = new URL("/login" , req.url);
        loginUrl.searchParams.set("callbackurl" , req.url);
        return NextResponse.redirect(loginUrl);
    }


    return NextResponse.next();
}


export const  config={
    matcher: [
        "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)",
      ],

}

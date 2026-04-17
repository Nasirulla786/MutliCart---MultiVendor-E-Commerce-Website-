'use client'

import { useSession } from "next-auth/react"

export default function ProfilePage(){
    const session = useSession();
    console.log("this is seesion", session);

    return(
        <div>
            hello world
        </div>
    )
}

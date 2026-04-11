// 'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { auth } from "../../auth";

export default async function Home() {

  // const session = useSession();
  const session = await auth();
  console.log("this is session",session);
  return (
   <div>

   </div>
  );
}

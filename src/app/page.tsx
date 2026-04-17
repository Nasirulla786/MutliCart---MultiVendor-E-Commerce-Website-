import { useSession } from "next-auth/react";
import Image from "next/image";
import { auth } from "../../auth";
import ConnectDb from "@/lib/db";
import User from "@/model/user.model";
import { redirect } from "next/navigation";
import EditMobileRole from "./components/EditMobileRole";
import Nav from "./components/Nav";
import UserDash from "./(entities)/users/user-dashboard/page";
import VendorDash from "./(entities)/vendors/vendor-dashboard/page";
import AdminDash from "./(entities)/admin/admin-dashboard/page";
import EditShopDetais from "./(entities)/vendors/edit-shopDetails/page";

export default async function Home() {

  await ConnectDb();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email });
  if (!user) {
    redirect("/login");
  }


  // console.log("this is session",session?.user?.role);

  // console.log("this is aha" , user);
  const inComplete = !user.role || !user.phone;



  const plainData = JSON.parse(JSON.stringify(user));


  if(user?.role=="vendor"){
    const inComplete =!user.shopName || !user.shopAddress || !user.gstNumber;
    if(inComplete){
      return <EditShopDetais />

    }
  }




  if (inComplete) {
    return <EditMobileRole />
  }


  else {
    return <div className="w-screen  bg-gradient-to-tr from-black via-blue-950 to-black">
      <Nav user={plainData} />
      <div>
        {
          user.role == "admin" && <AdminDash />
        }
        {
          user.role == "vendor" && <VendorDash user={plainData} />
        }
        {
          user.role == "user" && <UserDash />
        }


      </div>
    </div>
  }


}

import { useRouter } from "next/navigation"

export default function VendorProductPage(){
    const router = useRouter();
    return(
        <div>
            <div onClick={()=>router.push("/vendors/Add-product")} className="w-[200px] h-[50px] bg-white">
                add product button
            </div>





            <div>
                map all products
            </div>

        </div>
    )
}

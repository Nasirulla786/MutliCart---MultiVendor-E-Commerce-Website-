"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { IUser } from "@/model/user.model";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const shopId = params.id?.toString();

  const { allVendorsData, allProductsData } = useSelector(
    (state: RootState) => state.vendors
  );

  console.log(allProductsData);

  // 🔥 FIND SHOP
  const shop :IUser= allVendorsData?.find(
    (v: any) => String(v._id) === String(shopId)
  );

  // ⏳ LOADING / NOT FOUND
  if (!shop) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#020617]">
        Shop loading or not found 😢
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-5 text-gray-300 hover:text-white"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* SHOP HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700"
      >
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src={shop?.image || "/def.jpg"}
            alt="shop"
            fill
            className="object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold mt-4 text-blue-400">
          {shop.shopName}
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          {shop.email}
        </p>
      </motion.div>

      {/* PRODUCTS */}
      <ShopProducts vendorId={shopId} allProductsData={allProductsData} />
    </div>
  );
}

/* ---------------- PRODUCTS ---------------- */

const ShopProducts = ({ vendorId, allProductsData }: any) => {

  // 🔥 FIX: safer filtering (string match)
  const products = allProductsData?.filter(
    (p: any) => String(p.vendor._id) === String(vendorId)
  );

  return (
    <div className="mt-8">

      <h2 className="text-xl font-semibold text-blue-400 mb-4">
        Products
      </h2>

      {products?.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          No products in this shop 😢
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {products?.map((p: any, i: number) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1e293b] p-4 rounded-xl border border-gray-700"
          >

            {/* IMAGE FIX */}
            <div className="relative w-full h-28 rounded overflow-hidden">
              <Image
                src={p?.image1 || "/def.jpg"}
                alt="product"
                fill
                className="object-cover"
              />
            </div>

            <h3 className="mt-2 text-sm font-semibold line-clamp-1">
              {p.title}
            </h3>

            <p className="text-blue-400 font-bold">
              ₹{p.price}
            </p>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const DEFAULT_IMG = "/def.jpg"; // public folder image

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const shopId = params.id?.toString();

  const { allVendorsData, allProductsData } = useSelector(
    (state: RootState) => state.vendors
  );

  const shop: any = allVendorsData?.find(
    (v: any) => String(v._id) === String(shopId)
  );

  if (!shop) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#020617]">
        Shop not found 😢
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 md:px-10 py-6">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* SHOP HEADER (PRO UI) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-white/10"
      >

        {/* IMAGE */}
        <div className="relative h-52 w-full">
          <Image
            src={shop?.image || DEFAULT_IMG}
            alt="shop"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* TEXT OVERLAY */}
        <div className="absolute bottom-0 p-5">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400">
            {shop.shopName}
          </h1>

          <p className="text-gray-300 text-sm mt-1">
            {shop.email || "No email available"}
          </p>

          <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            Verified Seller
          </span>
        </div>
      </motion.div>

      {/* PRODUCTS */}
      <ShopProducts vendorId={shopId} allProductsData={allProductsData} />
    </div>
  );
}

/* ---------------- PRODUCTS ---------------- */

const ShopProducts = ({ vendorId, allProductsData }: any) => {

  const products = allProductsData?.filter(
    (p: any) => String(p?.vendor?._id) === String(vendorId)
  );

  return (
    <div className="mt-10">

      <h2 className="text-xl font-semibold text-blue-400 mb-5">
        🛍️ Products
      </h2>

      {products?.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          <p>No products found in this shop 😢</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {products?.map((p: any, i: number) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition"
          >

            {/* IMAGE */}
            <div className="relative w-full h-36">
              <Image
                src={p?.image1 || DEFAULT_IMG}
                alt="product"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-3">

              <h3 className="text-sm font-semibold line-clamp-1">
                {p.title || "No Title"}
              </h3>

              <p className="text-blue-400 font-bold mt-1">
                ₹{p.price || 0}
              </p>

              <button className="mt-2 text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition">
                View Details
              </button>

            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

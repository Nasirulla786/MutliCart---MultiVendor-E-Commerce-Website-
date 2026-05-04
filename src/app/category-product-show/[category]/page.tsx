"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const DEFAULT_IMG = "/def.jpg";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const category = params.category?.toString();

  const { allProductsData } = useSelector(
    (state: RootState) => state.vendors
  );

  const filteredProducts = allProductsData?.filter(
    (p: any) =>
      p?.category?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 md:px-10 py-6">

      {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* 🔥 HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-400 capitalize">
          {category} Products 🚀
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          {filteredProducts?.length || 0} items found
        </p>
      </div>

      {/* 🛍️ GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {filteredProducts?.map((product: any, i: number) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.03 }}
            onClick={()=>router.push("/users/viewProduct/" + product?._id )}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden
                       hover:border-blue-500 cursor-pointer transition"
          >

            {/* IMAGE */}
            <div className="relative w-full h-36">
              <Image
                src={product?.image1 || DEFAULT_IMG}
                alt="product"
                fill
                className="object-cover hover:scale-110 transition duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-3">

              <h2 className="text-sm font-semibold line-clamp-2">
                {product.title || "No title"}
              </h2>

              <p className="text-blue-400 font-bold mt-1">
                ₹{product.price || 0}
              </p>

              <button className="mt-2 text-xs px-3 py-1 rounded-full
                                 bg-blue-500/20 text-blue-400
                                 hover:bg-blue-500/30 transition">
                View Product
              </button>

            </div>
          </motion.div>
        ))}

      </div>

      {/* ❌ EMPTY */}
      {filteredProducts?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <div className="text-5xl mb-2">😢</div>
          <p>No products found</p>
          <span className="text-xs text-gray-500">
            Try another category
          </span>
        </div>
      )}
    </div>
  );
}

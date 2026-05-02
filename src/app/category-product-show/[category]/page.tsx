"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const category = params.category?.toString();

  const { allProductsData } = useSelector(
    (state: RootState) => state.vendors
  );

  // ✅ FILTER
  const filteredProducts = allProductsData?.filter(
    (p: any) =>
      p.category?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 overflow-hidden">

      {/* 🔙 BACK BUTTON */}
      <motion.button
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg
                   bg-[#1e293b] border border-gray-700
                   hover:bg-[#334155] transition-all"
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back</span>
      </motion.button>

      {/* 🔥 HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-blue-400 mb-6 capitalize"
      >
        {category} Products 🚀
      </motion.h1>

      {/* 🔥 GRID */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        {filteredProducts?.map((product: any) => (
          <motion.div
            key={product._id}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-[#1e293b] p-4 rounded-xl border border-gray-700
                       hover:border-blue-500 transition-all duration-200
                       shadow-lg hover:shadow-blue-500/10"
          >
            {/* IMAGE */}
            <div className="overflow-hidden rounded-lg">
              <motion.img
                src={product.image1}
                className="w-full h-32 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* INFO */}
            <h2 className="mt-3 text-sm font-semibold line-clamp-2">
              {product.title}
            </h2>

            <p className="text-blue-400 font-bold mt-1">
              ₹{product.price}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ❌ EMPTY STATE */}
      {filteredProducts?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 mt-16 text-center"
        >
          No products found 😢
        </motion.div>
      )}
    </div>
  );
}

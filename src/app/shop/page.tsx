"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import def from "../../../public/def.jpg";
import { ArrowBigLeft } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const router = useRouter();

  const { allVendorsData } = useSelector(
    (state: RootState) => state.vendors
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">

      {/* BACK BUTTON */}
      <div
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer mb-5 w-fit"
      >
        <ArrowBigLeft />
        <span className="text-sm">Back</span>
      </div>

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-blue-400 mb-6"
      >
        🏪 All Shops
      </motion.h1>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {allVendorsData?.map((vendor: any, index: number) => (
          <motion.div
            key={vendor._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/shop-details/${vendor._id}`)}
            className="bg-[#1e293b] p-4 rounded-xl border border-gray-700
                       cursor-pointer hover:border-blue-500 transition-all"
          >

            {/* IMAGE FIXED */}
            <div className="w-full h-32 relative rounded overflow-hidden">
              <Image
                src={vendor?.image || def}
                alt="shop"
                fill
                className="object-cover"
              />
            </div>

            {/* INFO */}
            <h2 className="mt-2 font-semibold truncate">
              {vendor?.shopName || "Unknown Shop"}
            </h2>

            <p className="text-gray-400 text-sm truncate">
              {vendor?.email || "No email"}
            </p>

          </motion.div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {allVendorsData?.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No Shops Found 😢
        </p>
      )}
    </div>
  );
};

export default Page;

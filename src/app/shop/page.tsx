"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import def from "../../../public/def.jpg";
import { ArrowBigLeft, Search } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const { allVendorsData } = useSelector((state: RootState) => state.vendors);

  const [search, setSearch] = useState("");

  const filtered = allVendorsData?.filter((v: any) =>
    v?.shopName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 md:px-8 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        {/* BACK */}
        <div
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer w-fit"
        >
          <ArrowBigLeft />
          <span className="text-sm">Back</span>
        </div>

        {/* TITLE */}
        <h1 className="text-xl md:text-3xl font-bold text-blue-400">
          🏪 Discover Shops
        </h1>

        {/* SEARCH */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shops..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10
                       outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {filtered?.map((vendor: any, index: number) => (
          <motion.div
            key={vendor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => router.push(`/shop-details/${vendor._id}`)}
            className="group relative rounded-xl overflow-hidden cursor-pointer
                       bg-white/5 border border-white/10 hover:border-blue-500 transition"
          >

            {/* IMAGE */}
            <div className="relative h-40 w-full">
              <Image
                src={vendor?.image || def}
                alt="shop"
                fill
                className="object-cover group-hover:scale-110 transition duration-300"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-3">

              <h2 className="font-semibold truncate">
                {vendor?.shopName || "Unknown Shop"}
              </h2>

              <p className="text-gray-400 text-xs truncate">
                {vendor?.email || "No email"}
              </p>

              {/* BADGE */}
              <div className="mt-2">
                <span className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                  Verified Shop
                </span>
              </div>

            </div>
          </motion.div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-400">
          <div className="text-5xl mb-2">😢</div>
          <p>No shops found</p>
          <span className="text-xs text-gray-500">Try different search</span>
        </div>
      )}

    </div>
  );
};

export default Page;

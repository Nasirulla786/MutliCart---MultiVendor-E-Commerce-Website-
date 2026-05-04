"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const router = useRouter();

  const categories = [
    { name: "Electronics", color: "from-blue-500 to-cyan-400" },
    { name: "Fashion", color: "from-pink-500 to-rose-400" },
    { name: "Fitness", color: "from-red-500 to-orange-400" },
    { name: "Home", color: "from-green-500 to-emerald-400" },
    { name: "Gaming", color: "from-purple-500 to-indigo-400" },
    { name: "Beauty", color: "from-yellow-500 to-amber-400" },
    { name: "Books", color: "from-indigo-500 to-blue-400" },
    { name: "Others", color: "from-gray-500 to-slate-400" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white px-5 md:px-10 py-6">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-400">
          Browse Categories 🚀
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Explore trending categories and discover products
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              router.push(`/category-product-show/${cat.name.toLowerCase()}`)
            }
            className={`relative overflow-hidden rounded-2xl cursor-pointer
                        p-6 border border-white/10
                        bg-gradient-to-br ${cat.color}
                        shadow-lg hover:shadow-xl transition`}
          >

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/30" />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3">

              {/* ICON CIRCLE */}
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>

              {/* NAME */}
              <h2 className="text-sm font-semibold text-white">
                {cat.name}
              </h2>

              {/* SUB TEXT */}
              <p className="text-[10px] text-white/70">
                Explore now
              </p>

            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default Page;

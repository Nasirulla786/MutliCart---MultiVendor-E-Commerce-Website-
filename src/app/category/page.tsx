"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export type Category = {
  name: string;
  color: string;
  icon: React.ReactNode;
};

const Page = () => {
  const router = useRouter();

  const categories: Category[] = [
    {
      name: "Electronics",
      color: "blue",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
    },
    {
      name: "Fashion",
      color: "pink",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      name: "Fitness",
      color: "red",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
        </svg>
      ),
    },
    {
      name: "Home",
      color: "green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
    },
    {
      name: "Gaming",
      color: "purple",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <circle cx="12" cy="12" r="8" />
        </svg>
      ),
    },
    {
      name: "Beauty",
      color: "yellow",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M12 3a6 6 0 0 0 9 9" />
        </svg>
      ),
    },
    {
      name: "Books",
      color: "indigo",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        </svg>
      ),
    },
    {
      name: "Others",
      color: "gray",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
          <rect x="3" y="3" width="7" height="7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}

      {/* 🔙 BACK BUTTON */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 relative right-0 my-5  text-gray-300 hover:text-white"
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>

      {/* 🧠 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-400">
          Browse Categories 🚀
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Choose a category and explore products
        </p>
      </motion.div>

      {/* 🧩 GRID */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              router.push(`/category-product-show/${cat.name.toLowerCase()}`)
            }
            className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700
                       hover:border-blue-500 cursor-pointer transition-all duration-200
                       flex flex-col items-center justify-center gap-3
                       shadow-lg hover:shadow-blue-500/10"
          >
            <div className={`text-${cat.color}-400`}>
              {cat.icon}
            </div>

            <h2 className="text-sm font-semibold text-center">
              {cat.name}
            </h2>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Page;

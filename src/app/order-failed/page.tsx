"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Page() {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowDetails(true);
    }, 1200);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center overflow-hidden relative">

      {/* 🔴 BACKGROUND PULSE */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 2 }}
        transition={{ duration: 1.2 }}
        className="absolute w-40 h-40 bg-red-500/20 rounded-full blur-3xl"
      />

      {/* ❌ ERROR ICON */}
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="z-10 flex flex-col items-center"
      >
        <XCircle className="text-red-500 drop-shadow-lg" size={100} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold mt-4 text-red-400"
        >
          Order Failed ❌
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 text-sm mt-2 text-center"
        >
          Payment was not completed or something went wrong.
        </motion.p>
      </motion.div>

      {/* 📦 DETAILS POPUP */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed bottom-0 left-0 w-full bg-[#1e293b] rounded-t-3xl p-6 shadow-2xl z-20"
          >
            <h2 className="text-lg font-semibold text-red-400 mb-4">
              What can you do?
            </h2>

            <div className="space-y-3 text-sm text-gray-300">
              <p>• Check your internet connection</p>
              <p>• Try a different payment method</p>
              <p>• Ensure sufficient balance</p>
              <p>• Retry placing the order</p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => (window.location.href = "/cart")}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg"
              >
                Retry Payment
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

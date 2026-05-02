"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center overflow-hidden relative">

      {/* 🔥 BACKGROUND PULSE */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 2 }}
        transition={{ duration: 1.2 }}
        className="absolute w-40 h-40 bg-green-500/20 rounded-full blur-3xl"
      />

      {/* ✅ SUCCESS ICON */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="z-10 flex flex-col items-center"
      >
        <CheckCircle className="text-green-500 drop-shadow-lg" size={100} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold mt-4 text-green-400"
        >
          Order Successful 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 text-sm mt-2 text-center"
        >
          Your payment has been processed successfully.
        </motion.p>
      </motion.div>

      {/* 📦 SIMPLE POPUP */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed bottom-0 left-0 w-full bg-[#1e293b] rounded-t-3xl p-6 shadow-2xl z-20"
          >
            <h2 className="text-lg font-semibold text-blue-400 mb-3">
              🎉 Thank you for your order!
            </h2>

            <p className="text-gray-300 text-sm">
              Your order has been placed successfully. You can track your order from your orders section.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => (window.location.href = "/orders")}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
              >
                View Orders
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

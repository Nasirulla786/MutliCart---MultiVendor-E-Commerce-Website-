"use client";

import { IProduct } from "@/model/product.model";
import React, { useState } from "react";
import { motion } from "framer-motion";

// ─── CUSTOMIZE HERE ──────────────────────────────────
const ACCENT_COLOR = "#4f46e5";        // main brand color (indigo)
const ACCENT_GRADIENT = "linear-gradient(135deg, #4f46e5, #7c3aed)";
const BADGE_COLOR = "#22c55e";         // free delivery badge
// ─────────────────────────────────────────────────────

interface Props {
  product: IProduct;

}

const ProductCart = ({ product}: Props) => {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    setAdded(true);

  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}
    >
      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden h-56 bg-gray-100">
        <motion.img
          src={product.image1}
          alt={product.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />

        {/* Free Delivery Badge */}
        {product.freeDelivery && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: BADGE_COLOR }}
          >
            Free Delivery
          </span>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setWishlist(!wishlist)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-base shadow-md bg-white/90 hover:bg-white transition"
        >
          {wishlist ? "❤️" : "🤍"}
        </motion.button>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-wide bg-black/60 px-4 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── BODY ── */}
      <div className="p-4">

        {/* Title */}
        <h2 className="font-bold text-gray-900 text-[15px] truncate leading-snug">
          {product.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Price + COD */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-extrabold" style={{ color: ACCENT_COLOR }}>
            ₹{product.price}
          </span>
          {product.payOnDelivery && (
            <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
              COD
            </span>
          )}
        </div>

        {/* Sizes */}
        { product.sizes && product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.sizes.map((size: string, i: number) => (
              <span
                key={i}
                className="text-[11px] border border-gray-200 rounded-md px-2 py-0.5 text-gray-500 font-medium hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 cursor-pointer transition"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Stock + Add to Cart */}
        <div className="flex items-center justify-between mt-4">

          {/* Stock Status */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: product.stock > 0 ? "#22c55e" : "#ef4444" }}
            />
            <span style={{ color: product.stock > 0 ? "#22c55e" : "#ef4444" }}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: added ? "#22c55e" : product.stock === 0 ? "#ccc" : ACCENT_GRADIENT,
              boxShadow: product.stock > 0 ? "0 4px 14px rgba(79,70,229,0.3)" : "none",
            }}
          >
            {added ? "✓ Added!" : "🛒 Add"}
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCart;

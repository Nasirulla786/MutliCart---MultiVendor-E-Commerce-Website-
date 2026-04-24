"use client";

import { IProduct } from "@/model/product.model";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";


// ─── CUSTOMIZE HERE ──────────────────────────────────
const ACCENT_COLOR = "#4f46e5";
const ACCENT_GRADIENT = "linear-gradient(135deg, #4f46e5, #7c3aed)";
const BADGE_COLOR = "#22c55e";
// ─────────────────────────────────────────────────────

interface Props {
  product: IProduct;
}

const ProductCart = ({ product }: Props) => {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ ADD TO CART
  const handleAddToCart = async () => {
    try {
      if (product.stock === 0) return;

      setLoading(true);

      const res = await axios.post("/api/user/cart/add", {
        productId: product._id,
        quantity: 1,
      });


      setAdded(true);

    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden h-56 bg-gray-100"

        onClick={() => router.push("/users/viewProduct/" + product?._id.toString())}

      >
        <motion.img
          src={product.image1}
          alt={product.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
        />

        {/* Free Delivery */}
        {product.freeDelivery && (
          <span
            className="absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full"
            style={{ background: BADGE_COLOR }}
          >
            Free Delivery
          </span>
        )}

        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setWishlist(!wishlist)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center"
        >
          {wishlist ? "❤️" : "🤍"}
        </motion.button>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="p-4">

        <h2 className="font-bold text-sm truncate">
          {product.title}
        </h2>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-bold" style={{ color: ACCENT_COLOR }}>
            ₹{product.price}
          </span>

          {product.payOnDelivery && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
              COD
            </span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.map((size, i) => (
              <span
                key={i}
                className="text-[11px] border px-2 py-0.5 rounded"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="flex items-center justify-between mt-4">

          <span
            className="text-xs font-semibold"
            style={{
              color: product.stock > 0 ? "#22c55e" : "#ef4444"
            }}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
            className="text-white text-xs px-4 py-2 rounded-xl"
            style={{
              background: added
                ? "#22c55e"
                : product.stock === 0
                  ? "#ccc"
                  : ACCENT_GRADIENT,
            }}
          >
            {loading ? "..." : added ? "✓ Added" : "🛒 Add"}
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCart;

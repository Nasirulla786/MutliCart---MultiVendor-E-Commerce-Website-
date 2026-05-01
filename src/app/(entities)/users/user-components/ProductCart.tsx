"use client";

import { IProduct } from "@/model/product.model";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ACCENT_COLOR = "#4f46e5";
const BADGE_COLOR = "#22c55e";

interface Review {
  rating: number;
}

interface Props {
  product: IProduct & {
    reviews?: Review[];
  };
}

const ProductCart = ({ product }: Props) => {
  const [wishlist, setWishlist] = useState(false);
  const router = useRouter();
  console.log("prodffjksjsnd",product)

  // ⭐ Average Rating
  const avgRating =
    product?.reviews?.length
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  const renderStars = (rating = 0) =>
    [1, 2, 3, 4, 5].map((i) => (
      <span key={i}>{i <= Math.round(rating) ? "⭐" : "☆"}</span>
    ));

  return (
<motion.div
  initial={{ opacity: 0, y: 30, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 30, scale: 0.95 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
  whileHover={{ scale: 1.04 }}
  className="bg-white rounded-2xl overflow-hidden w-full h-full flex flex-col shadow-md"
>
      {/* IMAGE */}
      <div
        className="relative h-48 cursor-pointer"
        onClick={() =>
          router.push("/users/viewProduct/" + product?._id?.toString())
        }
      >
        <img
          src={product?.image1}
          className="w-full h-full object-cover"
        />

        {product?.freeDelivery && (
          <span
            className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded"
            style={{ background: BADGE_COLOR }}
          >
            Free
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlist(!wishlist);
          }}
          className="absolute top-2 right-2 bg-white p-2 rounded-full"
        >
          {wishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 flex flex-col flex-1">

        <h2 className="font-semibold truncate">
          {product?.title}
        </h2>

        {/* ⭐ Rating */}
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          {renderStars(avgRating)}
          <span className="text-gray-500 ml-2 text-xs">
            ({product?.reviews?.length || 0})
          </span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mt-1">
          {product?.description}
        </p>

        {/* PRICE */}
        <div className="mt-2 font-bold" style={{ color: ACCENT_COLOR }}>
          ₹{product?.price}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-3 flex justify-between items-center">
          <span
            className={`text-sm ${
              product?.stock > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {product?.stock > 0 ? "In Stock" : "Out"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCart;

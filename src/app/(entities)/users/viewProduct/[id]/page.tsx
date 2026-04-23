"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { IProduct } from "@/model/product.model";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { allProductsData } = useSelector((state: RootState) => state.vendors);

  const product = allProductsData.find(
    (p: IProduct) => p._id?.toString() === id
  ) as IProduct | undefined;;

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
const [reviewComment, setReviewComment] = useState<string>("");
const [reviewImage, setReviewImage] = useState<File | null>(null);
const [reviewPreviewImagePreview, setReviewPreviewImage] = useState<string | null>(null);
  const imageCLick = useRef<HTMLInputElement>(null)



  if (!product) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Product not found
      </div>
    );
  }

  // ✅ Always string[]
  const images: string[] = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter((img): img is string => Boolean(img));

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
              <Image
                src={images[activeImg] ?? "/fallback.png"}
                alt="product"
                fill
                className="object-cover"
              />

              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full"
              >
                {wishlist ? "❤️" : "🤍"}
              </button>

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
                  Out of Stock
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border ${
                    activeImg === i ? "border-indigo-500" : ""
                  }`}
                >
                  <Image src={img} alt="" width={64} height={64} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>

            <p className="text-gray-500 text-sm mt-1">
              {product.description}
            </p>

            <p className="text-3xl font-bold text-indigo-600 mt-3">
              ₹{Number(product.price).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {product.freeDelivery && (
                <span className="text-xs bg-green-100 px-2 py-1 rounded">
                  Free Delivery
                </span>
              )}
              {product.payOnDelivery && (
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                  COD
                </span>
              )}
            </div>

            {(product.sizes ?? []).length > 0 && (
              <div className="mt-4">
                <p className="text-sm mb-2">Select Size</p>
                <div className="flex gap-2">
                  {(product.sizes ?? []).map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 border rounded ${
                        selectedSize === s
                          ? "border-indigo-500 text-indigo-600"
                          : ""
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-sm font-semibold">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setWishlist(!wishlist)}
                className="flex-1 border py-2 rounded"
              >
                {wishlist ? "❤️ Wishlisted" : "🤍 Wishlist"}
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-indigo-600 text-white py-2 rounded disabled:bg-gray-400"
              >
                {added ? "✓ Added" : "Add to Cart"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* REVIEW PLACEHOLDER */}
       <div className="mt-10 bg-white rounded-xl p-6 border">
  <h2 className="text-lg font-bold mb-4">Write Review</h2>

  {/* ⭐ Stars */}
  <div className="flex gap-1 mb-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        onClick={() => setReviewRating(i)}
        className="cursor-pointer text-xl"
      >
        {i <= reviewRating ? "⭐" : "☆"}
      </span>
    ))}
  </div>

  {/* 📝 Textarea */}
  <textarea
    value={reviewComment}
    onChange={(e) => setReviewComment(e.target.value)}
    placeholder="Do review..."
    className="w-full border rounded p-2 text-sm mb-3"
  />

  {/* 📁 File input */}
  <input
    type="file"
    hidden
    ref={imageCLick}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setReviewPreviewImage(URL.createObjectURL(file));
      setReviewImage(file);
    }}
  />

  {/* Button */}
  <div
    onClick={() => imageCLick.current?.click()}
    className="cursor-pointer text-sm text-blue-600"
  >
    Choose file
  </div>

  {/* Preview */}
  {reviewPreviewImagePreview && (
    <img
      src={reviewPreviewImagePreview}
      alt="preview"
      className="mt-3 w-24 h-24 object-cover rounded"
    />
  )}
</div>

      </div>
    </div>
  );
};

export default ProductDetailPage;

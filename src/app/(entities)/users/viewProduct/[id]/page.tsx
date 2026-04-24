"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { IProduct } from "@/model/product.model";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";

const ProductDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { allProductsData } = useSelector((state: RootState) => state.vendors);

  const product = allProductsData.find(
    (p: IProduct) => p._id?.toString() === id
  ) as IProduct | undefined;

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  // REVIEW STATES
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewPreviewImage, setReviewPreviewImage] = useState<string | null>(null);
  const [currentReviews, setCurrentReviews] = useState<any[]>([]);

  const imageClick = useRef<HTMLInputElement>(null);

  // LOAD REVIEWS INITIALLY
  useEffect(() => {
    if (product?.reviews) {
      setCurrentReviews(product.reviews);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center mt-20 text-gray-400">Product not found</div>;
  }

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

  // ✅ REVIEW SUBMIT
  const handleReview = async () => {
    try {
      if (!reviewRating) return alert("Select rating");
      if (!reviewComment) return alert("Write comment");

      const formData = new FormData();
      formData.append("id", id as string);
      formData.append("comment", reviewComment);
      formData.append("rating", reviewRating.toString());

      if (reviewImage) {
        formData.append("image", reviewImage);
      }

      const res = await axios.post("/api/user/add-review", formData);

      const updatedProduct = res.data.product;

      setCurrentReviews(updatedProduct.reviews || []);

      // reset
      setReviewRating(0);
      setReviewComment("");
      setReviewImage(null);
      setReviewPreviewImage(null);

    } catch (err: any) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">

        {/* PRODUCT SECTION */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT IMAGE */}
          <div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
              <Image src={images[activeImg] ?? "/fallback.png"} alt="" fill className="object-cover" />

              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full"
              >
                {wishlist ? "❤️" : "🤍"}
              </button>
            </div>

            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}>
                  <Image src={img} alt="" width={60} height={60} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>

            <p className="text-3xl font-bold text-indigo-600 mt-3">
              ₹{Number(product.price).toLocaleString()}
            </p>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setWishlist(!wishlist)} className="flex-1 border py-2 rounded">
                Wishlist
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white py-2 rounded"
              >
                {added ? "✓ Added" : "Add to Cart"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* WRITE REVIEW */}
        <div className="mt-10 bg-white p-6 rounded-xl">
          <h2 className="font-bold mb-3">Write Review</h2>

          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(i => (
              <span key={i} onClick={()=>setReviewRating(i)}>
                {i <= reviewRating ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <textarea
            value={reviewComment}
            onChange={(e)=>setReviewComment(e.target.value)}
            className="w-full border p-2 mb-2"
          />

          <input
            type="file"
            hidden
            ref={imageClick}
            onChange={(e)=>{
              const file = e.target.files?.[0];
              if (!file) return;
              setReviewImage(file);
              setReviewPreviewImage(URL.createObjectURL(file));
            }}
          />

          <button onClick={()=>imageClick.current?.click()} className="text-blue-500">
            Upload Image
          </button>

          {reviewPreviewImage && (
            <img src={reviewPreviewImage} className="w-20 mt-2" />
          )}

          <button
            onClick={handleReview}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>

        {/* SHOW REVIEWS */}
        <div className="mt-10 bg-white p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

          {currentReviews.length === 0 && (
            <p className="text-gray-400">No reviews yet</p>
          )}

          {currentReviews.map((rev, i) => (
            <div key={i} className="border-b py-4">
              <div className="flex justify-between">
                <p className="font-semibold">
                  {rev?.user?.name || "User"}
                </p>
                <span>{"⭐".repeat(rev.rating)}</span>
              </div>

              <p className="text-gray-600 text-sm mt-1">
                {rev.comment}
              </p>

              {rev.image && (
                <img src={rev.image} className="w-20 mt-2 rounded" />
              )}

              <p className="text-xs text-gray-400 mt-1">
                {["2 days ago","1 week ago","3 hours ago"][i % 3]}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;

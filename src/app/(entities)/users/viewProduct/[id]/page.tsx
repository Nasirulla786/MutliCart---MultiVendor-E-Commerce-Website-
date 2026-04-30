//@ts-nocheck
"use client";


import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { IProduct } from "@/model/product.model";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

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
  const [quantity, setQuantity] = useState(1)

  // LOAD REVIEWS INITIALLY
  useEffect(() => {
    if (product?.reviews) {
      setCurrentReviews(product.reviews);
    }
  }, [product]);

  if (!product) {
    return <div className="text-center mt-20 text-gray-400">Product not found</div>;
  }

  const router = useRouter();

  const images: string[] = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter((img): img is string => Boolean(img));

  const handleAddToCart = async () => {
    const res = await axios.post("/api/user/cart/add" ,{productId :id ,quantity})
    setAdded(true);
    toast.success("Item added check in your cart")
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
    <div className="bg-[#181818] min-h-screen py-8 text-[#e0e0e0]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Product Card Section */}
        <div className="flex flex-col md:flex-row gap-10 bg-[#232323] rounded-2xl shadow-lg p-6">
          {/* Image Gallery */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#111] border border-[#333]">
              <Image src={images[activeImg] ?? "/fallback.png"} alt="Product" fill className="object-cover" />
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-3 right-3 bg-[#232323] border border-[#333] p-2 rounded-full shadow hover:bg-[#333] transition"
                aria-label="Add to wishlist"
              >
                {wishlist ? "❤️" : "🤍"}
              </button>
            </div>
            <div className="flex gap-2 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`rounded-lg border-2 ${activeImg === i ? 'border-[#e0e0e0]' : 'border-[#333]'} overflow-hidden`}
                  aria-label={`Show image ${i+1}`}
                >
                  <Image src={img} alt="thumb" width={56} height={56} className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-1">{product.title}</h1>
            <div className="flex items-center gap-2 text-yellow-400 text-lg">
              <span className="font-semibold">4.5</span>
              <span>★</span>
              <span className="text-xs text-[#aaa]">(128 reviews)</span>
            </div>
            <p className="text-[#bdbdbd] text-base mb-2">{product.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-2xl font-bold text-[#90ee90]">₹{Number(product.price).toLocaleString()}</span>
              <span className="text-xs text-[#aaa] line-through">₹{Number(product.price * 1.2).toLocaleString()}</span>
              <span className="text-xs text-green-400">20% off</span>
            </div>
            {/* Size Selection */}
            <div className="mt-3">
              <div className="text-sm mb-1 text-[#aaa]">SELECT SIZE</div>
              <div className="flex gap-2">
                {["S","M","L","XL","XXL"].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1 rounded border ${selectedSize === size ? 'bg-[#90ee90] text-black border-[#90ee90]' : 'border-[#333] text-[#e0e0e0]'} font-semibold transition`}
                  >{size}</button>
                ))}
              </div>
            </div>
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-[#aaa]">QUANTITY</span>
              <div className="flex items-center border border-[#333] rounded">
                <button onClick={()=>setQuantity(q=>q>1?q-1:1)} className="px-2 py-1">-</button>
                <span className="px-3 py-1 min-w-[24px] text-center">{quantity}</span>
                <button onClick={()=>setQuantity(q=>q+1)} className="px-2 py-1">+</button>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#90ee90] text-black font-bold py-2 rounded shadow hover:bg-[#b2ffb2] transition"
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </motion.button>
              <button className="flex-1 bg-[#232323] border border-[#90ee90] text-[#90ee90] flex ite' justify-center gap-2 font-bold py-2 rounded shadow hover:bg-[#333] transition" onClick={()=>router.push("/cart")}>
               <ShoppingBag /> <span>Check Cart</span>
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-[#232323] border border-[#333] text-[#e0e0e0] py-2 rounded hover:bg-[#333] transition">Add to Wishlist</button>
              <button className="flex-1 bg-[#232323] border border-[#333] text-[#e0e0e0] py-2 rounded hover:bg-[#333] transition">Share</button>
            </div>
          </div>
        </div>

        {/* Review Summary Section */}
        <div className="mt-10 bg-[#232323] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Rating Overview */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-yellow-400">4.5</div>
              <div className="flex gap-1 text-2xl text-yellow-400 mb-1">{'★'.repeat(4)}<span className="text-[#444]">★</span></div>
              <div className="text-sm text-[#aaa]">128 ratings</div>
            </div>
            {/* Rating Breakdown */}
            <div className="flex-[2] flex flex-col gap-2 justify-center">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-6 text-sm text-[#aaa]">{star}★</span>
                  <div className="flex-1 h-2 bg-[#333] rounded">
                    <div className={`h-2 rounded bg-yellow-400`} style={{width: `${star*20/5}%`}}></div>
                  </div>
                  <span className="w-8 text-xs text-[#aaa]">{star*20}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Write Review Section */}
        <div className="mt-10 bg-[#232323] p-6 rounded-2xl shadow-lg">
          <h2 className="font-bold mb-3 text-lg">Write a Review</h2>
          <div className="flex gap-2 mb-2">
            {[1,2,3,4,5].map(i => (
              <span
                key={i}
                onClick={()=>setReviewRating(i)}
                className={`cursor-pointer text-2xl ${i <= reviewRating ? 'text-yellow-400' : 'text-[#444]'}`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e)=>setReviewComment(e.target.value)}
            className="w-full bg-[#181818] border border-[#333] rounded p-2 mb-2 text-[#e0e0e0]"
            placeholder="Share your experience with this product..."
          />
          <div className="flex items-center gap-3 mb-2">
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
            <button onClick={()=>imageClick.current?.click()} className="px-3 py-1 bg-[#333] rounded text-[#e0e0e0] border border-[#444] hover:bg-[#444] transition">Add a photo</button>
            {reviewPreviewImage && (
              <img src={reviewPreviewImage} className="w-16 h-16 object-cover rounded border border-[#333]" />
            )}
          </div>
          <button
            onClick={handleReview}
            className="mt-2 bg-[#90ee90] text-black px-6 py-2 rounded font-bold shadow hover:bg-[#b2ffb2] transition"
          >
            Submit
          </button>
        </div>

        {/* Reviews List Section */}
        <div className="mt-10 bg-[#232323] p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>
          {currentReviews.length === 0 && (
            <p className="text-[#888]">No reviews yet</p>
          )}
          <div className="flex flex-col gap-6">
            {currentReviews.map((rev, i) => (
              <div key={i} className="flex gap-4 border-b border-[#333] pb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#181818] flex items-center justify-center text-xl font-bold text-[#90ee90]">
                  {rev?.user?.name ? rev.user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#e0e0e0]">{rev?.user?.name || "User"}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p className="text-[#bdbdbd] text-sm mt-1">{rev.comment}</p>
                  {rev.image && (
                    <img src={rev.image} className="w-20 mt-2 rounded border border-[#333]" />
                  )}
                  <p className="text-xs text-[#888] mt-1">{["2 days ago","1 week ago","3 hours ago"][i % 3]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

import img1 from "../../../../../public/slider1.png"
import img2 from "../../../../../public/slider2.png"
import img3 from "../../../../../public/slider3.png"

// mobile images
import mobImg1 from "../../../../../public/Graphic Design Clothing.jpg"
import mobImg2 from "../../../../../public/Flyers promo.jpg"
import mobImg3 from "../../../../../public/jewl.jpg"

import SliderCom from "../user-components/SliderCom"
import { useSelector } from "react-redux"
import { RootState } from "@/app/redux/store"
import { IProduct } from "@/model/product.model"
import ProductCart from "../user-components/ProductCart"
import Loading from "@/app/components/Loading"

export default function UserDash() {

  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const { allProductsData } = useSelector((state: RootState) => state.vendors)

  const approveProducts = Array.isArray(allProductsData)
    ? allProductsData.filter(
        (item: IProduct) => item.isActive == true && item.isApproved == true
      )
    : []

  const sliderData = [
    {
      desktopImage: img1,
      mobileImage: mobImg1,
      title: "Premium Black Collection",
      subtitle: "Minimal. Bold. Stylish.",
      description: "Discover our latest black outfits designed for comfort and style.",
      button: "Explore Now"
    },
    {
      desktopImage: img2,
      mobileImage: mobImg2,
      title: "Gaming Essentials",
      subtitle: "Level Up Your Setup",
      description: "High-performance gaming laptops and accessories.",
      button: "Explore Now"
    },
    {
      desktopImage: img3,
      mobileImage: mobImg3,
      title: "Everything You Need",
      subtitle: "All in One Store",
      description: "From fashion to gadgets, shop the best products.",
      button: "Explore Now"
    }
  ]

  // ✅ detect mobile screen
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreen()
    window.addEventListener("resize", checkScreen)

    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  // auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full">

      {/* ================= SLIDER ================= */}
      <div className="w-[95%] mx-auto mt-5 h-[75vh] md:h-[88vh] rounded-3xl overflow-hidden relative shadow-2xl">

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute w-full h-full"
          >

            {/* IMAGE */}
            <Image
              src={sliderData[current].desktopImage}
              alt="slider"
              fill
              className="object-cover hidden md:block"
            />

            <Image
              src={sliderData[current].mobileImage}
              alt="slider mobile"
              fill
              className="object-cover block md:hidden"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center px-6 md:px-16">

              <motion.div
                key={sliderData[current].title}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
              >

                <span className="px-3 py-1 text-xs md:text-sm bg-white/10 border border-white/20 rounded-full text-white/80 backdrop-blur-md">
                  ✨ Featured Collection
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-white mt-3">
                  {sliderData[current].title}
                </h1>

                <h2 className="text-base md:text-2xl mt-3 text-gray-200">
                  {sliderData[current].subtitle}
                </h2>

                <p className="mt-3 text-sm md:text-base text-gray-300">
                  {sliderData[current].description}
                </p>

                <button className="mt-6 px-6 py-3 bg-white text-black rounded-full font-semibold">
                  {sliderData[current].button}
                </button>

              </motion.div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* ================= THUMBNAILS (FIXED) ================= */}
        <div className="absolute bottom-4 right-4 flex gap-3">

          {sliderData.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative w-16 h-12 md:w-28 md:h-16 rounded-xl overflow-hidden cursor-pointer transition-all border
              ${
                current === index
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >

              {/* ✅ IMPORTANT FIX HERE */}
              <Image
                src={isMobile ? item.mobileImage : item.desktopImage}
                alt="thumb"
                fill
                className="object-cover"
              />

              {current === index && (
                <div className="absolute inset-0 bg-white/10" />
              )}

            </div>
          ))}

        </div>

      </div>

      {/* ================= SLIDER COMPONENT ================= */}
      <div className="w-[95%] mx-auto mt-4">
        <SliderCom />
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="w-[95%] mx-auto mt-6 pb-10">

        {approveProducts.length === 0 ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">

            {approveProducts.map((item: IProduct, index: number) => (
              <motion.div
                key={item._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCart product={item} />
              </motion.div>
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

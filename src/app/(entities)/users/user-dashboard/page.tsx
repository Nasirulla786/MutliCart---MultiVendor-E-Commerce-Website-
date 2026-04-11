'use client'
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

import img1 from "../../../../../public/cloth.png"
import img2 from "../../../../../public/gaming.png"
import img3 from "../../../../../public/phone.png"

export default function UserDash() {

    const [current, setCurrent] = useState(0)

    const sliderData = [
        {
            image: img1,
            title: "Premium Black Collection",
            subtitle: "Minimal. Bold. Stylish.",
            description: "Discover our latest black outfits designed for comfort and style.",
            button: "Explore Now"
        },
        {
            image: img2,
            title: "Gaming Essentials",
            subtitle: "Level Up Your Setup",
            description: "High-performance gaming laptops and accessories.",
            button: "Explore Now"
        },
        {
            image: img3,
            title: "Everything You Need",
            subtitle: "All in One Store",
            description: "From fashion to gadgets, shop the best products.",
            button: "Explore Now"
        }
    ]

    // 🔥 Auto Slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % sliderData.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-[95%] h-[88vh] mt-5 ml-5 rounded-2xl overflow-hidden relative">

            {/* 🔥 SLIDER */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute w-full h-full"
                >
                    {/* Background Image */}
                    <Image
                        src={sliderData[current].image}
                        alt="slider"
                        fill
                        className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white">

                        {/* LEFT TEXT */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="max-w-xl"
                        >
                            <h1 className="text-3xl md:text-5xl font-bold">
                                {sliderData[current].title}
                            </h1>

                            <h2 className="text-lg md:text-2xl mt-2 text-gray-300">
                                {sliderData[current].subtitle}
                            </h2>

                            <p className="mt-3 text-sm md:text-base text-gray-400">
                                {sliderData[current].description}
                            </p>
                        </motion.div>

                        {/* CENTER BUTTON */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                            <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
                                {sliderData[current].button}
                            </button>
                        </div>

                    </div>
                </motion.div>
            </AnimatePresence>

            {/* 🔥 BOTTOM RIGHT THUMBNAILS */}
            <div className="absolute bottom-4 right-4 flex gap-3">

                {sliderData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`relative w-20 h-14 md:w-28 md:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                        ${current === index ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                        <Image
                            src={item.image}
                            alt="thumb"
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}

            </div>

        </div>
    )
}

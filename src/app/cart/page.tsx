'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const Page = () => {
    const [cartItems, setCartItems] = useState([])

    // ✅ Fetch Cart
    const fetchCart = async () => {
        const res = await axios.get("/api/user/cart/get")
        setCartItems(res.data.cart)
    }

    useEffect(() => {
        fetchCart()
    }, [])

    // ❌ Quantity update removed (not needed now)

    // ✅ Remove Item
    const removeItem = async (productId) => {
        await axios.post("/api/user/cart/remove", { productId })
        fetchCart()
    }

    // ✅ Total Price
    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + item.product.price * item.quantity
    }, 0)

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 md:px-10 py-8">

            {/* Heading */}
            <h1 className="text-3xl font-bold mb-8 text-blue-400">
                🛒 My Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* 🔥 LEFT SIDE */}
                <div className="flex-1 space-y-5">

                    {cartItems.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            Cart is empty 😢
                        </div>
                    )}

                    <AnimatePresence>
                        {cartItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col sm:flex-row gap-4 bg-[#1e293b] p-4 rounded-2xl shadow-md hover:shadow-xl transition"
                            >

                                {/* Image */}
                                <div className="w-full sm:w-28 h-28 relative rounded-xl overflow-hidden bg-[#111]">
                                    <Image
                                        src={item?.product?.image1}
                                        alt="product"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">

                                    <div>
                                        <h2 className="text-lg font-semibold text-blue-300">
                                            {item.product.title}
                                        </h2>

                                        <p className="text-gray-400 text-sm mt-1">
                                            ₹{item.product.price}
                                        </p>

                                        <p className="text-sm mt-1 text-gray-300">
                                            Total: ₹{item.product.price * item.quantity}
                                        </p>
                                    </div>

                                    {/* 🔥 Controls (Quantity only) */}
                                    <div className="flex items-center justify-between mt-4">

                                        <div className="text-sm text-gray-300">
                                            Quantity: <span className="font-bold">{item.quantity}</span>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            className="text-red-400 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 🔥 RIGHT SIDE */}
                <div className="w-full lg:w-[350px]">

                    <div className="sticky top-6 bg-[#1e293b] p-6 rounded-2xl shadow-lg">

                        <h2 className="text-xl font-semibold mb-5 text-blue-400">
                            Order Summary
                        </h2>

                        <div className="flex justify-between mb-3 text-gray-300">
                            <span>Total Items</span>
                            <span>{cartItems.length}</span>
                        </div>

                        <div className="flex justify-between mb-3 text-gray-300">
                            <span>Total Price</span>
                            <span>₹{totalPrice}</span>
                        </div>

                        <div className="flex justify-between mb-3">
                            <span>Delivery</span>
                            <span className="text-green-400">Free</span>
                        </div>

                        <hr className="my-4 border-gray-600" />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Final Total</span>
                            <span>₹{totalPrice}</span>
                        </div>

                        {/* Checkout */}
                        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-lg font-semibold transition">
                            Checkout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Page

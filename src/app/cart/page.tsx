'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Page = () => {
    const [cartItems, setCartItems] = useState([])
    const router = useRouter()

    const fetchCart = async () => {
        const res = await axios.get("/api/user/cart/get")
        setCartItems(res.data.cart)
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const removeItem = async (productId:any) => {
        await axios.post("/api/user/cart/remove", { productId })
        fetchCart()
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 md:px-10 py-8">

            <h1 className="text-3xl font-bold mb-8 text-blue-400">
                🛒 My Cart
            </h1>

            {cartItems.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                    Cart is empty 😢
                </div>
            )}

            <div className="space-y-6">

                <AnimatePresence>
                    {cartItems.map((item:any, i) => {

                        const itemTotal = item.product.price * item.quantity

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#1e293b] rounded-2xl p-5 shadow-lg flex flex-col lg:flex-row gap-6"
                            >

                                {/* LEFT → PRODUCT */}
                                <div className="flex gap-4 flex-1">

                                    {/* Image */}
                                    <div className="w-28 h-28 relative rounded-xl overflow-hidden bg-[#111]">
                                        <Image
                                            src={item?.product?.image1}
                                            alt="product"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-col justify-between">

                                        <div>
                                            <h2 className="text-lg font-semibold text-blue-300">
                                                {item.product.title}
                                            </h2>

                                            <p className="text-gray-400 text-sm mt-1">
                                                ₹{item.product.price}
                                            </p>

                                            <p className="text-sm mt-1 text-gray-300">
                                                Quantity: <span className="font-bold">{item.quantity}</span>
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            className="text-red-400 text-sm hover:underline mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT → MINI CHECKOUT */}
                                <motion.div
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="w-full lg:w-[260px] bg-[#0f172a] border border-[#334155] rounded-xl p-4 flex flex-col justify-between"
                                >

                                    <div>
                                        <h3 className="text-md font-semibold text-blue-400 mb-3">
                                            Order Summary
                                        </h3>

                                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                                            <span>Price</span>
                                            <span>₹{item.product.price}</span>
                                        </div>

                                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                                            <span>Qty</span>
                                            <span>{item.quantity}</span>
                                        </div>

                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Delivery</span>
                                            <span className="text-green-400">Free</span>
                                        </div>

                                        <hr className="my-2 border-gray-600" />

                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>₹{itemTotal}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push(`/checkout/${item?._id}`)}
                                        className="mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
                                    >
                                        Checkout
                                    </motion.button>
                                </motion.div>

                            </motion.div>
                        )
                    })}
                </AnimatePresence>

            </div>
        </div>
    )
}

export default Page

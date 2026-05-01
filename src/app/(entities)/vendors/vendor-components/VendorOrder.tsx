"use client";

import { AppDispatch, RootState } from "@/app/redux/store";
import { IOrder } from "@/model/order.model";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { setAllOrdersData } from "@/app/redux/slices/users/userdata";
import toast from "react-hot-toast";

const statusList = [
    "pending",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
];

// 🔥 Animation Variants
const tableVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};
;

export default function VendorOrder() {
    const { allOrdersData, currentUser } = useSelector(
        (state: RootState) => state.users
    );

    const myOrders =
        allOrdersData?.filter(
            (order: IOrder) =>
                order?.productVendor ===
                //@ts-ignore
                currentUser?.user?._id
        ) || [];

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN");
    };

    const [orderStatusStored, setOrderStatusStored] = useState("pending")
    const dispatch = useDispatch<AppDispatch>()
    const updateStatus = async (id: string, status: string) => {
        const res = await axios.post("/api/order/update-status", { orderId: id, status })
        console.log(res);
        const updated = allOrdersData.map((od: any) => od._id === id ? { ...od, orderStatus: status } : od)
        dispatch(setAllOrdersData(updated))

        toast.success("status updated");



    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">

            {/* 🔥 Animated Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold mb-6 text-blue-400"
            >
                📦 Vendor Orders
            </motion.h1>

            <div className="overflow-x-auto">

                <motion.table
                    variants={tableVariant}
                    initial="hidden"
                    animate="show"
                    className="w-full border border-gray-700 rounded-xl overflow-hidden"
                >

                    {/* HEADER */}
                    <thead className="bg-[#1e293b] text-gray-300 text-sm">
                        <tr>
                            <th className="p-3 text-left">Order</th>
                            <th className="p-3 text-left">Buyer</th>
                            <th className="p-3 text-left">Products</th>
                            <th className="p-3 text-left">Payment</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Update</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {myOrders.map((order: IOrder) => (
                            <motion.tr
                                key={order._id?.toString()}

                                whileHover={{ scale: 1.01 }}
                                className="border-t border-gray-700 hover:bg-[#1e293b] transition"
                            >

                                {/* ORDER */}
                                <td className="p-3 text-sm text-gray-400">
                                    #{order._id?.toString().slice(-6)} <br />
                                    <span className="text-xs">
                                        {formatDate(order.createdAt as any)}
                                    </span>
                                </td>

                                {/* BUYER */}
                                <td className="p-3 text-sm">
                                    <div className="font-semibold">
                                        {order.buyer?.name}
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        {order.buyer?.phone}
                                    </div>
                                </td>

                                {/* PRODUCTS */}
                                <td className="p-3 text-sm">
                                    {order.products.map((p: any, i: number) => (
                                        <div key={i}>
                                            {p.product?.title || "Product"} × {p.quantity}
                                        </div>
                                    ))}
                                </td>

                                {/* PAYMENT */}
                                <td className="p-3 text-sm">
                                    <div className="capitalize">
                                        {order.paymentMethod}
                                    </div>

                                    {order.isPaid==true ? (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-green-400 text-xs"
                                        >
                                            Paid
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-red-400 text-xs"
                                        >
                                            Unpaid
                                        </motion.span>
                                    )}
                                </td>

                                {/* STATUS */}
                                <td className="p-3 text-sm capitalize">
                                    <motion.span
                                        whileHover={{ scale: 1.1 }}
                                        className="px-2 py-1 bg-blue-600 rounded text-xs"
                                    >
                                        {order.orderStatus}
                                    </motion.span>
                                </td>

                                {/* UPDATE DROPDOWN */}
                                <td className="p-3">
                                    <motion.select
                                        whileFocus={{ scale: 1.05 }}
                                        defaultValue={order.orderStatus}
                                        className="bg-[#0f172a] border border-gray-600 text-sm p-2 rounded"
                                        value={order.orderStatus}
                                        onChange={(e) => {
                                            updateStatus(String(order?._id), e.target.value)

                                        }}

                                    >
                                        {statusList.map((status) => (
                                            <option key={status} >
                                                {status}
                                            </option>
                                        ))}
                                    </motion.select>
                                </td>

                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>

                {/* EMPTY STATE */}
                {myOrders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-400 mt-10"
                    >
                        No Orders Found 😢
                    </motion.div>
                )}
            </div>
        </div>
    );
}

"use client";

import { RootState } from "@/app/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const UserOrder = () => {
  const { allOrdersData } = useSelector((state: RootState) => state.users);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-6"
      >
        My Orders
      </motion.h1>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-left">Buyer</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Payment</th>
              <th className="p-3 text-center">Is Paid</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {allOrdersData?.map((order: any, index: number) => {
              const product = order.products?.[0];

              return (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* ORDER ID */}
                  <td className="p-3 text-white/70 text-xs">
                    {order._id}
                  </td>

                  {/* BUYER */}
                  <td className="p-3">
                    {order.buyer?.name || "N/A"}
                  </td>

                  {/* VENDOR */}
                  <td className="p-3">
                    {order.productVendor?.shopName || "N/A"}
                  </td>

                  {/* PRODUCT */}
                  <td className="p-3">
                    <div className="font-medium">
                      {product?.product?.title || "Product"}
                    </div>
                    <div className="text-xs text-white/50">
                      Qty: {product?.quantity}
                    </div>
                  </td>

                  {/* PAYMENT METHOD */}
                  <td className="text-center">
                    <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-300">
                      {order.paymentMethod === "cod" ? "Cash" : "Stripe"}
                    </span>
                  </td>

                  {/* IS PAID (NEW COLUMN) */}
                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        order.isPaid
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>

                  {/* STATUS */}
             <td className="text-center">
  <span
    className={`px-2 py-1 rounded-lg text-xs font-medium ${
      order.orderStatus === "delivered"
        ? "bg-green-500/20 text-green-400"
        : order.orderStatus === "pending"
        ? "bg-yellow-500/20 text-yellow-300"
        : order.orderStatus === "cancelled"
        ? "bg-red-500/20 text-red-400"
        : order.orderStatus === "shipped"
        ? "bg-blue-500/20 text-blue-400"
        : "bg-gray-500/20 text-gray-300"
    }`}
  >
    {order.orderStatus || "Processing"}
  </span>
</td>

                  {/* ACTION */}
                  <td className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded-lg active:scale-95 transition cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1220] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 border border-white/10"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/80">
                <p><b>Order ID:</b> {selectedOrder._id}</p>
                <p><b>Payment:</b> {selectedOrder.paymentStatus}</p>
                <p><b>Status:</b> {selectedOrder.orderStatus}</p>
                <p>
                  <b>Created At:</b>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              {/* BUYER + VENDOR */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">Buyer</h3>
                  <p>{selectedOrder.buyer?.name}</p>
                  <p className="text-white/50 text-xs">
                    {selectedOrder.buyer?.email}
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg">
                  <h3 className="font-semibold mb-2">Vendor</h3>
                  <p>{selectedOrder.productVendor?.shopName}</p>
                  <p className="text-white/50 text-xs">
                    {selectedOrder.productVendor?.email}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="mt-4 bg-white/5 p-3 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p>{selectedOrder.address?.street}</p>
                <p>
                  {selectedOrder.address?.city},{" "}
                  {selectedOrder.address?.state}
                </p>
                <p>{selectedOrder.address?.pincode}</p>
              </div>

              {/* PRODUCTS */}
              <div className="mt-5">
                <h3 className="font-semibold mb-3">Products</h3>

                {selectedOrder.products?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/5 p-3 rounded-lg mb-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {item.product?.title}
                        </p>
                        <p className="text-xs text-white/50">
                          Qty: {item.quantity} | ₹{item.price}
                        </p>
                      </div>

                      <p className="text-green-400 font-semibold">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                      {item.product?.images?.slice(0, 4)?.map(
                        (img: string, i: number) => (
                          <img
                            key={i}
                            src={img}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-4 border-t border-white/10 pt-3 flex justify-between text-sm">
                <p className="text-white/60">Total Amount</p>
                <p className="text-green-400 font-bold">
                  ₹
                  {selectedOrder.products?.reduce(
                    (acc: number, item: any) =>
                      acc + item.price * item.quantity,
                    0
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOrder;

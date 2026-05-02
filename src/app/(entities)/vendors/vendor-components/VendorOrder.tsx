"use client";

import { AppDispatch, RootState } from "@/app/redux/store";
import { IOrder } from "@/model/order.model";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { setAllOrdersData } from "@/app/redux/slices/users/userdata";
import toast from "react-hot-toast";
import useGetAllOrders from "@/app/hooks/useAllOrder";

const statusList = [
  "pending",
  "confirmed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

const tableVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function VendorOrder() {
  useGetAllOrders();

  const { allOrdersData, currentUser } = useSelector(
    (state: RootState) => state.users,
  );

  const myOrders =
    allOrdersData?.filter(
      (order: IOrder) =>
        //@ts-ignore
        order?.productVendor === currentUser?.user?._id,
    ) || [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN");

  const [otpModelOpen, setOtpModelOpen] = useState<IOrder | null>(null);
  const [otpStore, setOtpStore] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const updateStatus = async (id: string, status: string) => {
    await axios.post("/api/order/update-status", { orderId: id, status });

    if (status === "delivered") return;

    const updated = allOrdersData.map((od: any) =>
      od._id === id ? { ...od, orderStatus: status } : od,
    );
    dispatch(setAllOrdersData(updated));

    toast.success("Status updated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] text-white p-3 md:p-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3"
      >
        <h1 className="text-xl md:text-3xl font-bold text-blue-400">
          📦 Vendor Orders
        </h1>

        <div className="text-xs text-gray-400">
          Total Orders: {myOrders.length}
        </div>
      </motion.div>

      {/* TABLE */}
      <div className="bg-[#020617]/60 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <motion.table
            variants={tableVariant}
            initial="hidden"
            animate="show"
            className="w-full min-w-[900px] text-xs md:text-sm"
          >
            <thead className="bg-[#1e293b]/80 text-gray-300 uppercase">
              <tr>
                <th className="p-2 md:p-4 text-left">Order</th>
                <th className="p-2 md:p-4 text-left">Buyer</th>
                <th className="p-2 md:p-4 text-left">Products</th>
                <th className="p-2 md:p-4 text-left">Payment</th>
                <th className="p-2 md:p-4 text-left">Status</th>
                <th className="p-2 md:p-4 text-left">Update</th>
              </tr>
            </thead>

            <tbody>
              {myOrders.map((order: IOrder) => (
                <motion.tr
                  key={order._id?.toString()}
                  whileHover={{ scale: 1.01 }}
                  className="border-t border-gray-800 hover:bg-[#1e293b]/40"
                >
                  {/* ORDER */}
                  <td className="p-2 md:p-4 text-gray-400">
                    <div className="font-semibold text-white">
                      #{order._id?.toString().slice(-6)}
                    </div>
                    <div className="text-xs">
                      {formatDate(order.createdAt as any)}
                    </div>
                  </td>

                  {/* BUYER */}
                  <td className="p-2 md:p-4">
                    <div>{order.buyer?.name}</div>
                    <div className="text-xs text-gray-400">
                      {order.buyer?.phone}
                    </div>
                  </td>

                  {/* PRODUCTS */}
                  <td className="p-2 md:p-4">
                    {order.products.map((p: any, i: number) => (
                      <div key={i}>
                        {p.product?.title || "Product"} × {p.quantity}
                      </div>
                    ))}
                  </td>

                  {/* PAYMENT */}
                  <td className="p-2 md:p-4">
                    <div className="capitalize">
                      {order.paymentMethod}
                    </div>
                    <div
                      className={`text-xs ${
                        order.isPaid
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-2 md:p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full
                        ${
                          order.orderStatus === "delivered"
                            ? "bg-green-600"
                            : order.orderStatus === "pending"
                            ? "bg-yellow-500 text-black"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-600"
                            : "bg-blue-600"
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* UPDATE */}
                  <td className="p-2 md:p-4">
                    <motion.select
                      whileFocus={{ scale: 1.05 }}
                      value={order.orderStatus}
                      disabled={order.orderStatus === "delivered"}
                      className={`bg-[#0f172a] border border-gray-600 p-2 rounded-lg w-full
                        ${
                          order.orderStatus === "delivered"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      onChange={(e) => {
                        if (e.target.value === "delivered") {
                          updateStatus(String(order?._id), "delivered");
                          setOtpModelOpen(order);
                        } else {
                          updateStatus(String(order?._id), e.target.value);
                        }
                      }}
                    >
                      {statusList.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </motion.select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>

      {/* OTP MODAL */}
      {otpModelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            className="bg-[#020617] border border-gray-700 rounded-2xl p-5 w-[90%] max-w-sm"
          >
            <h2 className="text-lg font-bold text-blue-400 mb-4">
              🔐 Verify OTP
            </h2>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otpStore}
              onChange={(e) => setOtpStore(e.target.value)}
              className="w-full p-2 rounded bg-[#0f172a] border border-gray-600 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOtpModelOpen(null);
                  setOtpStore("");
                }}
                className="w-1/2 bg-gray-600 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!otpStore) {
                    return toast.error("Enter OTP");
                  }

                  try {
                    const id = otpModelOpen?._id;

                    await axios.post("/api/order/verify-otp", {
                      orderId: String(id),
                      otp: otpStore,
                    });

                    dispatch(
                      setAllOrdersData(
                        allOrdersData.map((o: any) =>
                          o._id == otpModelOpen?._id
                            ? {
                                ...o,
                                orderStatus: "delivered",
                                isPaid: true,
                              }
                            : o,
                        ),
                      ),
                    );

                    setOtpModelOpen(null);
                    setOtpStore("");

                    toast.success("Order Delivered ✅");
                  } catch (err: any) {
                    toast.error(
                      err?.response?.data?.message || "Invalid OTP"
                    );
                  }
                }}
                className="w-1/2 bg-blue-600 py-2 rounded"
              >
                Verify
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

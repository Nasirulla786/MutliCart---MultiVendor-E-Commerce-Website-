"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { setAllOrdersData } from "../redux/slices/users/userdata";
import useGetAllOrders from "../hooks/useAllOrder";

const Page = () => {
  useGetAllOrders();
  const { allOrdersData, currentUser } = useSelector(
    (state: RootState) => state.users
  );

  const [selectOrder, setSelectOrder] = useState<any>(null);

  const myOrders =
    allOrdersData?.filter(
      //@ts-ignore
      (p: any) => p?.buyer?._id === currentUser?.user?._id
    ) || [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const router = useRouter();
  const dispatch = useDispatch();

  const handleCancel = async (id: string) => {
    try {
      await axios.post("/api/order/cancel-order", { orderID: id });

      const updatedData = allOrdersData.map((order: any) =>
        order?._id.toString() === id
          ? { ...order, orderStatus: "cancelled" }
          : order
      );

      dispatch(setAllOrdersData(updatedData));
      toast.success("Order cancelled");
      setSelectOrder(null);

    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleTracking = () => {
    alert("work in progress");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">

      {/* BACK */}
      <div className="mb-5 cursor-pointer" onClick={() => router.push("/")}>
        <ArrowBigLeft />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-blue-400">
        📦 My Orders
      </h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-[#1e293b] text-gray-300 text-sm">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Paid</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {myOrders.map((order: any) => (
              <tr
                key={order._id}
                className="border-t border-gray-700 hover:bg-[#1e293b] transition"
              >
                <td className="p-3 text-sm text-gray-400">
                  #{order._id.slice(-6)}
                </td>

                <td className="p-3 text-sm">
                  {formatDate(order.createdAt)}
                </td>

                <td className="p-3 text-sm">
                  {order.products.map((p: any, i: number) => (
                    <div key={i}>{p.product?.title} × {p.quantity}</div>
                  ))}
                </td>

                <td className="p-3 text-sm">
                  {order.productVendor?.shopName}
                </td>

                <td className="p-3 text-sm">
                  <span className="px-2 py-1 rounded bg-blue-600 text-xs">
                    {order.paymentMethod}
                  </span>
                </td>

                <td className="p-3 text-sm">
                  {order.orderStatus === "cancelled" ? (
                    <span className="text-red-400">Cancelled</span>
                  ) : order.isPaid ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="p-3 font-bold text-blue-400">
                  ₹{order.totalAmount}
                </td>

                <td className="p-3 flex gap-2">
                  {order.orderStatus !== "cancelled" && (
                    <>
                      <button
                        onClick={() => setSelectOrder(order)}
                        className="px-3 py-1 bg-green-600 rounded text-sm"
                      >
                        Details
                      </button>

                      <button
                        onClick={handleTracking}
                        className="px-3 py-1 bg-yellow-500 rounded text-sm"
                      >
                        Track
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD UI ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {myOrders.map((order: any) => (
          <div
            key={order._id}
            className="bg-[#1e293b] rounded-xl p-4 border border-gray-700"
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">
                #{order._id.slice(-6)}
              </span>
              <span className="text-sm">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="text-sm text-gray-300 mb-2">
              {order.products.map((p: any, i: number) => (
                <div key={i}>
                  {p.product?.title} × {p.quantity}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>{order.productVendor?.shopName}</span>
              <span className="text-blue-400 font-bold">
                ₹{order.totalAmount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-blue-600 rounded">
                {order.paymentMethod}
              </span>

              {order.orderStatus === "cancelled" ? (
                <span className="text-red-400 text-sm">Cancelled</span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectOrder(order)}
                    className="px-2 py-1 bg-green-600 rounded text-xs"
                  >
                    Details
                  </button>

                  <button
                    onClick={handleTracking}
                    className="px-2 py-1 bg-yellow-500 rounded text-xs"
                  >
                    Track
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {myOrders.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No Orders Found 😢
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selectOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="bg-[#1e293b] w-full max-w-lg rounded-2xl p-5"
            >
              <h2 className="text-lg font-bold mb-4 text-blue-400">
                Order Details
              </h2>

              <p className="text-sm mb-2">
                #{selectOrder._id.slice(-6)}
              </p>

              <p className="text-sm mb-2">
                {formatDate(selectOrder.createdAt)}
              </p>

              <p className="text-sm mb-2">
                {selectOrder.productVendor?.shopName}
              </p>

              <div className="mt-3">
                {selectOrder.products.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{p.product?.title}</span>
                    <span>x{p.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 bg-red-600 py-2 rounded"
                  onClick={() => handleCancel(selectOrder._id)}
                >
                  Cancel
                </button>

                <button
                  className="flex-1 bg-yellow-500 py-2 rounded"
                  onClick={handleTracking}
                >
                  Track
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Page;

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

  // FILTER MY ORDERS
  const myOrders =
    allOrdersData?.filter(
      //@ts-ignore
      (p: any) => p?.buyer?._id === currentUser?.user?._id
    ) || [];
    console.log("my order",myOrders);

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

      // ✅ FIXED LOGIC (ONLY TARGET ORDER UPDATE)
      const updatedData = allOrdersData.map((order: any) =>
        order?._id.toString() === id
          ? { ...order, orderStatus: "cancelled" }
          : order
      );

      dispatch(setAllOrdersData(updatedData));

      toast.success("Order cancelled");

      // optional cleanup
      setSelectOrder(null);

    } catch (error: any) {
      console.log("FULL ERROR:", error);

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

      <div className="mb-5" onClick={() => router.push("/cart")}>
        <ArrowBigLeft />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-blue-400">
        📦 My Orders
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border border-gray-700 rounded-xl overflow-hidden">

          {/* HEADER */}
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

          {/* BODY */}
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
                    <div key={i} className="text-gray-300">
                      {p.product?.title || "Product"} × {p.quantity}
                    </div>
                  ))}
                </td>

                <td className="p-3 text-sm text-gray-300">
                  {order.productVendor?.shopName || "Vendor"}
                </td>

                <td className="p-3 text-sm capitalize">
                  <span className="px-2 py-1 rounded bg-blue-600 text-xs">
                    {order.paymentMethod}
                  </span>
                </td>

                <td className="p-3 text-sm">
           {order.orderStatus === "cancelled" ? (
  <span className="text-red-400 font-semibold">Cancelled</span>
) : order.isPaid ? (
  <span className="text-green-400 font-semibold">Paid</span>
) : (
  <span className="text-gray-400 font-semibold">—</span>
)}
                </td>

                <td className="p-3 font-bold text-blue-400">
                  ₹{order.totalAmount}
                </td>

                {/* ✅ FIXED UI */}
                <td className="p-3 flex gap-2 items-center">
                  {order.orderStatus === "cancelled" ? (
                    <span className="text-red-400 font-semibold">
                      Cancelled
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectOrder(order)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                      >
                        Details
                      </button>

                      <button
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-sm"
                        onClick={handleTracking}
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

        {/* EMPTY */}
        {myOrders.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No Orders Found 😢
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 50 }}
              className="bg-[#1e293b] w-[95%] md:w-[600px] rounded-2xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-400">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectOrder(null)}
                  className="text-red-400 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-gray-400">Order ID:</span> #
                  {selectOrder._id.slice(-6)}
                </p>

                <p>
                  <span className="text-gray-400">Date:</span>{" "}
                  {formatDate(selectOrder.createdAt)}
                </p>

                <p>
                  <span className="text-gray-400">Vendor:</span>{" "}
                  {selectOrder.productVendor?.shopName}
                </p>

                <p>
                  <span className="text-gray-400">Payment:</span>{" "}
                  {selectOrder.paymentMethod}
                </p>

                <div>
                  <p className="text-gray-400 mb-1">Products:</p>
                  {selectOrder.products.map((p: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-gray-700 py-1"
                    >
                      <span>{p.product?.title}</span>
                      <span>x{p.quantity}</span>
                    </div>
                  ))}
                </div>

                <p className="font-bold text-blue-400 mt-2">
                  Total: ₹{selectOrder.totalAmount}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                  onClick={() => handleCancel(String(selectOrder?._id))}
                >
                  Cancel Order
                </button>

                <button
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded"
                  onClick={handleTracking}
                >
                  Track Order
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

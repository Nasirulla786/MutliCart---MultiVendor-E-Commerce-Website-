"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Page = () => {
  const { allOrdersData, currentUser } = useSelector(
    (state: RootState) => state.users
  );

  // ✅ FILTER MY ORDERS
  const myOrders =
    allOrdersData?.filter(
      (p: any) => p?.buyer?._id === currentUser?.user?._id
    ) || [];

  // ✅ DATE FORMAT
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">

      <h1 className="text-2xl font-bold mb-6 text-blue-400">
        📦 My Orders
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border border-gray-700 rounded-lg overflow-hidden">

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
                {/* ORDER ID */}
                <td className="p-3 text-sm text-gray-400">
                  {order._id.slice(-6)}
                </td>

                {/* DATE */}
                <td className="p-3 text-sm">
                  {formatDate(order.createdAt)}
                </td>

                {/* PRODUCTS */}
                <td className="p-3 text-sm">
                  {order.products.map((p: any, i: number) => (
                    <div key={i}>
                      {p.product?.title || "Product"} × {p.quantity}
                    </div>
                  ))}
                </td>

                {/* VENDOR */}
                <td className="p-3 text-sm text-gray-300">
                  {order.productVendor?.shopName || "Vendor"}
                </td>

                {/* PAYMENT */}
                <td className="p-3 text-sm capitalize">
                  <span className="px-2 py-1 rounded bg-blue-600 text-white text-xs">
                    {order.paymentMethod}
                  </span>
                </td>

                {/* PAID STATUS */}
                <td className="p-3 text-sm">
                  {order.isPaid ? (
                    <span className="text-green-400 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold">
                      pending
                    </span>
                  )}
                </td>

                {/* TOTAL */}
                <td className="p-3 font-bold text-blue-400">
                  ₹{order.totalAmount}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                    Details
                  </button>

                  <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-sm">
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* EMPTY STATE */}
        {myOrders.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No Orders Found 😢
          </div>
        )}

      </div>
    </div>
  );
};

export default Page;

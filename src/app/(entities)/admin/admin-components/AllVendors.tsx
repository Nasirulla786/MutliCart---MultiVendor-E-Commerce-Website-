"use client";

import { RootState } from "@/app/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import fallBack from "../../../../../public/def.jpg"

const AllVendors = () => {
  const { allVendorsData, allProductsData } = useSelector(
    (state: RootState) => state.vendors
  );

  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  // filter products of selected vendor
  const vendorProducts = allProductsData?.filter((p: any) => {
    const vendorId =
      typeof p.vendor === "object" ? p.vendor?._id : p.vendor;

    return vendorId === selectedVendor?._id;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-6"
      >
        All Vendors
      </motion.h1>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[950px] text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Shop Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">GST Number</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {allVendorsData?.map((vendor: any, index: number) => (
              <motion.tr
                key={vendor._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
              >
                {/* VENDOR INFO (IMAGE + ID) */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                   <div className="flex items-center gap-3">
  {vendor.image || vendor.profileImage ? (
    <img
      src={vendor.image || vendor.profileImage}
      className="w-10 h-10 rounded-full object-cover border border-white/10"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">
      {vendor.shopName?.charAt(0) || "V"}
    </div>
  )}
</div>
                    <div>
                      <p className="text-xs text-white/50">
                        {vendor._id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* SHOP NAME */}
                <td className="p-3 font-medium">
                  {vendor.shopName}
                </td>

                {/* PHONE */}
                <td className="p-3 text-white/80">
                  {vendor.phone || "N/A"}
                </td>

                {/* GST */}
                <td className="p-3 text-white/80">
                  {vendor.gstNumber || "N/A"}
                </td>

                {/* ACTION */}
                <td className="text-center">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded-lg active:scale-95 transition"
                  >
                    View Products
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVendor(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1220] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 border border-white/10"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedVendor.image ||
                      selectedVendor.profileImage ||
                      "/avatar.png"
                    }
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <h2 className="text-xl font-semibold">
                    {selectedVendor.shopName} Products
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* PRODUCTS */}
              <div className="space-y-3">
                {vendorProducts?.length > 0 ? (
                  vendorProducts.map((product: any, i: number) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white/5 p-3 rounded-lg flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">
                          {product.title}
                        </p>
                        <p className="text-xs text-white/50">
                          ₹{product.price}
                        </p>
                      </div>

                      <img
                        src={
                          product.image1 ||
                          product.images?.[0] ||
                          "/placeholder.png"
                        }
                        className="w-14 h-14 object-cover rounded-lg border border-white/10"
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm">
                    No products found for this vendor
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllVendors;

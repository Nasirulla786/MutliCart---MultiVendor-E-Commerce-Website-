"use client";

import useGetAllProducts from "@/app/hooks/useAllProducts";
import { setAllProductsData } from "@/app/redux/slices/vendors/vendordata";
import { AppDispatch, RootState } from "@/app/redux/store";
import { IProduct } from "@/model/product.model";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IUser } from "@/model/user.model";

export default function VendorProductPage() {
  useGetAllProducts();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const products =
    useSelector((state: RootState) => state.vendors?.allProductsData) || [];

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );

  // ✅ SAFE FILTER
  const myProducts = products.filter((p: IProduct) => {
    const vendorId = typeof p.vendor === "object" ? p.vendor?._id : p.vendor;
    //@ts-ignore
    return vendorId?.toString() === currentUser?.user?._id?.toString();
  });

  // 🚀 OPTIMISTIC UPDATE
  const handleIsActive = async (id: string, active: boolean) => {
    const updated = products.map((p: IProduct) =>
      p._id.toString() === id ? { ...p, isActive: !active } : p,
    );

    dispatch(setAllProductsData(updated));

    try {
      await axios.post("/api/vendor/change-isActive", {
        productId: id,
        isActive: !active,
      });
    } catch (error) {
      dispatch(setAllProductsData(products)); // ❌ revert
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Products</h1>

        <button
          onClick={() => router.push("/vendors/Add-product")}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition px-5 py-2 rounded-xl"
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Active</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {myProducts.length > 0 ? (
              myProducts.map((product: IProduct) => (
                <motion.tr
                  key={product._id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  {/* PRODUCT */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={product.image1}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-xs text-white/40">
                        {product.category}
                      </p>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="text-center text-green-400 font-semibold">
                    ₹{product.price}
                  </td>

                  {/* STATUS */}
                  <td className="text-center">
                    <span className="text-xs px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-300">
                      {product.verificationStatus}
                    </span>
                  </td>

                  {/* TOGGLE */}
                  <td className="text-center">
                    <div
                      onClick={() =>
                        handleIsActive(
                          product._id.toString(),
                          product.isActive as boolean,
                        )
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                        product.isActive
                          ? "bg-green-500 justify-end"
                          : "bg-gray-500 justify-start"
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="w-4 h-4 bg-white rounded-full shadow"
                      />
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center flex gap-2 justify-center -top-5 relative w-[50%] flex-col">
                    {/* EDIT */}
                    <button
                      onClick={() =>
                        router.push(`/vendors/update-product/${product._id}`)
                      }
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 active:scale-95 transition rounded-lg"
                    >
                      Edit
                    </button>

                    {/* ENABLE / DISABLE */}
                    <button
                      onClick={() =>
                        handleIsActive(
                          product._id.toString(),
                          product.isActive as boolean,
                        )
                      }
                      className={`px-3 py-1 text-xs rounded-lg transition active:scale-95 ${
                        product.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {product.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-white/40">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

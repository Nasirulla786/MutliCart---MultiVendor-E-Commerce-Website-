"use client";

import useGetAllProducts from "@/app/hooks/useAllProducts";
import { setAllProductsData } from "@/app/redux/slices/vendors/vendordata";
import { AppDispatch, RootState } from "@/app/redux/store";
import { IProduct } from "@/model/product.model";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function VendorProductPage() {
  useGetAllProducts();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const products =
    useSelector((state: RootState) => state.vendors?.allProductsData) || [];

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );

  const myProducts = products.filter((p: IProduct) => {
    const vendorId = typeof p.vendor === "object" ? p.vendor?._id : p.vendor;
    //@ts-ignore
    return vendorId?.toString() === currentUser?.user?._id?.toString();
  });

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
      dispatch(setAllProductsData(products));
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-2xl font-semibold">My Products</h1>

        <button
          onClick={() => router.push("/vendors/Add-product")}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs sm:text-sm"
        >
          + Add
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
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
            {myProducts.map((product: IProduct) => {
              const isApproved = product?.isApproved === true;

              return (
                <tr key={product._id.toString()} className="border-t border-white/10">

                  <td className="p-3 flex items-center gap-3">
                    <img src={product.image1} className="w-14 h-14 rounded-lg" />
                    <div>
                      <p>{product.title}</p>
                      <p className="text-xs text-white/40">{product.category}</p>
                    </div>
                  </td>

                  <td className="text-center text-green-400">₹{product.price}</td>

                  <td className="text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      isApproved ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td className="text-center">
                    {product.isActive ? "Published" : "Not Published"}
                  </td>

                  <td className="text-center flex flex-col gap-2 items-center py-3">
                    <button
                      onClick={() => router.push(`/vendors/update-product/${product._id}`)}
                      className="bg-blue-600 px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleIsActive(product._id.toString(), product.isActive as boolean)
                      }
                      disabled={!isApproved}
                      className={`px-3 py-1 text-xs rounded ${
                        product.isActive ? "bg-red-500" : "bg-green-500"
                      } ${!isApproved && "opacity-50 cursor-not-allowed"}`}
                    >
                      {!isApproved ? "Pending" : product.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {myProducts.map((product: IProduct) => {
          const isApproved = product?.isApproved === true;

          return (
            <motion.div
              key={product._id.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f172a] border border-white/10 rounded-xl p-4"
            >
              {/* TOP */}
              <div className="flex gap-3">
                <img src={product.image1} className="w-16 h-16 rounded-lg object-cover" />

                <div className="flex-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-white/40">{product.category}</p>

                  <p className="text-green-400 mt-1">₹{product.price}</p>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex justify-between items-center mt-3 text-xs">
                <span className={`px-2 py-1 rounded ${
                  isApproved ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {isApproved ? "Approved" : "Pending"}
                </span>

                <span className={product.isActive ? "text-green-400" : "text-red-400"}>
                  {product.isActive ? "Published" : "Not Published"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    router.push(`/vendors/update-product/${product._id}`)
                  }
                  className="flex-1 bg-blue-600 py-2 rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleIsActive(
                      product._id.toString(),
                      product.isActive as boolean,
                    )
                  }
                  disabled={!isApproved}
                  className={`flex-1 py-2 text-xs rounded ${
                    product.isActive ? "bg-red-500" : "bg-green-500"
                  } ${!isApproved && "opacity-50 cursor-not-allowed"}`}
                >
                  {!isApproved ? "Pending" : product.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {myProducts.length === 0 && (
        <p className="text-center text-white/40 mt-10">No products found</p>
      )}
    </div>
  );
}

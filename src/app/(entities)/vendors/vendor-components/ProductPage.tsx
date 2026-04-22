'use client';

import useGetAllProducts from "@/app/hooks/useAllProducts";
import { RootState } from "@/app/redux/store";
import { IProduct } from "@/model/product.model";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function VendorProductPage() {
  useGetAllProducts();
  const router = useRouter();


  const products = useSelector((state: RootState) => state.vendors?.allProductsData) || [];
  const currentUser = useSelector((state: RootState) => state.users.currentUser);





  // ✅ Filter products belonging to current vendor
  const myProducts = products.filter(
    //@ts-ignore
    (p: IProduct) => p.vendor?._id === currentUser?.user?._id
  );



  return (
    <div className="p-5">
      {/* Add Product Button */}
      <div
        onClick={() => router.push("/vendors/Add-product")}
        className="w-[200px] h-[50px] bg-blue-500 text-white flex items-center justify-center rounded-lg cursor-pointer hover:bg-blue-600 transition"
      >
        + Add Product
      </div>

      {/* Product Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myProducts.length > 0 ? (
              myProducts.map((product: IProduct , i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={product.image1}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{product.title}</td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    ₹{product.price}
                  </td>
                  <td className="px-4 py-2">
                    {product.verificationStatus || "pending"}
                  </td>
                  <td className="px-4 py-2">
                    {product.isActive ? (
                      <span className="text-green-600 font-bold">Enabled</span>
                    ) : (
                      <span className="text-red-600 font-bold">Disabled</span>
                    )}


                  </td>
                  <td className="px-4 py-2 flex gap-2 flex-col items-center m-2">
    <div className="flex  gap-3">
    <button
                      onClick={() => router.push(`/vendors/update-product/${product._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // TODO: dispatch action to toggle product active status
                        console.log("Toggle active for", product._id);
                      }}
                      className={`px-3 py-1 rounded ${
                        product.isApproved
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {product.isApproved? "Enable" : "Disable"}
                    </button>
    </div>

                    <p className="text-red-500">{product?.rejectReason || ""}</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
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

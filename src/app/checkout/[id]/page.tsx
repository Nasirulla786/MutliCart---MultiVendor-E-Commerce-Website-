"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import fallBack from "../../../../public/def.jpg";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [item, setItem] = useState<any>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [selectPayment, setSelectPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGetProduct = async () => {
      try {
        const res = await axios.get("/api/user/cart/get");

        const checkOutProduct = res?.data?.cart.find(
          (p: any) => p.product._id == id,
        );
        //  console.log(checkOutProduct);

        setItem(checkOutProduct);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetProduct();
  }, []);

  // ✅ CHARGES
  const serviceCharge = 30;
  const deliveryCharge = item?.product?.freeDelivery ? 0 : 50;

  const finalTotal =
    Number(item?.product?.price) +
    Number(serviceCharge) +
    Number(deliveryCharge);

  // ✅ PAYMENT HANDLER
  const handlePayment = async () => {
    try {
      if (!name || !address || !city || !pin || !phone) {
        return alert("Please fill all address details");
      }

      setLoading(true);

      if (selectPayment == "cod") {
        const res = await axios.post("/api/order/create/cod", {
          productId: item.product._id,
          quantity: item.quantity,
          address: {
            name,
            phone,
            address,
            city,
            pinCode: pin,
          },
          deliveryCharge,
          serviceCharge,
        });

        alert("Order placed successfully 🎉");

        router.push(`/order-success`); // ✅ redirect after order
      }

      if (selectPayment == "stripe") {
        const res = await axios.post("/api/order/create/online-pay/stripe", {
          productId: item.product._id,
          quantity: item.quantity,
          address: {
            name,
            phone,
            address,
            city,
            pinCode: pin,
          },
          deliveryCharge,
          serviceCharge,
        });



        window.location.href = res.data.url;// ✅ redirect after order
      }

    } catch (err) {
      console.log(err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return <div className="text-center text-gray-400 mt-20">Loading...</div>;
  }

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* PRODUCT */}
          <div className="bg-[#1e293b] p-4 rounded-xl flex gap-4 items-center">
            <div className="w-24 h-24 relative rounded overflow-hidden">
              <Image
                src={item?.product?.image1 || fallBack}
                alt="product"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="font-semibold text-lg">{item.product.title}</h2>

              <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>

              <p className="text-blue-400 font-bold mt-1">
                ₹{item.product.price}
              </p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-[#1e293b] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Delivery Address</h2>

            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-[#0f172a] outline-none"
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded bg-[#0f172a] outline-none"
            />

            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded bg-[#0f172a] outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="p-3 rounded bg-[#0f172a] outline-none"
              />

              <input
                placeholder="PIN Code"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="p-3 rounded bg-[#0f172a] outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {/* SUMMARY */}
          <div className="bg-[#1e293b] p-6 rounded-xl space-y-3">
            <h2 className="font-bold text-lg">Order Summary</h2>

            <div className="flex justify-between text-gray-400">
              <span>Price</span>
              <span>₹{item.product.price}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Service Fee</span>
              <span>₹{serviceCharge}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Delivery</span>
              <span>{deliveryCharge}</span>
            </div>

            <div className="border-t border-gray-600 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-[#1e293b] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Payment Method</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                className={`p-3 rounded ${selectPayment === "cod" ? "bg-blue-500" : "bg-[#0f172a]"
                  }`}
                onClick={() => setSelectPayment("cod")}
              >
                COD
              </button>

              <button
                className={`p-3 rounded ${selectPayment === "stripe" ? "bg-blue-500" : "bg-[#0f172a]"
                  }`}
                onClick={() => setSelectPayment("stripe")}
              >
                Stripe
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 py-3 rounded-xl font-semibold"
              onClick={handlePayment}
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;

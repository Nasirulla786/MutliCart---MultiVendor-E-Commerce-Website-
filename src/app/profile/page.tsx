"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Pencil,
  Store,
  Users,
  Mail,
  Phone,
  ChevronRight,
  Clock,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import Image from "next/image";
import def from "../../../public/def.jpg";
import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../redux/slices/users/userdata";

function ActionBtn({ icon: Icon, label, onClick, variant = "default" }: any) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition cursor-pointer
      ${
        variant === "accent"
          ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20"
          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon size={15} />
      </div>
      <span className="text-sm flex-1 text-left font-medium">{label}</span>
      <ChevronRight size={14} className="text-white/30" />
    </motion.button>
  );
}

function InfoRow({ icon: Icon, value }: any) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/50">
      <Icon size={13} />
      <span className="truncate">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const reduxUser: any = useSelector(
    (state: RootState) => state.users.currentUser
  );
  const details: any = reduxUser?.user;

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editShopOpen, setEditShopOpen] = useState(false);

  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);

  const [shopName, setShopName] = useState(details?.shopName || "");
  const [shopAddress, setShopAddress] = useState(details?.shopAddress || "");
  const [gstNumber, setGstNumber] = useState(details?.gstNumber || "");

  const [loading, setLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);

  const ImageClick = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // ================= PROFILE UPDATE =================
  const handleEditSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post("/api/edit-profile", formData);

      const updateUi = {
        ...reduxUser,
        user: {
          ...reduxUser?.user,
          image: res.data.updatedUser.image,
          name: res.data.updatedUser.name,
        },
      };

      dispatch(setCurrentUser(updateUi));

      toast.success("Profile Updated ✅");
      setEditProfileOpen(false);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SHOP UPDATE =================
  const handleShopSave = async () => {
    try {
      setShopLoading(true);

      const res = await axios.post("/api/vendor/edit-again-shop-details", {
        shopName,
        shopAddress,
        gstNumber,
      });

      const updatedUser = res.data.vendor;

      const updateUi = {
        ...reduxUser,
        user: {
          ...reduxUser?.user,
          shopName: updatedUser.shopName,
          shopAddress: updatedUser.shopAddress,
          gstNumber: updatedUser.gstNumber,
        },
      };

      dispatch(setCurrentUser(updateUi));

      toast.success("Shop Updated ✅");
      setEditShopOpen(false);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setShopLoading(false);
    }
  };

  if (!details) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white/40">
        Loading...
      </div>
    );
  }

  const role = details?.role || "user";

  const roleMeta: any = {
    user: {
      label: "Customer",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    admin: {
      label: "Admin",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    vendor: {
      label: "Vendor",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  };

  const meta = roleMeta[role];

  const joinedDate = details?.createdAt
    ? new Date(details.createdAt).toLocaleDateString("en-IN")
    : null;

  return (
    <div className="min-h-screen bg-[#030712] flex justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-3">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* PROFILE CARD */}
        <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between mb-5 items-center">
            <Image
              src={details?.image || def}
              alt="profile"
              width={60}
              height={60}
              className="rounded-2xl object-cover"
            />

            <span
              className={`text-xs px-3 py-1 rounded-full border ${meta.bg} ${meta.color}`}
            >
              {meta.label}
            </span>
          </div>

          <h1 className="text-white font-bold text-lg">{details?.name}</h1>

          <div className="mt-4 flex flex-col gap-2">
            {details?.email && <InfoRow icon={Mail} value={details.email} />}
            {details?.phone && <InfoRow icon={Phone} value={details.phone} />}
            {joinedDate && <InfoRow icon={Clock} value={joinedDate} />}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2">

          <div onClick={() => setEditProfileOpen((prev) => !prev)}>
            <ActionBtn icon={Pencil} label="Edit Profile" variant="accent" />
          </div>

          {role === "user" && (
            <ActionBtn icon={ShoppingBag} label="Orders" onClick={() => router.push("/orders")} />
          )}

          {role === "admin" && (
            <ActionBtn icon={Users} label="Manage Vendors" onClick={() => router.push("/admin/vendors")} />
          )}

          {/* ✅ VENDOR SECTION */}
          {role === "vendor" && (
            <div onClick={() => setEditShopOpen((prev) => !prev)}>
              <ActionBtn icon={Store} label="Edit Shop Details" />
            </div>
          )}

          {/* EDIT PROFILE */}
          <AnimatePresence>
            {editProfileOpen && (
              <motion.div className="mt-3 bg-[#0f172a] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <h2 className="text-white text-sm">Edit Profile</h2>

                <div onClick={() => ImageClick.current?.click()} className="cursor-pointer w-14 h-14 bg-white/10 flex items-center justify-center rounded-xl">
                  {previewImage ? <Image src={previewImage} alt="" width={60} height={60} /> : <Plus />}
                </div>

                <input type="file" hidden ref={ImageClick} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                    setBackendImage(file);
                  }
                }} />

                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"
                  className="px-3 py-2 bg-black text-white border border-white/10 rounded-lg" />

                <button onClick={handleEditSave} className="bg-blue-600 py-2 rounded-lg">
                  {loading ? "Saving..." : "Save"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ EDIT SHOP */}
          <AnimatePresence>
            {editShopOpen && (
              <motion.div className="mt-3 bg-[#0f172a] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <h2 className="text-white text-sm">Edit Shop Details</h2>

                <input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Shop Name"
                  className="px-3 py-2 bg-black text-white border border-white/10 rounded-lg" />

                <input value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} placeholder="Shop Address"
                  className="px-3 py-2 bg-black text-white border border-white/10 rounded-lg" />

                <input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="GST Number"
                  className="px-3 py-2 bg-black text-white border border-white/10 rounded-lg" />

                <button onClick={handleShopSave} className="bg-blue-600 py-2 rounded-lg">
                  {shopLoading ? "Saving..." : "Save"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

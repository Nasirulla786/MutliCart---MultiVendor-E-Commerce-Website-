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
  MapPin,
  Hash,
  BadgeCheck,
  Clock,
  Plus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Image from "next/image";
import def from "../../../public/def.jpg";
import { useRef, useState } from "react";

// ─── Button ─────────────────────────────────────────────

function ActionBtn({
  icon: Icon,
  label,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  variant?: "default" | "accent";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition
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

// ─── Info Row ───────────────────────────────────────────

function InfoRow({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/50">
      <Icon size={13} />
      <span className="truncate">{value}</span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────

export default function ProfilePage() {
  const reduxUser = useSelector((state: RootState) => state.users.currentUser);
  //@ts-ignore
  const details = reduxUser?.user;

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const ImageClick = useRef<HTMLInputElement | null>(null);

  if (!details) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white/40">
        Loading...
      </div>
    );
  }

  const role = details?.role || "user";

  const roleMeta: any = {
    user: { label: "Customer", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    admin: { label: "Admin", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    vendor: { label: "Vendor", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  };

  const meta = roleMeta[role];

  const joinedDate = details?.createdAt
    ? new Date(details.createdAt).toLocaleDateString("en-IN")
    : null;

  return (
    <div className="min-h-screen bg-[#030712] flex justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-3">

        {/* Profile Card */}
        <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between mb-5">
            <Image
              src={details?.image || def}
              alt="profile"
              width={60}
              height={60}
              className="rounded-2xl object-cover"
            />

            <span className={`text-xs px-3 py-1 flex items-center justify-center rounded-full border ${meta.bg} ${meta.color}`}>
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

        {/* Vendor Card */}
        {role === "vendor" && (
          <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6">
            <p className="text-white text-sm mb-2">{details?.shopName}</p>
            {details?.shopAddress && <InfoRow icon={MapPin} value={details.shopAddress} />}
            {details?.gstNumber && <InfoRow icon={Hash} value={details.gstNumber} />}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div onClick={() => setEditProfileOpen((prev) => !prev)}>
            <ActionBtn icon={Pencil} label="Edit Profile" variant="accent" />
          </div>

          {role === "user" && <ActionBtn icon={ShoppingBag} label="Orders" />}
          {role === "admin" && <ActionBtn icon={Users} label="Manage Vendors" />}
          {role === "vendor" && <ActionBtn icon={Store} label="Shop Settings" />}

          {/* ─── EDIT PROFILE UI ─── */}
          <AnimatePresence>
            {editProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 bg-[#0f172a] border border-white/10 rounded-2xl p-5 flex flex-col gap-4"
              >
                <div className="flex justify-between">
                  <h2 className="text-white text-sm">Edit Profile</h2>
                  <button onClick={() => setEditProfileOpen(false)} className="text-white/40 text-xs">
                    Close
                  </button>
                </div>

                {/* Image Upload */}
                <div
                  onClick={() => ImageClick.current?.click()}
                  className="cursor-pointer w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center"
                >
                  {previewImage ? (
                    <Image src={previewImage} alt="preview" width={60} height={60} className="rounded-xl" />
                  ) : (
                    <Plus className="text-white" />
                  )}
                </div>

                <input
                  type="file"
                  hidden
                  ref={ImageClick}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />

                {/* Name */}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="px-3 py-2 rounded-lg bg-black text-white border border-white/10"
                />

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 py-2 rounded-lg text-white">
                    Save
                  </button>
                  <button
                    onClick={() => setEditProfileOpen(false)}
                    className="flex-1 bg-white/10 py-2 rounded-lg text-white"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

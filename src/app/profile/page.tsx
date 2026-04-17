"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IUser } from "@/model/user.model";
import Image from "next/image";
import def from "../../../public/def.jpg"

// ─── Animations ──────────────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

// ─── Button Component ─────────────────────────────────────────────────────────

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-colors
        ${
          variant === "accent"
            ? "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/16"
            : "bg-white/3 border-white/6 text-white/60 hover:bg-white/6 hover:text-white/80"
        }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
          ${variant === "accent" ? "bg-blue-600/15" : "bg-white/5"}`}
      >
        <Icon size={15} />
      </div>
      <span className="text-sm flex-1 text-left font-medium">{label}</span>
      <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
    </motion.button>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-white/40">
      <Icon size={13} className="flex-shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const reduxUser = useSelector((state: RootState) => state.users.currentUser);
  //@ts-ignore
  const details   = reduxUser?.user




  if (!details) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/30 text-sm">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  // ─── Derived ─────────────────────────────────────────────────────────────────

  const initials =
    details?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const role = details?.role || "user";

  const roleMeta: any = {
    user:   { label: "Customer", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    admin:  { label: "Admin",    color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20"  },
    vendor: { label: "Vendor",   color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20"      },
  };

  const meta = roleMeta[role];

  const joinedDate = details?.createdAt
    ? new Date(details.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  // ─── UI ──────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#030712] px-4 py-10 flex justify-center">
      <motion.div

        initial="hidden"
        animate="visible"
        className="w-full max-w-md flex flex-col gap-3"
      >

        {/* ── Profile Card ── */}
        <motion.div

          className="bg-[#0a0f1e] border border-white/5 rounded-3xl p-6"
        >
          {/* Top row: Avatar + Badge */}
          <div className="flex items-start justify-between mb-5">
            <div className="relative">
              {details?.image ? (
                <Image src={details?.image} className="w-16 h-16 rounded-2xl object-cover border border-white/8"  alt="none" width={50} height={50}/>
              ) : (
                <Image src={def} className="w-16 h-16 rounded-2xl object-cover border border-white/8"  alt="none"/>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0f1e]" />
            </div>

            <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${meta.bg} ${meta.color}`}>
              {meta.label}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-white text-xl font-bold tracking-tight">{details?.name || "No Name"}</h1>

          {/* Info rows */}
          <div className="mt-4 flex flex-col gap-2.5">
            {details?.email    && <InfoRow icon={Mail}    value={details?.email} />}
            {details?.phone    && <InfoRow icon={Phone}   value={details?.phone} />}
            {joinedDate    && <InfoRow icon={Clock}   value={`Joined ${joinedDate}`} />}
          </div>
        </motion.div>

        {/* ── Vendor Shop Card ── */}
        {role === "vendor" && (
          <motion.div

            className="bg-[#0a0f1e] border border-white/5 rounded-3xl p-6"
          >
            {/* Shop header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Shop details</p>
              {details?.verificationStatus === "approved" && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <BadgeCheck size={11} />
                  Verified
                </span>
              )}
            </div>

            {/* Shop name big */}
            <p className="text-white text-base font-semibold mb-4">{details?.shopName}</p>

            {/* Shop details grid */}
            <div className="flex flex-col gap-2.5">
              {details?.shopAddress && <InfoRow icon={MapPin} value={details?.shopAddress} />}
              {details?.gstNumber   && <InfoRow icon={Hash}   value={`GST: ${details?.gstNumber}`} />}
            </div>
          </motion.div>
        )}

        {/* ── Actions ── */}
        <motion.div className="flex flex-col gap-2">
          {role === "user" && (
            <>
              <ActionBtn icon={ShoppingBag} label="Orders"       variant="accent" />
              <ActionBtn icon={Pencil}      label="Edit Profile" />
            </>
          )}

          {role === "admin" && (
            <ActionBtn icon={Users} label="Manage Vendors" variant="accent" />
          )}

          {role === "vendor" && (
            <>
              <ActionBtn icon={Pencil} label="Edit Profile"    variant="accent" />
              <ActionBtn icon={Store}  label="Shop Settings" />
            </>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}

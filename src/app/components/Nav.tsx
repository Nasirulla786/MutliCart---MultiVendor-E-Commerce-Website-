//@ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingCart,
  Phone,
  X,
  Menu,
  ChevronDown,
  Settings,
  UserCircle,
  Package,
  Heart,
  Store,
  LayoutGrid,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Image from "next/image";

export default function Navbar({ user }: any) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.users);

  const role = user?.role;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const go = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full h-16 px-6 flex items-center justify-between
        bg-[#08090c] border-b border-white/10 text-white"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="w-9 h-9 rounded-lg bg-[#1a1f2e] flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6384ff"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold">
            Multi<span className="text-[#6384ff]">Mart</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-7">
            {role === "user" && (
              <>
                <NavItem
                  icon={<Home size={16} />}
                  label="Home"
                  onClick={() => go("/")}
                />
                <NavItem
                  icon={<Store size={16} />}
                  label="Shop"
                  onClick={() => go("/shop")}
                />
                <NavItem
                  icon={<LayoutGrid size={16} />}
                  label="Category"
                  onClick={() => go("/category")}
                />
                <NavItem
                  icon={<Package size={16} />}
                  label="Orders"
                  onClick={() => go("/orders")}
                />

              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-3 min-w-[220px] justify-end">
          {role === "user" && (
            <button
              onClick={() => router.push("/cart")}
              className="relative w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:scale-105 transition cursor-pointer"
            >
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6384ff] rounded-full text-[10px] flex items-center justify-center">
                {user?.cart?.length || 0}
              </span>
              <ShoppingCart size={16} />
            </button>
          )}

          <NavItem
            icon={<Phone size={16} />}
            label="Support"
            onClick={() => go("/support-page")}
          />

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:scale-105 transition"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-[#6384ff] to-purple-500 flex items-center justify-center">
                {currentUser?.user?.image ? (
                  <Image
                    src={currentUser.user.image}
                    width={28}
                    height={28}
                    alt=""
                  />
                ) : (
                  <span className="text-xs font-bold">
                    {currentUser?.user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              <ChevronDown
                size={14}
                className={`transition ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 z-10 top-12 w-52 bg-[#0f1117] border border-white/10 rounded-xl p-2"
                >
                  <DropItem
                    icon={<UserCircle size={14} />}
                    label="Profile"
                    onClick={() => go("/profile")}
                  />
                  <DropItem icon={<Settings size={14} />} label="Settings" />
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-3 py-2 text-red-400 text-sm hover:bg-white/5 rounded"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden  p-2 hover:bg-white/10 rounded transition"
        >
          <Menu />
        </button>
      </motion.nav>

      {/* MOBILE MENU */}
<AnimatePresence>
  {open && (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween" }}
        className="fixed right-0 top-0 w-72 h-full bg-[#0b0f19] border-l border-white/10 p-5 z-50 flex flex-col"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Menu</h2>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔥 PROFILE SECTION */}
        <div
          onClick={() => {
            go("/profile");
          }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition mb-5"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            {currentUser?.user?.image ? (
              <Image
                src={currentUser.user.image}
                alt="profile"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm font-bold text-white">
                {currentUser?.user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {currentUser?.user?.name || "User"}
            </span>
            <span className="text-xs text-gray-400">
              View Profile
            </span>
          </div>
        </div>

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-2 flex-1">
          <SidebarItem icon={<Home size={18} />} label="Home" onClick={() => go("/")} />
          <SidebarItem icon={<Store size={18} />} label="Shop" onClick={() => go("/shop")} />
          <SidebarItem icon={<LayoutGrid size={18} />} label="Category" onClick={() => go("/category")} />
          <SidebarItem icon={<Package size={18} />} label="Orders" onClick={() => go("/orders")} />
       
          <SidebarItem icon={<ShoppingCart size={18} />} label="Cart" onClick={() => go("/cart")} />
          <SidebarItem icon={<Phone size={18} />} label="Support" onClick={() => go("/support-page")} />
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <X size={16} />
            Logout
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </>
  );
}

/* COMPONENTS */

function NavItem({ icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-gray-400
      hover:text-blue-400 hover:scale-105 transition cursor-pointer"
    >
      {icon}
      {label}
    </button>
  );
}

function DropItem({ icon, label, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm
      hover:bg-white/5 hover:text-blue-400 rounded cursor-pointer transition"
    >
      {icon}
      {label}
    </div>
  );
}

function SidebarItem({ icon, label, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300
      hover:bg-white/10 hover:text-white cursor-pointer transition-all"
    >
      <div className="opacity-80">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

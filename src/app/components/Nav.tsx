//@ts-nocheck
'use client'

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ShoppingCart, Phone, LogOut,
  X, Menu, ChevronDown, Settings, UserCircle,
  Package, Heart, Store, LayoutGrid
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Image from "next/image";
import VendorOrder from "../(entities)/vendors/vendor-components/VendorOrder";

export default function Navbar({ user }: any) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const role = user?.role;
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [activePage, setActivePage] = useState();


  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-16 px-6 flex items-center justify-between
                   bg-[#08090c] border-b border-white/[0.06] text-white"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#1a1f2e] border border-[#6384ff]/25
                          flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#6384ff" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold">
            Multi<span className="text-[#6384ff]">Mart</span>
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-1">



          {/* USER ONLY NAV */}
          {role === "user" && (
            <>
              <NavLink onClick={() => router.push("/")} icon={<Home size={15} />} label="Home" active />

              <NavLink onClick={() => router.push("/shop")} icon={<Store size={15} />} label="Shop" />

              <NavLink onClick={() => router.push("/category")} icon={<LayoutGrid size={15} />} label="Category" />

              <NavLink onClick={() => router.push("/orders")} icon={<Package size={15} />} label="Orders" />

              <NavLink onClick={() => router.push("/wishlist")} icon={<Heart size={15} />} label="Wishlist" />

              {/* <NavLink icon={<Phone size={15} />} label="Call" /> */}
            </>
          )}

          {/* VENDOR ONLY */}
          {role === "vendor" && (
            <>
              <NavLink icon={<Home size={15} />} label="Dashboard" active />
                {/* <NavLink icon={<Phone size={15} />} label="Call" /> */}

            </>


          )}
        </div>


        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-2">

          {/* CART (USER ONLY) */}
          {role === "user" && (
            <button
              onClick={() => router.push("/cart")}
              className="relative w-9 h-9 rounded-[10px]
                         bg-white/[0.04] border border-white/[0.07]
                         flex items-center justify-center text-white/60"
            >
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6384ff] rounded-full
                               text-[9px] flex items-center justify-center">
                {user?.cart?.length || 0}
              </span>
              <ShoppingCart size={15} />
            </button>
          )}

          <NavLink icon={<Phone size={15} />} label="Support" onClick={()=>router.push("/support-page")} />

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-[5px]
                         rounded-xl bg-white/[0.04] border border-white/[0.07]"
            >
              <div className="w-7 h-7 rounded bg-gradient-to-br from-[#6384ff] to-[#a78bfa] flex items-center justify-center">
                {currentUser?.user?.image ? (
                  <Image
                    src={currentUser.user.image}
                    alt="profile"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-xs font-bold">
                    {currentUser?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <span className="text-[13px]">
                {user?.name?.split(" ")[0] || "Profile"}
              </span>

              <motion.div animate={{ rotate: profileOpen ? 180 : 0 }}>
                <ChevronDown size={13} />
              </motion.div>
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-[52px] w-56
                             bg-[#0f1117] border rounded-2xl p-2 z-10"
                >
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>

                  <div onClick={() => router.push("/profile")}>
                    <DropItem icon={<UserCircle size={14} />} label="My Profile" />
                  </div>

                  <DropItem icon={<Settings size={14} />} label="Settings" />

                  <button
                    onClick={() => signOut()}
                    className="w-full text-red-400 mt-2 text-sm"
                  >
                    Logout
                  </button>
                </motion.div>
              )}


            </AnimatePresence>
          </div>
        </div>


        {/* MOBILE */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden w-9 h-9 rounded bg-white/[0.04]"
        >
          <Menu size={17} />
        </button>
      </motion.nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 bg-black/60" />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 w-72 h-full bg-[#08090c] p-5"
            >
              {role === "user" && (
                <>
                  <SideItem onClick={() => router.push("/")} icon={<Home size={16} />} label="Home" />

                  <SideItem onClick={() => router.push("/shop")} icon={<Store size={16} />} label="Shop" />

                  <SideItem onClick={() => router.push("/category")} icon={<LayoutGrid size={16} />} label="Category" />

                  <SideItem onClick={() => router.push("/orders")} icon={<Package size={16} />} label="Orders" />

                  <SideItem onClick={() => router.push("/wishlist")} icon={<Heart size={16} />} label="Wishlist" />

                  <SideItem icon={<ShoppingCart size={16} />} label="Cart" />
                </>
              )}

              {role === "vendor" && (
                <>
                  <SideItem icon={<Home size={16} />} label="Dashboard" />
                  <SideItem icon={<Package size={16} />} label="Orders" />
                </>
              )}

              <button onClick={() => signOut()} className="text-red-400 mt-4">
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* COMPONENTS */

function NavLink({ icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer
      ${active ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
    >
      {icon}
      {label}
    </div>
  );
}

function DropItem({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
      {icon}
      {label}
    </div>
  );
}

function SideItem({ icon, label, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 py-2 cursor-pointer">
      {icon}
      {label}
    </div>
  );
}

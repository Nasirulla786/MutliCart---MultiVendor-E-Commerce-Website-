//@ts-nocheck
'use client'

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ShoppingCart, Phone, LogOut,
  X, Menu, ChevronDown, Settings, UserCircle
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
  const role = user?.role;
  const router = useRouter();
  const {currentUser}  = useSelector((state:RootState)=>state.users)
  // console.log(currentUser)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-16 px-6 flex items-center justify-between
                   bg-[#08090c] border-b border-white/[0.06] text-white"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#1a1f2e] border border-[#6384ff]/25
                          flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#6384ff" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            Multi<span className="text-[#6384ff]">Mart</span>
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {(role === "user" || role === "vendor") && (
            <NavLink icon={<Home size={15} />} label="Home" active />
          )}
          {role === "user" && (
            <NavLink icon={<Phone size={15} />} label="Call" />
          )}
          {role === "vendor" && (
            <NavLink icon={<Phone size={15} />} label="Orders" />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-2">

          {/* Cart */}
          {role === "user" && (
            <button className="relative w-9 h-9 rounded-[10px]
                               bg-white/[0.04] border border-white/[0.07]
                               flex items-center justify-center text-white/60
                               hover:bg-white/[0.08] hover:text-white transition-all duration-150">
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6384ff] rounded-full
                               text-[9px] font-bold text-white flex items-center justify-center
                               border-2 border-[#08090c]">3</span>
              <ShoppingCart size={15} />
            </button>
          )}

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-[5px] pr-3 py-[5px]
                         rounded-xl bg-white/[0.04] border border-white/[0.07]
                         hover:bg-white/[0.08] hover:border-white/[0.12]
                         transition-all duration-150"
            >
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#6384ff] to-[#a78bfa]
                              flex items-center justify-center text-[11px] font-bold text-white">


                <div>

                {
  currentUser?.user?.image ? (
    <Image
      src={currentUser.user.image}
      alt="profile"
      width={50}
      height={50}
      className="rounded-full"
    />
  ) : (
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold">
      {currentUser?.user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  )
}
                </div>



              </div>
              <span className="text-[13px] font-medium text-white/85">
                {user?.name?.split(" ")[0] || "Profile"}
              </span>
              <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={13} className="text-white/35" />
              </motion.div>
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[52px] w-56
                             bg-[#0f1117] border border-white/[0.08]
                             rounded-2xl p-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-3 py-2.5 mb-1 border-b border-white/[0.06]">
                    <p className="text-[13px] font-semibold text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[11px] text-white/35 truncate mt-0.5">
                      {user?.email || ""}
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full
                                     bg-[#6384ff]/12 border border-[#6384ff]/20
                                     text-[10px] font-semibold text-[#6384ff] uppercase tracking-wide">
                      {role}
                    </span>
                  </div>

              <div onClick={()=>router.push("/profile")}>
              <DropItem icon={<UserCircle size={14} />} label="My Profile" />
              </div>
                  <DropItem icon={<Settings size={14} />} label="Settings" />

                  <div className="h-px bg-white/[0.06] my-1.5" />

                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px]
                               text-[13px] text-red-400/80 hover:text-red-400
                               hover:bg-red-500/[0.08] transition-all duration-150"
                  >
                    <LogOut size={14} className="text-red-400/50" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE BURGER */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden w-9 h-9 rounded-[10px] bg-white/[0.04] border border-white/[0.07]
                     flex items-center justify-center text-white/70 hover:text-white transition"
        >
          <Menu size={17} />
        </button>
      </motion.nav>

      {/* ─── MOBILE SIDEBAR ─── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 h-full w-72
                         bg-[#08090c] border-l border-white/[0.06] z-50 p-5 text-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[17px] font-semibold">
                  Multi<span className="text-[#6384ff]">Mart</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.07]
                             flex items-center justify-center text-white/50 hover:text-white transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* User Card */}
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06]
                              rounded-xl p-3 mb-5">
                <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#6384ff] to-[#a78bfa]
                                flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold truncate">{user?.name || "User"}</p>
                  <p className="text-[11px] text-white/35 truncate">{user?.email || ""}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide
                                 bg-[#6384ff]/12 border border-[#6384ff]/20
                                 text-[#6384ff] px-2 py-0.5 rounded-full shrink-0">
                  {role}
                </span>
              </div>

              {/* Sidebar Items */}
              <div className="flex flex-col gap-1">
                {(role === "user" || role === "vendor") && (
                  <SideItem icon={<Home size={16} />} label="Home" delay={0.05} />
                )}
                {role === "user" && (
                  <>
                    <SideItem icon={<ShoppingCart size={16} />} label="Cart" delay={0.08} />
                    <SideItem icon={<Phone size={16} />} label="Call" delay={0.11} />
                  </>
                )}
                {role === "vendor" && (
                  <SideItem icon={<Phone size={16} />} label="Orders" delay={0.08} />
                )}

                <div className="h-px bg-white/[0.06] my-2" />

                <SideItem icon={<UserCircle size={16} />} label="My Profile" delay={0.14} />

                <SideItem icon={<Settings size={16} />} label="Settings" delay={0.17} />

                <motion.button
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] mt-1
                             text-[13px] text-red-400/80 hover:text-red-400
                             hover:bg-red-500/[0.08] transition-all duration-150"
                >
                  <LogOut size={16} />
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-medium
                     border cursor-pointer transition-all duration-150
                     ${active
        ? "text-[#6384ff] bg-[#6384ff]/08 border-[#6384ff]/18"
        : "text-white/55 border-transparent hover:text-white hover:bg-white/05 hover:border-white/07"
      }`}>
      {icon}
      {label}
    </div>
  );
}

function DropItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px]
                    text-white/70 hover:text-white hover:bg-white/[0.05]
                    cursor-pointer transition-all duration-150">
      <span className="text-white/35">{icon}</span>
      {label}
    </div>
  );
}

function SideItem({ icon, label, delay = 0 }: { icon: React.ReactNode; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]
                 text-[13px] text-white/65 hover:text-white
                 hover:bg-white/[0.05] cursor-pointer transition-all duration-150"
    >
      {icon}
      {label}
    </motion.div>
  );
}

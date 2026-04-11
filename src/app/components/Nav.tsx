'use client'

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingCart, Phone, User, LogOut, X, Menu, ChevronDown, Settings, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar({ user }: any) {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const role = user?.role;

    // Close profile popup on outside click
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
            {/* NAVBAR */}
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full px-6 h-16 border-b border-white/10 flex items-center justify-between text-white bg-gradient-to-tr from-black via-blue-950 to-black"
            >
                {/* SVG LOGO */}
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="38" height="38" rx="10" fill="url(#grad)" />
                            <path d="M10 14h18M10 19h18M10 24h18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                            <circle cx="19" cy="10" r="3" fill="#60a5fa" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#1e3a8a" />
                                    <stop offset="1" stopColor="#1d4ed8" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-white font-bold text-xl tracking-wide"
                    >
                        Multi<span className="text-blue-400">Mart</span>
                    </motion.span>
                </div>

                {/* DESKTOP MENU */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="hidden md:flex items-center gap-6 text-sm"
                >
                    {(role === "user" || role === "vendor") && (
                        <NavItem icon={<Home size={18} />} label="Home" />
                    )}
                    {role === "user" && (
                        <>
                            <NavItem icon={<ShoppingCart size={18} />} label="Cart" />
                            <NavItem icon={<Phone size={18} />} label="Call" />
                        </>
                    )}
                    {role === "vendor" && (
                        <NavItem icon={<Phone size={18} />} label="Orders" />
                    )}

                    {/* PROFILE BUTTON - DESKTOP */}
                    <div ref={profileRef} className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
                        >
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <span className="text-sm">{user?.name?.split(" ")[0] || "Profile"}</span>
                            <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown size={14} />
                            </motion.div>
                        </motion.button>

                        {/* PROFILE POPUP */}
                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-12 w-56 bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl p-2 z-50"
                                >
                                    {/* USER INFO */}
                                    <div className="px-3 py-2 mb-1 border-b border-white/10">
                                        <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
                                        <p className="text-xs text-white/40 truncate">{user?.email || ""}</p>
                                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                                            {role}
                                        </span>
                                    </div>

                                    <PopupItem icon={<UserCircle size={15} />} label="My Profile" />
                                    <PopupItem icon={<Settings size={15} />} label="Settings" />

                                    <div className="border-t border-white/10 mt-1 pt-1">
                                        <motion.button
                                            whileHover={{ x: 3 }}
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <LogOut size={15} />
                                            Sign Out
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* MOBILE MENU BUTTON */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setOpen(true)}
                    className="md:hidden text-white"
                >
                    <Menu />
                </motion.button>
            </motion.div>

            {/* BACKDROP + SIDEBAR */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-72 bg-[#080c14] border-l border-white/10 z-50 p-5 text-white"
                        >
                            {/* SIDEBAR HEADER */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <svg width="28" height="28" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="38" height="38" rx="10" fill="url(#grad2)" />
                                        <path d="M10 14h18M10 19h18M10 24h18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                                        <circle cx="19" cy="10" r="3" fill="#60a5fa" />
                                        <defs>
                                            <linearGradient id="grad2" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#1e3a8a" />
                                                <stop offset="1" stopColor="#1d4ed8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <h2 className="text-lg font-bold text-blue-400">MultiMart</h2>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.8, rotate: 90 }}
                                    onClick={() => setOpen(false)}
                                    className="text-white/60 hover:text-white transition"
                                >
                                    <X />
                                </motion.button>
                            </div>

                            {/* USER CARD IN SIDEBAR */}
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                                    <p className="text-xs text-white/40 truncate">{user?.email || ""}</p>
                                </div>
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full capitalize shrink-0">
                                    {role}
                                </span>
                            </div>

                            {/* SIDEBAR ITEMS */}
                            <div className="flex flex-col gap-2">
                                {(role === "user" || role === "vendor") && (
                                    <SideItem icon={<Home size={18} />} label="Home" delay={0.05} />
                                )}
                                {role === "user" && (
                                    <>
                                        <SideItem icon={<ShoppingCart size={18} />} label="Cart" delay={0.1} />
                                        <SideItem icon={<Phone size={18} />} label="Call" delay={0.15} />
                                    </>
                                )}
                                {role === "vendor" && (
                                    <SideItem icon={<Phone size={18} />} label="Orders" delay={0.1} />
                                )}

                                <hr className="border-white/10 my-2" />

                                <SideItem icon={<UserCircle size={18} />} label="My Profile" delay={0.2} />
                                <SideItem icon={<Settings size={18} />} label="Settings" delay={0.25} />

                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ x: 5 }}
                                    onClick={() => signOut()}
                                    className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors mt-1"
                                >
                                    <LogOut size={18} />
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

function NavItem({ icon, label }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition"
        >
            {icon}
            <span>{label}</span>
        </motion.div>
    );
}

function SideItem({ icon, label, delay = 0 }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
        >
            {icon}
            <span>{label}</span>
        </motion.div>
    );
}

function PopupItem({ icon, label }: any) {
    return (
        <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer text-sm text-white/80 hover:text-white transition-colors"
        >
            {icon}
            <span>{label}</span>
        </motion.div>
    );
}

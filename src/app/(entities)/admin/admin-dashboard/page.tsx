"use client"

import { useState } from "react";
import { LayoutDashboard, Store, ShoppingCart, UserCheck, PackageSearch, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminDashBoard from "../admin-components/AdminDashBoard";
import AllVendors from "../admin-components/AllVendors";
import ProductRequest from "../admin-components/ProductRequest";
import UserOrder from "../admin-components/UserOrder";
import VendorApproved from "../admin-components/VendorApproved";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Vendors", icon: Store },
    { name: "User Orders", icon: ShoppingCart },
    { name: "Vendor Approved", icon: UserCheck },
    { name: "Product Request", icon: PackageSearch },
];

export default function AdminDash() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("Dashboard");


    const Renderpage = () => {
        switch (active) {
            case "Dashboard": return <AdminDashBoard />
            case "Vendors": return <AllVendors />
            case "Product Request": return <ProductRequest />
            case "User Orders": return <UserOrder />
            case "Vendor Approved": return <VendorApproved />

        }

    }

    return (
        <div className="flex h-screen bg-[#030712] overflow-hidden">

            {/* DESKTOP SIDEBAR */}
            <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="hidden md:flex flex-col w-64 bg-[#0a0f1e] border-r border-white/5 p-5 shrink-0"
            >
                {/* LOGO */}
                <div className="flex items-center gap-3 mb-8 ml-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <LayoutDashboard size={16} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-lg">
                        Admin<span className="text-blue-400">Panel</span>
                    </span>
                </div>

                {/* MENU */}
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3 px-2">Main Menu</p>
                <div className="flex flex-col gap-1">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = active === item.name;
                        return (
                            <motion.div
                                key={index}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.07 }}
                                onClick={() =>{setActive(item.name)
                                
                                } }
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors group
                                    ${isActive ? "bg-blue-600/20 text-blue-400" : "text-white/50 hover:text-white hover:bg-white/5"}`}




                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 rounded-xl bg-blue-600/10 border border-blue-500/20"
                                    />
                                )}
                                <Icon size={18} className={isActive ? "text-blue-400" : ""} />
                                <span className="text-sm font-medium relative z-10">{item.name}</span>

                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 relative z-10" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>



            </motion.div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* MOBILE TOP BAR */}
                <div className="md:hidden flex items-center justify-between bg-[#0a0f1e] border-b border-white/5 text-white px-6 h-14 shrink-0">
                    <span className="font-bold text-blue-400">Panel Options</span>
                    <motion.div whileTap={{ scale: 0.85 }}>
                        <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
                    </motion.div>
                </div>

                {/* MAIN CONTENT */}
                <motion.div
                    className="flex-1 p-6 overflow-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >

                    {

                        Renderpage()


                    }

                </motion.div>
            </div>

            {/* MOBILE SIDEBAR */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 w-64 h-full bg-[#0a0f1e] border-r border-white/5 p-5 z-50 text-white"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg">
                                    Admin<span className="text-blue-400">Panel</span>
                                </span>
                                <motion.div whileTap={{ rotate: 90, scale: 0.8 }}>
                                    <X onClick={() => setOpen(false)} className="cursor-pointer text-white/50 hover:text-white" />
                                </motion.div>
                            </div>

                            <p className="text-white/30 text-xs uppercase tracking-widest mb-3 px-2">Main Menu</p>

                            <div className="flex flex-col gap-1">
                                {menuItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = active === item.name;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.06 }}
                                            onClick={() => { setActive(item.name); setOpen(false); }}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
                                                ${isActive ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-sm font-medium">{item.name}</span>
                                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

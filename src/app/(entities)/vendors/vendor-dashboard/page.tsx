"use client"

import { useState } from "react";
import { LayoutDashboard, ShoppingCart, PackageSearch, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IUser } from "@/model/user.model";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import VendorDashboard from "../vendor-components/VendorDashboard";
import VendorProductPage from "../vendor-components/ProductPage";
import VendorOrder from "../vendor-components/VendorOrder";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Products", icon: PackageSearch },
  { name: "Orders", icon: ShoppingCart },
];

export default function VendorDash({ user }: { user: IUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");



  const [shopName, setShopName] = useState(user.shopName);
  const [shopAddress, setShopAddress] = useState(user.shopAddress);
  const [gstNumber, setGstNumber] = useState(user.gstNumber);
  const [Loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

const  Renderpage = ()=>{
  switch(active){
    case "Dashboard" : return <VendorDashboard />
    case "Products" : return <VendorProductPage/>
    case "Orders" : return <VendorOrder />
  }

}




  if (!user) return "Loading.....";

  const handleVerifyAgain = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.post("/api/vendor/edit-again-shop-details", { shopName, shopAddress, gstNumber });
      console.log(res);
      if (res) {
        toast.success(res.data.message);
        setGstNumber("");
        setShopAddress("");
        setShopName("");
        setLoading(false);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("SomeThing went worng");
      setGstNumber("");
      setShopAddress("");
      setShopName("");
      setLoading(false);
    }
  };

  // ── PENDING ───────────────────────────────────────────────────────────────────
  if (user?.verificationStatus === "pending")
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center p-10 bg-amber-500/8 border border-amber-500/15 rounded-3xl max-w-sm w-full"
        >
          {/* Pulsing ring around emoji */}
          <div className="relative inline-flex mb-6">
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.25, 0, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-amber-500/20"
            />
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
              ⏳
            </div>
          </div>

          <h2 className="text-amber-400 text-xl font-bold">Verification Pending</h2>
          <p className="text-white/40 text-sm mt-2">We'll notify you once approved</p>
        </motion.div>
      </div>
    );

  // ── REJECTED ──────────────────────────────────────────────────────────────────
  if (user?.verificationStatus === "reject")
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center px-4 py-12 gap-4">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center p-8 bg-red-500/8 border border-red-500/15 rounded-3xl flex flex-col items-center w-full max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl mb-4">
            ❌
          </div>
          <h2 className="text-red-400 text-xl font-bold">Verification Rejected</h2>
          <p className="text-white/40 text-sm mt-2">Contact support for assistance</p>

          {/* Reject reason - styled box */}
          <div className="mt-4 w-full bg-red-950/30 border border-red-900/25 rounded-2xl px-4 py-3 text-left">
            <p className="text-red-400/50 text-[10px] uppercase tracking-widest mb-1">Reject Reason</p>
            <p className="text-white text-sm">{user.rejectReason}</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setFormOpen((pe) => !pe)}
            className="mt-5 flex items-center gap-2 w-[140px] h-[40px] bg-red-500 hover:bg-red-600 transition-colors rounded-xl justify-center cursor-pointer font-bold text-white text-sm"
          >
            {formOpen ? <><X size={14} /> Close</> : "Verify Again"}
          </motion.button>
        </motion.div>

        {/* Re-apply form */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden w-full max-w-md"
            >
              <form
                onSubmit={handleVerifyAgain}
                className="bg-[#0f1117] border border-white/6 rounded-3xl p-6 flex flex-col gap-4"
              >
                <p className="text-white/60 text-xs uppercase tracking-widest">Update shop details</p>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40">Shop Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/40 transition-all"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40">Shop Address</label>
                  <input
                    type="text"
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/40 transition-all"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/40">GST Number</label>
                  <input
                    type="text"
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/40 transition-all"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                  />
                </div>

                <button
                  disabled={Loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition-colors font-bold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {Loading && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {Loading ? "Submitting..." : "Send request and verify again"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

  // ── APPROVED ──────────────────────────────────────────────────────────────────
  if (user?.verificationStatus === "approved") {
    return (
      <div className="flex h-screen bg-[#030712] overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="hidden md:flex flex-col w-60 bg-[#0a0f1e] border-r border-white/5 shrink-0"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-base">
              Vendor<span className="text-blue-400">Panel</span>
            </span>
          </div>

          {/* Menu */}
          <div className="flex-1 px-3 py-5">
            <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3 px-2">Main Menu</p>
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
                    onClick={() => setActive(item.name)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors group
                      ${isActive ? "text-blue-400" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-blue-600/12 border border-blue-500/15"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon size={17} className={`relative z-10 ${isActive ? "text-blue-400" : ""}`} />
                    <span className="text-sm font-medium relative z-10">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 relative z-10" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* MOBILE TOP BAR */}
          <div className="md:hidden flex items-center justify-between bg-[#0a0f1e] border-b border-white/5 text-white px-5 h-14 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                <LayoutDashboard size={12} className="text-white" />
              </div>
              <span className="font-bold text-sm text-blue-400">VendorPanel</span>
            </div>
            <motion.div whileTap={{ scale: 0.85 }}>
              <Menu
                onClick={() => setOpen(true)}
                className="cursor-pointer text-white/60 hover:text-white transition-colors"
                size={20}
              />
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
                className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 w-60 h-full bg-[#0a0f1e] border-r border-white/5 p-5 z-50 text-white flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-base">
                    Vendor<span className="text-blue-400">Panel</span>
                  </span>
                  <motion.div whileTap={{ rotate: 90, scale: 0.8 }}>
                    <X
                      onClick={() => setOpen(false)}
                      className="cursor-pointer text-white/50 hover:text-white transition-colors"
                      size={18}
                    />
                  </motion.div>
                </div>

                <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3 px-2">Main Menu</p>

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
                          ${isActive
                            ? "bg-blue-600/15 text-blue-400 border border-blue-500/15"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <Icon size={17} />
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
}

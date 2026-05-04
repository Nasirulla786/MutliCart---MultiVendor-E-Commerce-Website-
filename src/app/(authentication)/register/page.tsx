'use client'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import axios from 'axios';
import toast from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { User, Shield, Store } from "lucide-react"

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role,setRole] = useState("user")
  const [ step , setStep] = useState(1);
  const router = useRouter();


  const roles = [
    {
      id: "user",
      label: "User",
      desc: "Buy products & explore",
      icon: User,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "admin",
      label: "Admin",
      desc: "Manage system",
      icon: Shield,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "vendor",
      label: "Vendor",
      desc: "Sell your products",
      icon: Store,
      color: "from-pink-500 to-rose-500"
    }
  ]

  const handleSubmit = async () => {

    try {
      if(!name ||!email || !password){
        toast.error("required All fields");
      }
      setLoading(true);
      const res = await axios.post("/api/auth/register", { name, email, password })
      router.push("/")

        toast.success(res.data.message);
        setEmail("");
        setName("");
        setPassword("");
        setLoading(false);





    } catch (error) {
      console.log("error of resgiter");
      setEmail("");
      setName("");
      setPassword("");
      setLoading(false);

    }
  }
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-black via-blue-950 to-black'>



{
  step==1 &&
<div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#070e1e] font-sans">

      {/* GLOW */}
      <div className="absolute w-[320px] h-[320px] rounded-full top-[-80px] left-[-80px] animate-pulse"
        style={{ background: "radial-gradient(circle, #7c3aed44 0%, transparent 70%)" }} />
      <div className="absolute w-[260px] h-[260px] rounded-full bottom-[-60px] right-[-60px] animate-pulse"
        style={{ background: "radial-gradient(circle, #2563eb44 0%, transparent 70%)" }} />

      {/* FLOATING ICONS */}
      <motion.span animate={{ y: [0, -14, 0] }} transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-7 left-6 text-[22px] opacity-30 select-none">🛍️</motion.span>
      <motion.span animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-16 right-7 text-[22px] opacity-30 select-none">📦</motion.span>
      <motion.span animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-10 left-9 text-[22px] opacity-30 select-none">⚡</motion.span>

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-center max-w-sm w-full">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-[72px] h-[72px] rounded-[20px] mx-auto mb-5 flex items-center justify-center text-white text-[28px] font-bold"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
            boxShadow: "0 0 30px #8b5cf640"
          }}
        >
          M
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="text-[28px] font-medium m-0"
          style={{
            background: "linear-gradient(135deg, #e2e8f0, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Multi Mart
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[13px] text-slate-400 tracking-widest mt-1.5 mb-0"
        >
          Shop &bull; Sell &bull; Manage
        </motion.p>

        {/* DIVIDER */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="w-10 h-px mx-auto my-5"
          style={{ background: "linear-gradient(90deg, transparent, #8b5cf660, transparent)" }}
        />

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className="flex justify-center items-stretch gap-6 mb-5"
        >
          {[
            { num: "12K+", desc: "Products" },
            { num: "3 Roles", desc: "One Platform" },
            { num: "24/7", desc: "Support" },
          ].map((s, i) => (
            <div key={i} className="flex items-stretch gap-6">
              {i > 0 && <div className="w-px bg-white/10 self-stretch" />}
              <div className="text-center">
                <div className="text-[18px] font-medium text-slate-200">{s.num}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ROLE CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-2.5"
        >
          {[
            { icon: "🛍️", label: "User" },
            { icon: "🏪", label: "Vendor" },
            { icon: "⚙️", label: "Admin" },
          ].map((r) => (
            <div
              key={r.label}
              className="rounded-[14px] py-3.5 px-2 text-center border border-white/10 bg-white/[0.04] transition-all duration-200 hover:-translate-y-1 hover:bg-purple-500/10 hover:border-purple-500/40 cursor-default"
            >
              <span className="text-[20px] block mb-1.5">{r.icon}</span>
              <span className="text-[11px] text-slate-400 tracking-wide">{r.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ translateY: -2, opacity: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setStep(2)}
          className="mt-5 w-full py-3 rounded-[14px] border-none text-white text-[14px] font-medium tracking-wide cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
          }}
        >
          Enter App →
        </motion.button>

        {/* TRUST LINE */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-3 text-[11px] text-slate-600"
        >
          Secure <span className="mx-1 text-purple-800">•</span> Fast <span className="mx-1 text-purple-800">•</span> Reliable
        </motion.p>

      </div>
    </div>
}

 {
  step==2 &&      <motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className='w-[90%] md:w-[450px] bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl'
>

  {/* Title */}
  <h1 className='text-3xl font-bold text-white text-center mb-6'>
    Create Account
  </h1>

  {/* Name */}
  <input
    type="text"
    placeholder='Full Name'
    className='w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500'
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  {/* Email */}
  <input
    type="email"
    placeholder='Email'
    className='w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500'
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  {/* Password */}
  <input
    type="password"
    placeholder='Password'
    className='w-full mb-6 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500'
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* Register Button */}
  <motion.button
whileTap={{ scale: 0.95 }}
whileHover={{ scale: 1.05 }}
onClick={handleSubmit}
className='w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold mb-4 flex items-center justify-center'
>
{loading ? (
<Oval
height={20}
width={20}
color="white"
secondaryColor="gray"
/>
) : (
"Register"
)}
</motion.button>

  {/* Divider */}
  <div className='flex items-center gap-2 my-4'>
    <div className='flex-1 h-[1px] bg-gray-400'></div>
    <p className='text-gray-300 text-sm'>OR</p>
    <div className='flex-1 h-[1px] bg-gray-400'></div>
  </div>

  {/* Google Button */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className='w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-medium'

    onClick={()=>{
      signIn("google" , {callbackUrl:"/"})
    }}
  >
    <Image
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="google"
      className='w-5 h-5'
      width={5}
      height={5}
    />
    Continue with Google
  </motion.button>

  {/* Footer */}
  <p className='text-center text-gray-300 mt-5 text-sm'>
    Already have an account? <span className='text-blue-400 cursor-pointer' onClick={()=>router.push("/login")}>Login</span>
  </p>

</motion.div>
 }
    </div>
  )
}

export default page

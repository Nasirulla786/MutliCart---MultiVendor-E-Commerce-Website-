'use client'
import React, { useState } from 'react'
import { motion } from "framer-motion"
import axios from 'axios';
import toast from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {

    try {
      if(!name ||!email || !password){
        toast.error("required All fields");
      }
      setLoading(true);
      const res = await axios.post("/api/auth/register", { name, email, password })
      if (res) {
        toast.success(res.data.message);
        setEmail("");
        setName("");
        setPassword("");
        setLoading(false);
        router.push("/")
      }



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

      <motion.div
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
    </div>
  )
}

export default page

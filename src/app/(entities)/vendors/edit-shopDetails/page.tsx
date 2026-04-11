'use client'
import { motion } from "framer-motion"
import { useState } from "react"
import { Store, MapPin, FileText, Loader2 } from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function EditShopDetails() {

    const [shopName, setShopName] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [gstNumber, setGstNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)

            const res = await axios.post("/api/vendor/edit-shop-details", {
                shopName,
                shopAddress,
                gstNumber
            })

            toast.success("Shop details updated successfully ✅")
            router.push("/vendors/vendor-dashboard")

        } catch (error) {
            toast.error("Something went wrong ❌")
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { label: "Shop Name", name: "name", placeholder: "Enter shop name", icon: Store, value: shopName, change: setShopName },
        { label: "Shop Address", name: "address", placeholder: "Enter shop address", icon: MapPin, value: shopAddress, change: setShopAddress },
        { label: "GST Number", name: "gst", placeholder: "e.g. 22AAAAA0000A1Z5", icon: FileText, value: gstNumber, change: setGstNumber },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#060612] relative overflow-hidden">

            {/* 🔥 TOASTER */}
            <Toaster position="top-right" />

            {/* BG blobs */}
            <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-blue-700 opacity-20 blur-[100px]" />
            <div className="absolute bottom-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full bg-violet-700 opacity-20 blur-[100px]" />

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-[90%] md:w-[420px] bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl text-white"
            >

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                        <Store size={22} />
                    </div>
                    <h1 className="text-2xl font-bold">Shop Details</h1>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-5">
                    {fields.map((field, i) => {
                        const Icon = field.icon
                        return (
                            <motion.div key={field.name}>
                                <label className="text-xs text-white/50 mb-1 block">
                                    {field.label}
                                </label>

                                <div className="relative">
                                    <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />

                                    <input
                                        type="text"
                                        value={field.value}
                                        onChange={(e) => field.change(e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 transition"
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    disabled={loading}
                    className="mt-8 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Saving...
                        </>
                    ) : (
                        "Submit Details"
                    )}
                </motion.button>

            </motion.form>
        </div>
    )
}

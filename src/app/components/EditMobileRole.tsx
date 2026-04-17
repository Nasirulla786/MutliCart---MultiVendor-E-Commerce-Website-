'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function EditMobileRole() {
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [checkAdmin, setCheckAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axios.get("/api/admin/check-admin");
                setCheckAdmin(res.data.exist);
            } catch (error) {
                toast.error("Failed to check admin");
            }
        };
        fetchAdmin();
    }, []);

    const router = useRouter();

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await axios.post("/api/admin/edit-phone-role", {
                role,
                phone,
            });

            toast.success("Role updated successfully ");
            console.log(res.data);
      router.push("/");



            setRole("");
            setPhone("");

        } catch (error) {
            toast.error("Something went wrong ");
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { name: "User", desc: "Normal user access", color: "from-blue-500 to-blue-700" },
        { name: "Vendor", desc: "Manage products & orders", color: "from-purple-500 to-purple-700" },
        { name: "Admin", desc: "Full system control", color: "from-red-500 to-red-700" },
    ];

    const isAdminBlock = (name:any) => name === "Admin" && checkAdmin;

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-black via-blue-950 to-black p-4">

            <Toaster position="top-right" />

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">

                <h1 className="text-white text-2xl font-bold text-center mb-6">
                    Select Your Role
                </h1>

                <div className="space-y-3">
                    {roles.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => {
                                if (isAdminBlock(item.name)) return;
                                setRole(item.name.toLowerCase());
                            }}
                            className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all
                            ${isAdminBlock(item.name)
                                ? "opacity-30 cursor-not-allowed pointer-events-none"
                                : "hover:border-white/40"
                            }
                            ${role === item.name && !isAdminBlock(item.name)
                                ? "border-white scale-[1.02] shadow-lg"
                                : "border-white/10"
                            }`}
                        >
                            <div>
                                <h2 className="text-white font-semibold">{item.name}</h2>
                                <p className="text-white/60 text-sm">{item.desc}</p>
                            </div>

                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.color}`} />
                        </div>
                    ))}
                </div>

                <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="mt-5 w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!role || loading}
                    className={`mt-5 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                    ${role && !loading
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {loading ? "Processing..." : "Next"}
                </button>
            </div>
        </div>
    );
}

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Send, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.users);

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [myMessages, setMyMessages] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ================= USERS =================
  useEffect(() => {
    const fetchUsersChats = async () => {
      const res = await axios.get("/api/support/active-users");
      setUsers(res.data.flat());
    };
    fetchUsersChats();
  }, []);

  // ================= GET ALL MESSAGES =================
  const fetchMessages = async () => {
    const res = await axios.get("/api/support/get-all-message");
    setMyMessages(res.data.chats || []);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= POLLING =================
  useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // ================= SELECTED CHAT =================
  const selectedChat: any = myMessages.find(
    (chat: any) => chat.with === selectedUser?._id
  );
  const messages: any[] = selectedChat?.message || [];

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!message || !selectedUser) return;

    const newMsg = {
      //@ts-ignore
      sender: currentUser?.user?._id,
      text: message,
      createdAt: new Date(),
    };

    // Optimistic UI
    setMyMessages((prev: any[]) => {
      const updated = [...prev];
      const index = updated.findIndex((c: any) => c.with === selectedUser._id);
      if (index !== -1) {
        updated[index].message.push(newMsg);
      } else {
        updated.push({ with: selectedUser._id, message: [newMsg] });
      }
      return updated;
    });

    setMessage("");
    // Clear suggestions after sending
    setSuggestions([]);

    try {
      await axios.post("/api/support/send-message", {
        recId: selectedUser?._id,
        message,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ================= AI SUGGESTIONS =================
  const getSuggestions = async () => {
    try {
      if (!messages || messages.length === 0) return;
      setLoadingSuggestions(true);
      setSuggestions([]);

      const lastMessage = messages[messages.length - 1];

      const res = await axios.post("/api/support/ai-suggestion", {
        messages: [lastMessage.text],
        //@ts-ignore
        role: currentUser?.user?.role,
        targetRole: selectedUser?.role,
      });

      // ✅ Map suggestions to state
      const data: string[] = res.data?.suggestionsSend || [];
      setSuggestions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Use suggestion as message input
  const useSuggestion = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="w-screen h-screen bg-[#0b0f19] text-white flex overflow-hidden relative">

      {/* ====== MOBILE SIDEBAR OVERLAY ====== */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ================= LEFT: USERS ================= */}
      <motion.div
        className={`
          fixed md:relative z-30 md:z-auto
          h-full md:h-auto
          w-[280px] md:w-[280px] lg:w-[300px]
          border-r border-white/10
          p-3 flex flex-col gap-2 overflow-y-auto
          bg-[#0b0f19]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar close button (mobile only) */}
        <div className="flex items-center justify-between mb-1 md:hidden">
          <p className="text-xs text-white/40 uppercase tracking-widest">Active Users</p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-white/40 uppercase tracking-widest hidden md:block mb-1">
          Active Users
        </p>

        <AnimatePresence>
          {users.map((u: any, index: number) => (
            <motion.div
              key={u._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedUser(u);
                setSuggestions([]);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                ${selectedUser?._id === u._id
                  ? "bg-blue-600/25 ring-1 ring-blue-500/30"
                  : "bg-white/5 hover:bg-white/10"
                }`}
            >
              <img
                src={u?.image || "https://via.placeholder.com/40"}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm truncate">{u.name}</p>
                <p className="text-xs text-white/40 truncate">{u.role}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ================= RIGHT: CHAT ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <motion.div
          key={selectedUser?._id || "empty"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-14 border-b border-white/10 flex items-center px-3 gap-3 flex-shrink-0"
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 transition md:hidden flex-shrink-0"
          >
            <Menu size={18} />
          </button>

          {/* Back button */}
          <button
            onClick={() => {
              if (selectedUser) {
                setSelectedUser(null);
                setSuggestions([]);
              } else {
                router.back();
              }
            }}
            className="p-2 rounded-full hover:bg-white/10 transition flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          {selectedUser ? (
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedUser.image || "https://via.placeholder.com/40"}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{selectedUser.name}</p>
                <p className="text-xs text-white/40 truncate">{selectedUser.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-white/40 text-sm">No conversation selected</p>
          )}
        </motion.div>

        {/* CHAT BODY */}
        <div className="flex-1 p-3 md:p-4 overflow-y-auto flex flex-col gap-2">
          {!selectedUser ? (
            <p className="text-white/30 text-center text-sm mt-10">
              Select a user to start chat
            </p>
          ) : messages.length === 0 ? (
            <p className="text-white/30 text-center text-sm mt-10">
              No messages yet
            </p>
          ) : (
            messages.map((msg: any, i: number) => {
              //@ts-ignore
              const isMe = msg.sender.toString() === currentUser?.user?._id;
              return (
                <div
                  key={i}
                  className={`max-w-[75%] sm:max-w-[65%] px-3 py-2 rounded-xl text-sm leading-relaxed
                    ${isMe
                      ? "bg-blue-600 self-end rounded-br-sm"
                      : "bg-white/10 self-start rounded-bl-sm"
                    }`}
                >
                  {msg.text}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* ====== AI SUGGESTIONS PANEL ====== */}
        <AnimatePresence>
          {selectedUser && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-3 pb-2 border-t border-white/8 pt-3 bg-white/[0.02]"
            >
              <p className="text-xs text-white/35 uppercase tracking-widest mb-2">
                AI Suggestions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s: string, i: number) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => useSuggestion(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30
                      text-blue-300 hover:bg-blue-500/25 transition cursor-pointer"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI SUGGESTION BUTTON */}
        {selectedUser && (
          <div className="px-3 pb-2">
            <button
              onClick={getSuggestions}
              disabled={loadingSuggestions}
              className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition
                bg-gradient-to-r from-pink-500/20 to-purple-500/20
                border border-pink-400/25 text-pink-300
                hover:from-pink-500/30 hover:to-purple-500/30
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Sparkles size={14} />
              {loadingSuggestions ? "Fetching suggestions..." : "AI Suggestions"}
            </button>
          </div>
        )}

        {/* INPUT */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type message..."
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-lg
                  outline-none text-sm focus:border-blue-500/50 transition min-w-0"
              />
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={handleSend}
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition
                  flex items-center gap-2 text-sm flex-shrink-0"
              >
                <Send size={14} />
                <span className="hidden sm:inline">Send</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const { currentUser } = useSelector((state: RootState) => state.users);

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [myMessages, setMyMessages] = useState<any[]>([]);

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

    // ✅ Optimistic UI
    setMyMessages((prev: any[]) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (c: any) => c.with === selectedUser._id
      );

      if (index !== -1) {
        updated[index].message.push(newMsg);
      } else {
        updated.push({
          with: selectedUser._id,
          message: [newMsg],
        });
      }

      return updated;
    });

    setMessage("");

    try {
      await axios.post("/api/support/send-message", {
        recId: selectedUser?._id,
        message,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0b0f19] text-white flex overflow-hidden">

      {/* ================= LEFT: USERS ================= */}
      <div className="w-[300px] border-r border-white/10 p-3 flex flex-col gap-3 overflow-y-auto">
        <AnimatePresence>
          {users.map((u: any, index: number) => (
            <motion.div
              key={u._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                ${
                  selectedUser?._id === u._id
                    ? "bg-blue-600/30"
                    : "bg-white/5 hover:bg-white/10"
                }
              `}
            >
              <img
                src={u?.image || "https://via.placeholder.com/40"}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="text-sm">{u.name}</p>
                <p className="text-xs text-white/50">{u.role}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ================= RIGHT: CHAT ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <motion.div
          key={selectedUser?._id || "empty"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 border-b border-white/10 flex items-center px-4 gap-3"
        >
          {/* 🔙 SMART BACK BUTTON */}
          <button
            onClick={() => {
              if (selectedUser) {
                setSelectedUser(null);
              } else {
                router.back();
              }
            }}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft size={20} />
          </button>

          {selectedUser ? (
            <div className="flex items-center gap-3">
              <img
                src={selectedUser.image || "https://via.placeholder.com/40"}
                className="w-8 h-8 rounded-full"
              />
              <p>{selectedUser.name}</p>
            </div>
          ) : (
            <p className="text-white/50">No conversation selected</p>
          )}
        </motion.div>

        {/* CHAT BODY */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
          {!selectedUser ? (
            <p className="text-white/50 text-center">
              Select a user to start chat
            </p>
          ) : messages.length === 0 ? (
            <p className="text-white/50 text-center">
              No messages yet
            </p>
          ) : (
            messages.map((msg: any, i: number) => {
              const isMe =
              //@ts-ignore
                msg.sender.toString() === currentUser?.user?._id;

              return (
                <div
                  key={i}
                  className={`max-w-[60%] px-3 py-2 rounded-lg text-sm
                  ${
                    isMe
                      ? "bg-blue-600 self-end"
                      : "bg-white/10 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-white/5 px-3 py-2 rounded-lg outline-none"
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Send
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;

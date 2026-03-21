"use client";

import { Message } from "@/lib/types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  currentUserId?: string;
}

const MessageBubble = ({ message, currentUserId }: MessageBubbleProps) => {
  if (!message) return null;

  const isOwn = message.sender === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-xl shadow-sm break-words ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-[6px] rounded-tl-xl rounded-tr-xl"
            : "bg-gray-100 text-gray-800 rounded-bl-[6px] rounded-tr-xl rounded-tl-xl"
        }`}
      >
        {/* MESSAGE TEXT */}
        <p className="text-sm leading-relaxed">{message.text}</p>

        {/* TIME + Seen */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${
              isOwn ? "text-white/70" : "text-gray-500"
            }`}
          >
            {message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>

          {/* Show check if sent by current user */}
          {isOwn && <Check className="w-3 h-3 text-white/70" />}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
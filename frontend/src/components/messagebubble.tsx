import { Message } from "@/smapledata";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[70%] px-4 py-2.5 ${
          message.isOwn
            ? "bg-chat-own text-chat-own-foreground rounded-[20px] rounded-br-md"
            : "bg-chat-other text-chat-other-foreground rounded-[20px] rounded-bl-md"
        }`}
      >
        <p className="text-[13px] leading-relaxed">{message.text}</p>
        <div
          className={`flex items-center gap-1 mt-1 ${
            message.isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${
              message.isOwn ? "text-chat-own-foreground/50" : "text-muted-foreground"
            }`}
          >
            {message.timestamp}
          </span>
          {message.isOwn && (
            <Check className="w-3 h-3 text-chat-own-foreground/50" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;

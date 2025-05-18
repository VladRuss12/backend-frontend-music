import React, { useState } from "react";
import { sendMessageToAI } from "../api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text) => {
    setMessages([...messages, { from: "user", text }]);
    setIsLoading(true);
    try {
      const response = await sendMessageToAI(text);
      setMessages((msgs) => [...msgs, { from: "ai", text: response }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {messages.map((m, i) => <MessageBubble key={i} from={m.from} text={m.text} />)}
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
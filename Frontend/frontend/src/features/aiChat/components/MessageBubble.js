import React from "react";

export default function MessageBubble({ from, text }) {
  const isUser = from === "user";
  return (
    <div
      style={{
        maxWidth: "70%",
        margin: isUser ? "8px auto 8px 0" : "8px 0 8px auto",
        padding: "10px 16px",
        borderRadius: "16px",
        background: isUser ? "#DCF8C6" : "#F1F0F0",
        alignSelf: isUser ? "flex-end" : "flex-start",
        textAlign: "left",
      }}
    >
      <span>{text}</span>
    </div>
  );
}
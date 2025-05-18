import React, { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: "flex", marginTop: 16 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        style={{ flex: 1, padding: 8, fontSize: 16 }}
        placeholder="Введите сообщение..."
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        style={{ marginLeft: 8, padding: "8px 16px", fontSize: 16 }}
      >
        Отправить
      </button>
    </form>
  );
}
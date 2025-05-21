import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { sendMessageToAI } from "../chatService";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { addMessage, setLoading, setError, clearChat } from "../chatSlice";

export default function ChatWindow({ onClose }) {
  const messages = useSelector(state => state.chat.messages);
  const isLoading = useSelector(state => state.chat.isLoading);
  const dispatch = useDispatch();

  const handleSend = async (text) => {
    dispatch(addMessage({ from: "user", text }));
    dispatch(setLoading(true));
    try {
      const response = await sendMessageToAI(text);
      dispatch(addMessage({ from: "ai", text: response }));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError("Ошибка при отправке"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 70,
        right: 32,
        width: 340,
        height: 480,
        bgcolor: "background.paper",
        boxShadow: 6,
        borderRadius: 2,
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>Чат с AI</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((m, i) => <MessageBubble key={i} from={m.from} text={m.text} />)}
      </Box>
      <Box sx={{ p: 1 }}>
        <MessageInput onSend={handleSend} disabled={isLoading} />
      </Box>
    </Box>
  );
}
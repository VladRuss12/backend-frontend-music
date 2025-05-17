import React from "react";
import { IconButton, Avatar } from "@mui/material";

export default function UserAvatar({ avatarUrl, onClick }) {
  return (
    <IconButton onClick={onClick}>
      <Avatar
        alt="User Avatar"
        src={avatarUrl || "/default-avatar.png"}
        sx={{ width: 32, height: 32 }}
      />
    </IconButton>
  );
}

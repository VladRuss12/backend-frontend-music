// ProfileInfo.jsx
import React from "react";
import { Avatar, Typography, Box } from "@mui/material";

export default function ProfileInfo({ profile }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar
        src={profile.avatar_url || "/default-avatar.png"}
        alt={profile.username}
        sx={{ width: 80, height: 80 }}
      />
      <Box>
        <Typography variant="h5">{profile.username}</Typography>
        <Typography variant="body1" color="text.secondary">
          {profile.email}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {profile.bio || "Пользователь пока не добавил описание"}
        </Typography>
      </Box>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import SearchInput from "./SearchInput";
import UserAvatar from "./UserAvatar";
import SettingsButton from "./SettingsButton.js";

export default function Header() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    
    if (token) {
      const fetchProfile = async () => {
        try {
          const response = await axiosInstance.get("/users/me");
          setAvatarUrl(response.data.avatar_url);
        } catch (error) {
          console.error("Ошибка загрузки аватара:", error);
        }
      };
      fetchProfile();
    }
  }, []);

  const handleAvatarClick = () => {
    if (isAuthenticated) navigate("/users/me");
    else navigate("/auth/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          component="h6"
          sx={{ cursor: "pointer", fontWeight: "bold", fontSize: 20 }}
          onClick={() => navigate("/")}
        >
          MusicAppFrontend
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SearchInput onSearch={(query) => navigate(`/search?q=${query}`)} />
          <SettingsButton onClick={() => navigate("/settings")} />
          <UserAvatar avatarUrl={avatarUrl} onClick={handleAvatarClick} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

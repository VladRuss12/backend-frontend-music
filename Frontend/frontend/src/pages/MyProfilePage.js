import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; 
import {
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/auth/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Если 401 Unauthorized или другая ошибка — отправляем на логин
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">Профиль не найден</Typography>
        <Button variant="contained" onClick={() => navigate("/auth/login")}>
          Войти
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2, boxShadow: 2 }}>
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
    </Box>
  );
}

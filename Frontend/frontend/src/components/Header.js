import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Box,
    Avatar,
  } from "@mui/material";
  import SearchIcon from "@mui/icons-material/Search";
  import SettingsIcon from "@mui/icons-material/Settings";
  import { useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axiosInstance from "../api/axiosInstance"; 
  
  export default function Header() {
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem("access_token"); 
  
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
  
        try {
          const response = await axiosInstance.get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setAvatarUrl(response.data.avatarUrl);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Ошибка при загрузке профиля:", error);
          setIsAuthenticated(false);
        }
      };
  
      fetchProfile();
    }, []);
  
    const handleAvatarClick = () => {
      if (isAuthenticated) {
        navigate("/users/me");
      } else {
        navigate("/auth/login");
      }
    };
  
    const handleSearch = (e) => {
      if (e.key === "Enter") {
        navigate(`/search?q=${e.target.value}`);
      }
    };
  
    return (
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            MusicAppFrontend
          </Typography>
  
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 1,
                px: 1,
              }}
            >
              <InputBase
                placeholder="Поиск…"
                sx={{ color: "inherit", ml: 1 }}
                onKeyDown={handleSearch}
              />
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
            </Box>
  
            <IconButton color="inherit" onClick={() => navigate("/settings")}>
              <SettingsIcon />
            </IconButton>
  
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                alt="User Avatar"
                src={avatarUrl || "/default-avatar.png"}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
  
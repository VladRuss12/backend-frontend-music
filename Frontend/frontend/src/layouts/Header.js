import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Tooltip } from '@mui/material';
import UserAvatar from '../features/user/components/UserAvatar';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUser } from '../features/user/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../features/aiChat/components/ChatWindow';
import ChatIcon from "@mui/icons-material/Chat";

const menuItems = [
  { text: 'Главная', path: '/' },
  { text: 'Плейлисты', path: '/playlists' },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const user = useUser();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleAvatarClick = (event) => {
    navigate('/users/me');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            MyMusicService
          </Typography>
          <Tooltip title="Чат с AI">
            <IconButton color="inherit" onClick={() => setChatOpen(o => !o)}>
              <ChatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Настройки">
            <IconButton color="inherit" onClick={handleSettingsClick}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Профиль">
            <IconButton color="inherit" onClick = {handleAvatarClick} sx={{ p: 0 }}>
              <UserAvatar user={user} size={40} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
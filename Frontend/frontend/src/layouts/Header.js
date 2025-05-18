import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Tooltip } from '@mui/material';
import UserAvatar from '../features/user/components/UserAvatar';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUser } from '../features/user/hooks/useUser';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Главная', path: '/' },
  { text: 'Плейлисты', path: '/playlists' },
  // Можно добавить другие пункты меню
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
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
          {/* Кнопка гамбургера для меню */}
          <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          {/* Название сервиса */}
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            MyMusicService
          </Typography>

          {/* Иконка настроек */}
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

      {/* Левое выезжающее меню */}
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
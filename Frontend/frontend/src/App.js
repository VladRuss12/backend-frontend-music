import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeMode } from './themes';
import AppRouter from './routes/AppRouter';
import { initializeAuth } from './features/auth/authService';
import { setCredentials } from './features/auth/authSlice'; 
import { PlayerProvider } from './features/music/context/PlayerContext';
import PlayerBar from './features/music/components/PlayerBar';

export default function App() {
  const dispatch = useDispatch();
  const { theme } = useThemeMode();

  useEffect(() => {
    initializeAuth(dispatch, setCredentials); 
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlayerProvider>
        <AppRouter />
        <PlayerBar />
      </PlayerProvider>
    </ThemeProvider>
  );
}
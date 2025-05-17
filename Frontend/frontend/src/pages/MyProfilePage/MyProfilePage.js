import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import {
  Box,
  CircularProgress,
  Button,
  Typography,
  Divider,
} from '@mui/material';

import ProfileInfo from './ProfileInfo';
import TrackList from './TrackList';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [listeningHistory, setListeningHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await axiosInstance.get("/users/me");
        console.log('Профиль:', profileRes.data);
        setProfile(profileRes.data);

        const historyRes = await axiosInstance.get("/recommendations/listening/history?entity_type=track");
        console.log('История:', historyRes.data);
        setListeningHistory(Array.isArray(historyRes.data) ? historyRes.data : []);

        const favoritesRes = await axiosInstance.get("/recommendations/listening/liked?entity_type=track");
        console.log('Избранное:', favoritesRes.data);
        setFavorites(Array.isArray(favoritesRes.data) ? favoritesRes.data : []);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
        setError(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6">Не удалось загрузить профиль</Typography>
        <Button variant="contained" onClick={() => navigate('/auth/login')}>
          Войти
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, boxShadow: 2 }}>
      <ProfileInfo profile={profile} />
      <Divider sx={{ my: 3 }} />
      <TrackList
      title="История прослушиваний"
      tracks={Array.isArray(listeningHistory) ? listeningHistory : []}
      emptyMessage="История прослушиваний пуста."
    />
    <TrackList
      title="Понравившиеся треки"
      tracks={Array.isArray(favorites) ? favorites : []}
      emptyMessage="Нет понравившихся треков."
    />
    </Box>
  );
}
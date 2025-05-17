import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";
import { usePlayer } from "../components/Player/PlayerContext";

export default function HomePage() {
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPopularPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/recommendations/popular?entity_type=playlist&limit=10");
        setPopularPlaylists(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке популярных плейлистов:", error);
      }
    };

    const fetchRecommendedTracks = async () => {
      try {
        const response = await axiosInstance.get("/recommendations/popular?entity_type=track&limit=10");
        setRecommendedTracks(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рекомендованных треков:", error);
      }
    };

    fetchPopularPlaylists();
    fetchRecommendedTracks();
  }, []);


  const { playTrack } = usePlayer();

  const handleListen = async (track) => {
    try {
     
      const url = "https://www.samplelib.com/mp3/sample-3s.mp3";
  
      playTrack({
        id: track.id,                 // <-- ОБЯЗАТЕЛЬНО!
        title: track.name,
        audioUrl: url,
        artist: track.artist,
        albumCover: track.albumCover
      });
  
      // Добавляем в историю (оставляем как было, если надо)
      const userId = localStorage.getItem("user_id");
      if (userId) {
        await axiosInstance.post(
          "/recommendations/listening/history",
          { entity_id: track.id, entity_type: "track" },
          { headers: { "X-User-ID": userId } }
        );
      }
    } catch (error) {
      console.error("Ошибка при попытке прослушать трек:", error);
    }
  };

  return (
    <Container>
      {/* Главная секция */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" gutterBottom>
          Добро пожаловать в MusicApp!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Откройте для себя новую музыку, плейлисты и многое другое.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/explore")}>
          Исследовать
        </Button>
      </Box>

      {/* Популярные плейлисты */}
      <Typography variant="h4" gutterBottom>
        Популярные плейлисты
      </Typography>
      <Grid container spacing={3}>
        {popularPlaylists.map((playlist) => (
          <Grid item xs={12} sm={6} md={4} key={playlist.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={playlist.imageUrl}
                alt={playlist.name}
              />
              <CardContent>
                <Typography variant="h6">{playlist.name}</Typography>
                <Button size="small" color="primary" onClick={() => navigate(`/playlist/${playlist.id}`)}>
                  Посмотреть
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Рекомендованные треки */}
      <Typography variant="h4" gutterBottom sx={{ mt: 6 }}>
        Рекомендованные треки
      </Typography>
      <Grid container spacing={3}>
        {recommendedTracks.map((track) => (
          <Grid item xs={12} sm={6} md={4} key={track.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={track.albumCover}
                alt={track.name}
              />
               <CardContent>
                <Typography variant="h6">{track.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {track.artist}
            </Typography>
            <Button
              size="small"
              color="primary"
              onClick={() => handleListen(track)}
            >
              Слушать
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
    </Container>
  );
}

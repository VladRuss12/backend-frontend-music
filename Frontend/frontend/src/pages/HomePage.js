import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import PopularList from '../features/recommendations/components/PopularList';
import { useUser } from '../features/user/hooks/useUser';
import TrackCard from "../features/music/components/TrackCard";
import PlaylistCard from "../features/music/components/PlaylistCard";

export default function HomePage() {
  const user = useUser();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        Добро пожаловать{user ? `, ${user.username || user.email}` : ''}!
      </Typography>
      <Divider sx={{ my: 4 }} />

      
      <PopularList
        entityType="tracks"
        recommendationType="track"
        CardComponent={TrackCard}
        title="Популярные треки"
        emptyText="Нет популярных треков"
      />
      <Divider sx={{ my: 4 }} />
      <PopularList
        entityType="playlists"
        recommendationType="playlist"
        CardComponent={PlaylistCard}
        title="Популярные плейлисты"
        emptyText="Нет популярных плейлистов"
      />

      
    </Container>
  );
}
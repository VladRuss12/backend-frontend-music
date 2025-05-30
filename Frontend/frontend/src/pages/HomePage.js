import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import PopularList from '../features/recommendations/components/PopularList';
import { useUser } from '../features/user/hooks/useUser';
import MusicCard from "../features/music/components/MusicCard"; 

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
        CardComponent={({ item }) => <MusicCard item={item} type="track" />}
        title="Популярные треки"
        emptyText="Нет популярных треков"
      />
      <Divider sx={{ my: 4 }} />
      <PopularList
        entityType="playlists"
        recommendationType="playlist"
        CardComponent={({ item }) => <MusicCard item={item} type="playlist" />}
        title="Популярные плейлисты"
        emptyText="Нет популярных плейлистов"
      />
    </Container>
  );
}
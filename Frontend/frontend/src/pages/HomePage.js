import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import PopularTracksList from '../features/recommendations/components/PopularTrackList';
import { useUser } from '../features/user/hooks/useUser';

export default function HomePage() {
  const user = useUser();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        Добро пожаловать{user ? `, ${user.username || user.email}` : ''}!
      </Typography>

      {/* Можно добавить другие секции, если нужно */}
      <Divider sx={{ my: 4 }} />

      <Box>
        <PopularTracksList />
      </Box>
    </Container>
  );
}
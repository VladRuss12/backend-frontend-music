import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { usePopularRecommendations } from '../hooks/usePopularRecommendations';
import { useTracks } from '../../music/hooks/useTracks';

export default function PopularTracksList() {
  const { ids, loading: loadingIds, error, loadPopular } = usePopularRecommendations('track', 10);
  const { tracks, loading: loadingTracks } = useTracks(ids);

  useEffect(() => {
    loadPopular();
  }, [loadPopular]);

  if (loadingIds || loadingTracks) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!tracks || tracks.length === 0) return <Typography>Нет популярных треков</Typography>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Популярные треки</Typography>
      <List>
        {tracks.map((track) => (
          <ListItem key={track.id}>
            <ListItemText
              primary={track.title}
              secondary={track.album}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
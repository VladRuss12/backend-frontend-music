import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useLikes } from '../hooks/useLikes';

export default function LikedList({ entityType = 'track' }) {
  const { liked, loading, error, loadLiked, unlike } = useLikes(entityType);

  useEffect(() => {
    loadLiked();
  }, [loadLiked]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!liked.length) return <Typography>Пока нет лайков</Typography>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Понравившееся</Typography>
      <List>
        {liked.map(item => (
          <ListItem
            key={item.id || item.track_id}
            secondaryAction={
              <IconButton edge="end" onClick={() => unlike(item.entity_id || item.id)}>
                <FavoriteIcon color="error" />
              </IconButton>
            }
          >
            <ListItemText
              primary={item.title || item.name}
              secondary={item.artist_name || item.artist}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useHistory } from '../hooks/useHistory';

export default function HistoryList({ entityType = 'track' }) {
  const { history, loading, error, loadHistory } = useHistory(entityType);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!history.length) return <Typography>История пуста</Typography>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>История прослушиваний</Typography>
      <List>
        {history.map((item) => (
          <ListItem key={item.id || item.track_id}>
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
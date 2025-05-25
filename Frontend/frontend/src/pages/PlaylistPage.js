import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper } from "@mui/material";
import { useEntity } from "../features/music/hooks/useEntity";
import { usePlayer } from "../features/music/context/PlayerContext"; 

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const { entity: playlist, loading, error } = useEntity('playlists', playlistId);
  const { playTrack, currentTrack, isPlaying, pause, resume } = usePlayer();

  const handleTrackClick = (track) => {
    if (!track) return;
    if (currentTrack?.id === track.id) {
      if (isPlaying) pause();
      else resume();
    } else {
      playTrack(track);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">Ошибка загрузки плейлиста</Typography>;
  if (!playlist) return <Typography>Плейлист не найден</Typography>;

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {playlist.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {playlist.description || "Плейлист"}
        </Typography>
      </Paper>
      <Typography variant="h6" gutterBottom>Треки:</Typography>
      <List>
        {(playlist.tracks || []).length === 0 && (
          <Typography color="text.secondary">Нет треков в этом плейлисте</Typography>
        )}
        {(playlist.tracks || []).map(track => {
          const isCurrent = currentTrack?.id === track.id;
          return (
            <ListItem
              key={track.id}
              button
              onClick={() => handleTrackClick(track)}
              selected={isCurrent}
              sx={{
                cursor: 'pointer',
                bgcolor: isCurrent ? '#e8f5e9' : undefined,
                transition: 'background 0.2s',
                borderRadius: 1,
                mb: 0.5,
                boxShadow: isCurrent ? 3 : 0
              }}
            >
              <ListItemText
                primary={track.title}
                secondary={track.performer?.name || "Исполнитель"}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
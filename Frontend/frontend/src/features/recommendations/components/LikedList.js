import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLikes } from '../hooks/useLikes';
import { useEntities } from "../../music/hooks/useEntities";
import { usePlayer } from "../../music/context/PlayerContext";
import { useEntity } from "../../music/hooks/useEntity";

// Компонент для отображения имени исполнителя с загрузкой по performer_id
function PerformerName({ performerId }) {
  const { entity: performer, loading } = useEntity("performers", performerId);
  if (!performerId) return <>Неизвестно</>;
  if (loading) return <>Загрузка исполнителя...</>;
  return <>{performer?.name || performerId}</>;
}

export default function LikedList({ entityType = 'track' }) {
  const { liked, loading, error, loadLiked, unlike } = useLikes(entityType);
  const { items: tracks } = useEntities("tracks");
  const { playTrack, currentTrack, isPlaying, pause, resume } = usePlayer();

  useEffect(() => {
    loadLiked();
  }, [loadLiked]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!liked.length) return <Typography>Пока нет лайков</Typography>;

  return (
    <Box>
      <List>
        {liked.map((item, idx) => {
          const track = tracks.find(t => t.id === item.entity_id || t.id === item.id) || item.track;
          const key = `${item.id || item.entity_id || idx}`;
          const isCurrent = currentTrack?.id === track?.id;
          const performerId = track?.performer_id;

          const handleClick = () => {
            if (!track) return;
            if (isCurrent) {
              if (isPlaying) pause();
              else resume();
            } else {
              playTrack(track);
            }
          };

          return (
            <ListItem
              key={key}
              button
              onClick={handleClick}
              selected={isCurrent}
              sx={{
                cursor: 'pointer',
                bgcolor: isCurrent ? '#f0fff0' : undefined,
              }}
              secondaryAction={
                <IconButton edge="end" onClick={e => { e.stopPropagation(); unlike(item.entity_id || item.id); }}>
                  <FavoriteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText
                primary={track ? track.title : item.title || item.name}
                secondary={
                  track
                    ? <>Исполнитель: <PerformerName performerId={performerId} /></>
                    : item.artist_name || item.artist || "Исполнитель"
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
import { useEntities } from "../../music/hooks/useEntities";
import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { usePlayer } from "../../music/context/PlayerContext";
import { useEntity } from "../../music/hooks/useEntity";

// Компонент для отображения имени исполнителя с загрузкой по performer_id
function PerformerName({ performerId }) {
  const { entity: performer, loading } = useEntity("performers", performerId);
  if (!performerId) return <>Неизвестно</>;
  if (loading) return <>Загрузка исполнителя...</>;
  return <>{performer?.name || performerId}</>;
}

export default function RecommendationsList({ recommendations }) {
  const { items: tracks } = useEntities("tracks");
  const { playTrack, currentTrack, isPlaying, pause, resume } = usePlayer();

  if (!recommendations?.length) {
    return <Typography color="textSecondary">Нет рекомендаций</Typography>;
  }
  
console.log('recommendations', recommendations);
  return (
    <List>
      {recommendations.map((item, idx) => {
        // item.track возможен если приходит enrichment
        const track = tracks.find(t => t.id === item.id) || item.track;
        const key = `${item.id || idx}`;
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
          >
            <ListItemText
              primary={track ? track.title : `[id: ${item.id}]`}
              secondary={
                track
                  ? <>Исполнитель: <PerformerName performerId={performerId} /></>
                  : ""
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}
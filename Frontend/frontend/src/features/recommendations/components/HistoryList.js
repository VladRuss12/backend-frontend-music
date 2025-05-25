import { useEntities } from "../../music/hooks/useEntities";
import { useEntity } from "../../music/hooks/useEntity";
import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { usePlayer } from "../../music/context/PlayerContext";

export default function HistoryList({ history, type }) {
  const { items: tracks } = useEntities("tracks");
  const { playTrack, currentTrack, isPlaying, pause, resume } = usePlayer();

  if (!history?.length) {
    return <Typography color="textSecondary">Нет данных</Typography>;
  }

  return (
    <List>
      {history.map((item, idx) => {
        const track = tracks.find(t => t.id === item.track_id || t.id === item.id) || item.track;
        const key = `${item.id}_${item.timestamp}`;
        const performerId = track?.performer_id;
        const isCurrent = currentTrack?.id === track?.id;

        // Отдельный компонент для загрузки исполнителя
        const Performer = () => {
          const { entity: performer, loading } = useEntity("performers", performerId);
          if (!performerId) return <>Неизвестно</>;
          if (loading) return <>Загрузка...</>;
          return <>{performer?.name || performerId || "Неизвестно"}</>;
        };

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
              bgcolor: isCurrent ? '#f0fff0' : undefined
            }}
          >
            <ListItemText
              primary={track ? track.title : `[id: ${item.track_id || item.id}]`}
              secondary={
                track
                  ? <>Исполнитель: <Performer /></>
                  : `Время: ${item.timestamp}`
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}
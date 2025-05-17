// TrackList.jsx
import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

export default function TrackList({ title, tracks, emptyMessage }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {tracks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <List dense>
          {tracks.map((track) => (
            <ListItem key={track.id}>
              <ListItemText
                primary={track.title}
                secondary={
                  track.listenedAt
                    ? `Исполнитель: ${track.artist} — Дата: ${new Date(
                        track.listenedAt
                      ).toLocaleDateString()}`
                    : `Исполнитель: ${track.artist}`
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}

import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import placeholder from './placeholder.svg';

export default function PlaylistCard({ playlist }) {
  console.log("PlaylistCard props:", playlist);

  if (!playlist) {
    return <div>Нет данных для плейлиста</div>;
  }

  return (
    <Card sx={{ width: 200, mx: 1, flex: "0 0 auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={placeholder}
        alt={playlist.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {playlist.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {playlist.description || "Плейлист"}
        </Typography>
      </CardContent>
    </Card>
  );
}
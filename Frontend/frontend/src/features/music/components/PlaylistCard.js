import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import placeholder from './placeholder.svg';

export default function PlaylistCard({ playlist }) {
  const navigate = useNavigate();

  if (!playlist) {
    return <div>Нет данных для плейлиста</div>;
  }

  return (
    <Card sx={{ width: 200, mx: 1, flex: "0 0 auto", cursor: 'pointer' }}>
      <CardActionArea onClick={() => navigate(`/playlist/${playlist.id}`)}>
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
      </CardActionArea>
    </Card>
  );
}
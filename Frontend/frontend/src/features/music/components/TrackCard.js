import React, { useEffect, useState } from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import axiosInstance from "../../../api/axiosInstance";
import placeholder from './placeholder.svg';

export default function TrackCard({ track }) {
  const [performer, setPerformer] = useState(null);

  useEffect(() => {
    async function fetchPerformer() {
      if (!track.performer_id) return;
      try {
        const res = await axiosInstance.get(`/music/performers/${track.performer_id}`);
        setPerformer(res.data);
      } catch (e) {
        setPerformer(null);
      }
    }
    fetchPerformer();
  }, [track.performer_id]);

  return (
    <Card sx={{ width: 200, mx: 1, flex: "0 0 auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={track.cover_url || placeholder}
        alt={track.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {track.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {performer ? performer.name : "Исполнитель"}
        </Typography>
      </CardContent>
    </Card>
  );
}
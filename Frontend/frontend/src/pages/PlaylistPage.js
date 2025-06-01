import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useEntity } from "../features/music/hooks/useEntity";
import { useDispatch, useSelector } from "react-redux";
import { getEntityById } from "../features/music/entitiesSlice";
import MusicTable from "../features/music/components/MusicTable";
import { Box, Typography, Avatar } from "@mui/material";
import placeholder from "../features/music/components/placeholder.svg";

export default function PlaylistPage() {
  const { id } = useParams();
  const { entity: playlist, loading: playlistLoading, error: playlistError } = useEntity("playlists", id);

  const tracks = useSelector(state =>
    playlist?.tracks?.map(tid =>
      typeof tid === "string"
        ? state.entities.entities.tracks?.byId?.[tid]
        : tid && tid.id
          ? state.entities.entities.tracks?.byId?.[tid.id]
          : null
    ).filter(Boolean) || []
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (playlist?.tracks) {
      for (const tid of playlist.tracks) {
        const id = typeof tid === "string" ? tid : tid && tid.id;
        if (id && !tracks.find(t => t?.id === id)) {
          dispatch(getEntityById({ entityType: "tracks", id }));
        }
      }
    }
  }, [playlist, tracks, dispatch]);

  if (playlistLoading) {
    return <Typography sx={{ mt: 2 }}>Загрузка плейлиста...</Typography>;
  }
  if (playlistError) {
    return <Typography sx={{ mt: 2, color: "error.main" }}>Ошибка: {playlistError}</Typography>;
  }
  if (!playlist) {
    return <Typography sx={{ mt: 2 }}>Плейлист не найден</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          src={playlist.cover_url || placeholder}
          variant="rounded"
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Box>
          <Typography variant="h5">{playlist.name}</Typography>
          {playlist.description && (
            <Typography variant="body1" color="text.secondary">
              {playlist.description}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Треки в плейлисте:
      </Typography>
      <MusicTable items={tracks} type="track" showIndex={true} />
    </Box>
  );
}
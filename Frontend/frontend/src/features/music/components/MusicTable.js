import React, { useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Typography, Box
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { usePlayer } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import placeholder from './placeholder.svg';
import { useSelector, useDispatch } from "react-redux";
import { getEntityById } from "../entitiesSlice"; 
import { getPerformerName } from "../misc/musicUtils";

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return "--:--";
  const min = Math.floor(seconds / 60);
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

export default function MusicTable({ items, type, showIndex = true, showAlbum = false }) {
  const { playTrack, currentTrack } = usePlayer?.() || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const performersById = useSelector(
    (state) => state.entities.entities.performers?.byId || {}
  );

  useEffect(() => {
    if (type === "track") {
      const missingIds = [];
      for (const item of items) {
        const id = item.performer_id;
        if (id && !performersById[id]) {
          missingIds.push(id);
        }
      }
      for (const id of missingIds) {
        dispatch(getEntityById({ entityType: "performers", id }));
      }
    }
  }, [items, type, performersById, dispatch]);

  if (!items?.length) {
    return <Typography sx={{ mt: 2, ml: 1 }}>Нет данных</Typography>;
  }

  let columns;
  if (type === "track") {
    columns = [
      showIndex && { key: "_idx" },
      { key: "cover" },
      { key: "title" },
      { key: "performer" },
      showAlbum && { key: "album" },
      { key: "duration", align: "right" }
    ].filter(Boolean);
  } else if (type === "playlist") {
    columns = [
      showIndex && { key: "_idx" },
      { key: "cover" },
      { key: "name" },
      { key: "tracks_count", align: "right" },
      { key: "created_at" }
    ].filter(Boolean);
  } else if (type === "performer") {
    columns = [
      showIndex && { key: "_idx" },
      { key: "avatar" },
      { key: "name" },
      { key: "genre" },
      { key: "tracks_count", align: "right" }
    ].filter(Boolean);
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, mt: 2 }}>
      <Table>
        <TableBody>
          {items.map((item, idx) => {
            const isCurrentTrack = type === "track" && currentTrack?.id === item.id;
            // Для трека отдельный обработчик
            const handleRowClick = () => {
              if (type === "track" && playTrack) playTrack(item);
              else if (type === "playlist") navigate(`/playlists/${item.id}`);
              else if (type === "performer") navigate(`/performers/${item.id}`);
            };
            return (
              <TableRow
                key={item.id}
                hover
                selected={isCurrentTrack}
                sx={{ cursor: "pointer" }}
                onClick={handleRowClick}
                onDoubleClick={handleRowClick}
              >
                {columns.map(col => {
                  if (col.key === "_idx") {
                    return (
                      <TableCell align="center" sx={{ color: "text.secondary" }} key={col.key}>
                        {isCurrentTrack ? <PlayArrowIcon color="primary" /> : idx + 1}
                      </TableCell>
                    );
                  }
                  if (col.key === "cover" || col.key === "avatar") {
                    const imgUrl =
                      type === "track"
                        ? item.cover_url || placeholder
                        : type === "playlist"
                        ? placeholder
                        : item.avatar_url || placeholder;
                    return (
                      <TableCell key={col.key}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            if (type === "track" && playTrack) playTrack(item);
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={item.title || item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </Box>
                      </TableCell>
                    );
                  }
                  if (col.key === "title") {
                    return (
                      <TableCell key={col.key}>
                        <Typography
                          variant="subtitle2"
                          sx={{ cursor: "pointer" }}
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/tracks/${item.id}`);
                          }}
                        >
                          {item.title}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "name") {
                    return (
                      <TableCell key={col.key}>
                        <Typography
                          variant="subtitle2"
                          sx={{ cursor: "pointer" }}
                          onClick={e => {
                            e.stopPropagation();
                            if (type === "performer")
                              navigate(`/performers/${item.id}`);
                            else if (type === "playlist")
                              navigate(`/playlists/${item.id}`);
                          }}
                        >
                          {item.name}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "performer") {
                    const performerName = getPerformerName(item, performersById);
                    return (
                      <TableCell key={col.key}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ cursor: item.performer_id ? "pointer" : "default" }}
                          onClick={e => {
                            e.stopPropagation();
                            if (item.performer_id)
                              navigate(`/performers/${item.performer_id}`);
                          }}
                        >
                          {performerName}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "album") {
                    return (
                      <TableCell key={col.key}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ cursor: "pointer" }}
                          onClick={e => {
                            e.stopPropagation();
                            if (item.album_id) navigate(`/albums/${item.album_id}`);
                          }}
                        >
                          {item.album || ""}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "genre") {
                    return (
                      <TableCell key={col.key}>
                        <Typography variant="body2" color="text.secondary">
                          {item.genre || ""}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "created_at") {
                    return (
                      <TableCell key={col.key}>
                        <Typography variant="body2" color="text.secondary">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "tracks_count") {
                    const count = Array.isArray(item.tracks)
                      ? item.tracks.length
                      : item.tracks_count ?? "";
                    return (
                      <TableCell key={col.key} align="right">
                        {count}
                      </TableCell>
                    );
                  }
                  if (col.key === "description") {
                    return (
                      <TableCell key={col.key}>
                        <Typography variant="body2" color="text.secondary">
                          {item.description || ""}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === "duration") {
                    return (
                      <TableCell
                        key={col.key}
                        align="right"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDuration(item.duration)}
                      </TableCell>
                    );
                  }
                  // fallback
                  return <TableCell key={col.key}>{item[col.key]}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
import React, { useEffect, useState, useCallback } from "react";
import { usePlayer } from "./PlayerContext";
import { IconButton, Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import axiosInstance from "../../api/axiosInstance";

export default function PlayerBar() {
  const { track, isPlaying, pause, resume, audioRef } = usePlayer();
  const [liked, setLiked] = useState(false);

  const checkLiked = useCallback(async () => {
    if (!track) {
      setLiked(false);
      return;
    }
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setLiked(false);
        return;
      }
      const res = await axiosInstance.get("/recommendations/listening/liked?entity_type=track", {
        headers: { "X-User-ID": userId }
      });
      const isLiked = Array.isArray(res.data) &&
        res.data.some(like =>
          like.track && like.track.id === track.id
        );
      setLiked(isLiked);
    } catch (err) {
      setLiked(false);
    }
  }, [track]);

  useEffect(() => {
    checkLiked();
  }, [track, checkLiked]);

  const handleLike = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const entity_id = track.id;
      await axiosInstance.post(
        "/recommendations/listening/like",
        { entity_id, entity_type: "track" },
        { headers: { "X-User-ID": userId } }
      );
      setTimeout(() => {
        if (track) checkLiked();
      }, 150);
    } catch (e) {
      console.error("[PlayerBar] Error in handleLike:", e);
    }
  };

  const handleUnlike = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const entity_id = track.id;
      await axiosInstance.post(
        "/recommendations/listening/unlike",
        { entity_id, entity_type: "track" },
        { headers: { "X-User-ID": userId } }
      );
      setTimeout(() => {
        if (track) checkLiked();
      }, 150);
    } catch (e) {
      console.error("[PlayerBar] Error in handleUnlike:", e);
    }
  };

  if (!track) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: "#181818",
        color: "white",
        display: "flex",
        alignItems: "center",
        px: 3,
        py: 1,
        boxShadow: "0 -2px 8px #000a"
      }}
    >
      {/* Track Info */}
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
        <img
          src={track.albumCover || "/default-cover.png"}
          alt={track.title}
          style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover", marginRight: 16 }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ color: "#fff" }}>
            {track.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#bbb" }}>
            {track.artist}
          </Typography>
        </Box>
        <IconButton
          onClick={liked ? handleUnlike : handleLike}
          sx={{ color: liked ? "#1db954" : "#bbb", ml: 2 }}
          title={liked ? "Убрать лайк" : "Поставить лайк"}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Controls */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IconButton disabled sx={{ color: "#bbb" }}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton
          onClick={isPlaying ? pause : resume}
          sx={{
            color: "#fff",
            mx: 1,
            background: "#282828",
            "&:hover": { background: "#333" }
          }}
        >
          {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>
        <IconButton disabled sx={{ color: "#bbb" }}>
          <SkipNextIcon />
        </IconButton>
      </Box>
      <audio
        ref={audioRef}
        src={track.audioUrl}
        autoPlay
        onEnded={pause}
        style={{ display: "none" }}
      />
    </Box>
  );
}
import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography, Slider, CircularProgress } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import { usePlayer } from "../context/PlayerContext";
import { useLikes } from "../../recommendations/hooks/useLikes";
import { useHistory } from "../../recommendations/hooks/useHistory";
import placeholder from './placeholder.svg';

export default function PlayerBar() {
  const { currentTrack, isPlaying, pause, resume, audioRef } = usePlayer();
  const { liked, like, unlike, loadLiked } = useLikes('track');
  const { addToHistory } = useHistory('track');
  const [duration, setDuration] = React.useState(0);
  const [position, setPosition] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);

  // Добавляем в историю при начале проигрывания нового трека
  const prevTrackId = useRef();
  useEffect(() => {
    if (currentTrack?.id && prevTrackId.current !== currentTrack.id) {
      addToHistory(currentTrack.id);
      prevTrackId.current = currentTrack.id;
    }
  }, [currentTrack, addToHistory]);

  // Подгружаем лайки при загрузке трека
  useEffect(() => {
    loadLiked();
  }, [currentTrack, loadLiked]);

  // Получаем статус лайка для текущего трека
  const isLiked = liked?.some(item => item.entity_id === currentTrack?.id);

  // Время и прогресс
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setPosition(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [audioRef, currentTrack]);

  // Перемотка
  const handleSeek = (event, value) => {
    setPosition(value);
    setSeeking(true);
  };
  const handleSeekCommitted = (event, value) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
    }
    setSeeking(false);
  };

  // Обработка лайка/дизлайка
  const handleLikeClick = () => {
    if (!currentTrack?.id) return;
    if (isLiked) unlike(currentTrack.id);
    else like(currentTrack.id);
  };

  if (!currentTrack) return null;
  console.log('liked:', liked, 'currentTrack:', currentTrack);
  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.paper",
        borderTop: "1px solid #ddd",
        zIndex: 1201,
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        boxShadow: 4,
        minHeight: 80,
      }}
    >
      {/* Обложка и информация */}
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, width: 260 }}>
        <img
          src={currentTrack.cover_url || placeholder}
          alt={currentTrack.title}
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, marginRight: 16 }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {currentTrack.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {currentTrack.performer?.name || "Исполнитель"}
          </Typography>
        </Box>
      </Box>

      {/* Лайк */}
      <IconButton onClick={handleLikeClick} sx={{ mx: 2 }}>
        {isLiked
          ? <FavoriteIcon color="primary" />  
          : <FavoriteBorderIcon />}
      </IconButton>

      {/* Управление */}
      <Box sx={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
        {/* Кнопки предыдущего/следующего трека можно реализовать позже */}
        <IconButton disabled>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton onClick={isPlaying ? pause : resume} sx={{ mx: 2 }}>
          {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>
        <IconButton disabled>
          <SkipNextIcon />
        </IconButton>
      </Box>

      {/* Прогресс-бар */}
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 220, maxWidth: 440, flex: 2 }}>
        <Typography variant="caption" sx={{ width: 40 }}>
          {formatTime(seeking ? position : position)}
        </Typography>
        <Slider
          min={0}
          max={duration || 0}
          value={seeking ? position : position}
          onChange={handleSeek}
          onChangeCommitted={handleSeekCommitted}
          sx={{ mx: 1, flex: 1 }}
        />
        <Typography variant="caption" sx={{ width: 40, textAlign: "right" }}>
          {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  );
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
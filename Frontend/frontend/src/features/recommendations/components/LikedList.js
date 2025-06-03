import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLikes } from '../hooks/useLikes';
import MusicTable from "../../music/components/MusicTable";

export default function LikedList({ entityType = 'track', maxVisible = 5 }) {
  const { liked, loading, error, loadLiked } = useLikes(entityType);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadLiked();
  }, [loadLiked]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!liked?.length) return <Typography>Пока нет лайков</Typography>;

  const likedTracks = liked.map(item => item.media).filter(Boolean);

  const visibleTracks = expanded ? likedTracks : likedTracks.slice(0, maxVisible);
  const hasMore = likedTracks.length > maxVisible;

  return (
    <>
      <MusicTable items={visibleTracks} type="track" showIndex={true} />
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <Button
            variant="text"
            color="primary"
            onClick={() => setExpanded(e => !e)}
            endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          >
            {expanded ? "Скрыть" : `Показать ещё (${likedTracks.length - maxVisible})`}
          </Button>
        </Box>
      )}
    </>
  );
}
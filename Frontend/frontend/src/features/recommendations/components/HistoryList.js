import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useEntities } from "../../music/hooks/useEntities";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MusicTable from "../../music/components/MusicTable";

export default function HistoryList({ history, maxVisible = 5 }) {
  const { items: tracks } = useEntities("tracks");
  const [expanded, setExpanded] = useState(false);

  if (!history?.length) {
    return <Typography color="textSecondary">Нет данных</Typography>;
  }

  const historyTracks = history
    .map(item => tracks.find(t => t.id === item.track_id || t.id === item.id) || item.track)
    .filter(Boolean);

  const visibleTracks = expanded ? historyTracks : historyTracks.slice(0, maxVisible);
  const hasMore = historyTracks.length > maxVisible;

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
            {expanded ? "Скрыть" : `Показать ещё (${historyTracks.length - maxVisible})`}
          </Button>
        </Box>
      )}
    </>
  );
}
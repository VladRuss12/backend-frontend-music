import React, { useState, useMemo } from "react";
import { Typography, Box, Button } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MusicTable from "../../music/components/MusicTable";


export default function HistoryList({ history, maxVisible = 5 }) {
  const [expanded, setExpanded] = useState(false);

  // Извлекаем массив треков из поля media
  const historyTracks = useMemo(
    () =>
      history
        ?.map(item => item.media)
        .filter(Boolean) ?? [],
    [history]
  );

  const visibleTracks = expanded ? historyTracks : historyTracks.slice(0, maxVisible);
  const hasMore = historyTracks.length > maxVisible;

  if (!history || history.length === 0) {
    return <Typography color="textSecondary">Нет данных</Typography>;
  }

  if (historyTracks.length === 0) {
    return <Typography color="textSecondary">Нет данных по трекам из истории</Typography>;
  }

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
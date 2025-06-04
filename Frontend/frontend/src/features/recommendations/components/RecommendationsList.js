import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MusicTable from "../../music/components/MusicTable";

export default function RecommendationsList({ recommendations, maxVisible = 5 }) {
  const [expanded, setExpanded] = useState(false);

  if (!recommendations?.length) {
    return <Typography color="textSecondary">Нет рекомендаций</Typography>;
  }

  // Берём enriched объекты из поля media
  const recommendationTracks = recommendations
    .map(item => item && item.media ? item.media : null)
    .filter(Boolean);

  const visibleTracks = expanded ? recommendationTracks : recommendationTracks.slice(0, maxVisible);
  const hasMore = recommendationTracks.length > maxVisible;

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
            {expanded ? "Скрыть" : `Показать ещё (${recommendationTracks.length - maxVisible})`}
          </Button>
        </Box>
      )}
    </>
  );
}
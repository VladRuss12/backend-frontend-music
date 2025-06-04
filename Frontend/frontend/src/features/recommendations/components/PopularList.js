import React, { useEffect, useRef } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePopularRecommendations } from "../hooks/usePopularRecommendations";
import MusicCard from "../../music/components/MusicCard"; 

const CARD_WIDTH = 200;
const CARD_MARGIN = 16;
const STEP = CARD_WIDTH + CARD_MARGIN * 2;

export default function PopularList({
  recommendationType,   // "track" | "playlist"
  title,
  emptyText = "Нет данных"
}) {
  const { recommendations = [], loading, error, loadPopular } = usePopularRecommendations(recommendationType, 15);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadPopular();
  }, [loadPopular]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!recommendations || recommendations.length === 0) return <Typography>{emptyText}</Typography>;

  const scrollBy = (offset) => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    let target = scroller.scrollLeft + offset;
    if (offset < 0 && scroller.scrollLeft <= 0) {
      target = maxScroll;
    } else if (offset > 0 && scroller.scrollLeft >= maxScroll - 1) {
      target = 0;
    }
    scroller.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => scrollBy(-STEP)}><ChevronLeftIcon /></IconButton>
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            width: "100%",
            py: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {recommendations.map((rec) => (
            rec.media &&
            <Box key={rec.media_id || rec.media.id} sx={{ mx: 2, minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH }}>
              <MusicCard item={rec.media} type={recommendationType} />
            </Box>
          ))}
        </Box>
        <IconButton onClick={() => scrollBy(STEP)}><ChevronRightIcon /></IconButton>
      </Box>
    </Box>
  );
}
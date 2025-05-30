import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "./MusicCard";

export default function CardList({ items, type, title }) {
  if (!items?.length) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1, ml: 1 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {items.map((item) => (
          <Card key={item.id} item={item} type={type} />
        ))}
      </Box>
    </Box>
  );
}
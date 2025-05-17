import React, { useState } from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 1,
        px: 1,
      }}
    >
      <InputBase
        placeholder="Поиск…"
        sx={{ color: "inherit", ml: 1 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton color="inherit" onClick={() => onSearch(value.trim())} disabled={!value.trim()}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

import React from "react";
import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function SettingsButton({ onClick }) {
  return (
    <IconButton color="inherit" onClick={onClick}>
      <SettingsIcon />
    </IconButton>
  );
}

import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ textAlign: "center", py: 2, backgroundColor: "#eee", mt: 4 }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} MyMusicApp.
      </Typography>
      <Link href="/privacy" underline="hover">Политика конфиденциальности</Link>
    </Box>
  );
}

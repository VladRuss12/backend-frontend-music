import { IconButton, useTheme } from '@mui/material';
import { useThemeMode } from '@/theme';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function ThemeToggle() {
  const theme = useTheme();
  const { toggle } = useThemeMode();
  return (
    <IconButton onClick={toggle}>
      {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

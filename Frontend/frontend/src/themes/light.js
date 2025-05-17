// theme/light.js
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f9f9f9',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
        input: {
          padding: '4px 8px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiBox: {
      defaultProps: {
        marginTop: 4,
      },
    },
  },
});

export default lightTheme;

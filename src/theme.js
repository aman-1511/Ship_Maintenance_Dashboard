import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#0099ff', // Bright blue
        contrastText: '#fff',
      },
      secondary: {
        main: '#e3f2fd', // Light blue accent
      },
      background: mode === 'dark'
        ? {
            default: '#181c20',
            paper: '#23272f',
          }
        : {
            default: '#f9f9f9',
            paper: '#fff',
          },
      text: mode === 'dark'
        ? {
            primary: '#fff',
            secondary: '#b0b8c1',
          }
        : {
            primary: '#222',
            secondary: '#666',
          },
      action: {
        selected: mode === 'dark' ? '#22334d' : '#e3f2fd', // Light blue for selected states
        hover: mode === 'dark' ? '#23272f' : '#f0f7ff',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            padding: '8px 24px',
          },
          containedPrimary: {
            backgroundColor: '#0099ff',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#007acc',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' ? '#22334d' : '#e3f2fd',
              color: '#0099ff',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

export default getTheme; 
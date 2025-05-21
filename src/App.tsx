import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import NepaliCalendar from './components/NepaliCalendar';
import './i18n';
import { useState, useMemo } from 'react';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#4CAF50' : '#2196F3',
            light: mode === 'dark' ? '#81C784' : '#64B5F6',
            dark: mode === 'dark' ? '#388E3C' : '#1976D2',
          },
          error: {
            main: '#F44336',
            light: '#FF5252',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#F5F5F5',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#212121',
            secondary:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.6)',
          },
          divider:
            mode === 'dark'
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(0, 0, 0, 0.12)',
          action: {
            hover:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            selected:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.16)'
                : 'rgba(0, 0, 0, 0.08)',
            disabled:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.26)',
            disabledBackground:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.12)',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#2A2A2A' : '#FFFFFF',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NepaliCalendar
        onThemeChange={handleThemeChange}
        isDarkMode={mode === 'dark'}
      />
    </ThemeProvider>
  );
}

export default App;

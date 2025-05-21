import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Typography,
  Toolbar,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled } from '@mui/material/styles';

interface HeaderProps {
  darkMode: boolean;
  onThemeToggle: () => void;
}

// Custom styled switch for language toggle
const LanguageSwitch = styled(Switch)(({ theme }) => ({
  'width': 62,
  'height': 34,
  'padding': 7,
  '& .MuiSwitch-switchBase': {
    'margin': 1,
    'padding': 0,
    'transform': 'translateX(6px)',
    '&.Mui-checked': {
      'color': '#fff',
      'transform': 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        content: "'🇳🇵'",
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.primary.dark
            : theme.palette.primary.main,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    'backgroundColor':
      theme.palette.mode === 'dark'
        ? theme.palette.grey[200]
        : theme.palette.grey[50],
    'width': 32,
    'height': 32,
    'boxShadow':
      theme.palette.mode === 'dark'
        ? '0 2px 4px 0 rgba(0,0,0,0.2)'
        : '0 2px 4px 0 rgba(0,0,0,0.1)',
    '&:before': {
      content: "'🇬🇧'",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
    },
  },
  '& .MuiSwitch-track': {
    'opacity': 1,
    'backgroundColor':
      theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[300],
    'borderRadius': 20 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
  },
}));

const Header: React.FC<HeaderProps> = ({ darkMode, onThemeToggle }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(event.target.checked ? 'ne' : 'en');
  };

  return (
    <AppBar
      position='fixed'
      color='default'
      elevation={1}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant='h5'
          component='h1'
          color='primary'
          sx={{
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          {t('calendar.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <LanguageSwitch
                checked={i18n.language === 'ne'}
                onChange={handleLanguageChange}
              />
            }
            label=''
          />
          <Button
            onClick={onThemeToggle}
            variant='text'
            size='small'
            sx={{
              'minWidth': 'auto',
              'p': 1,
              'borderRadius': '50%',
              'color': 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

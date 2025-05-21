import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Typography,
  Toolbar,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface HeaderProps {
  darkMode: boolean;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onThemeToggle }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
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
          <Button
            variant={i18n.language === 'en' ? 'contained' : 'outlined'}
            onClick={() => handleLanguageChange('en')}
            size='small'
          >
            English
          </Button>
          <Button
            variant={i18n.language === 'ne' ? 'contained' : 'outlined'}
            onClick={() => handleLanguageChange('ne')}
            size='small'
          >
            नेपाली
          </Button>
          <Button
            onClick={onThemeToggle}
            variant='outlined'
            size='small'
            startIcon={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          >
            {darkMode ? t('theme.light') : t('theme.dark')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

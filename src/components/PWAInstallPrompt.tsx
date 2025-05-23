import { useState, useEffect } from 'react';
import { Button, Snackbar, Box, IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import CloseIcon from '@mui/icons-material/Close';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const IOS_PROMPT_DISMISSED_KEY = 'ios_prompt_dismissed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check localStorage for iOS prompt state
    const iosPromptDismissed =
      localStorage.getItem(IOS_PROMPT_DISMISSED_KEY) === 'true';
    setShowIOSPrompt(isIOSDevice && !iosPromptDismissed);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);

      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowInstallButton(false);
        setDeferredPrompt(null);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
      setShowIOSPrompt(false);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setShowSuccessMessage(true);
        setShowInstallButton(false);
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleCloseIOSPrompt = () => {
    localStorage.setItem(IOS_PROMPT_DISMISSED_KEY, 'true');
    setShowIOSPrompt(false);
  };

  const handleClosePrompt = () => {
    setShowInstallButton(false);
    setDeferredPrompt(null);
  };

  if ((!showInstallButton && !isIOS) || (isIOS && !showIOSPrompt)) return null;

  return (
    <>
      <Box
        sx={{
          'position': 'fixed',
          'bottom': {
            xs: 'var(--bottom-navigation-height, 56px)', // Account for bottom navigation
            sm: '20px',
          },
          'left': 0,
          'right': 0,
          'padding': 2,
          'bgcolor': 'background.paper',
          'borderTop': '1px solid',
          'borderColor': 'divider',
          'zIndex': 1200, // Increased z-index to appear above bottom navigation
          'display': 'flex',
          'flexDirection': 'column',
          'gap': 1,
          '@media (min-width: 600px)': {
            bottom: '20px',
            right: '20px',
            left: 'auto',
            width: 'auto',
            maxWidth: '400px',
            borderRadius: 2,
            border: '1px solid',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          {isIOS ? (
            <>
              <Box sx={{ flex: 1, fontSize: '0.875rem', mb: 1 }}>
                To install this app on iOS:
                <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Tap the Share button</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                </ol>
              </Box>
              <IconButton
                size='small'
                onClick={handleCloseIOSPrompt}
                sx={{ ml: 1, mt: -1, mr: -1 }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                variant='contained'
                color='primary'
                onClick={handleInstallClick}
                startIcon={<GetAppIcon />}
                fullWidth
                sx={{
                  borderRadius: '8px',
                  py: 1.5,
                }}
              >
                Install App for Offline Use
              </Button>
              <IconButton
                size='small'
                onClick={handleClosePrompt}
                sx={{ ml: 1, mt: -1, mr: -1 }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message='App installed successfully!'
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
}

import { useState, useEffect } from 'react';
import { Button, Snackbar, Box } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
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

  if (!showInstallButton && !isIOS) return null;

  return (
    <>
      <Box
        sx={{
          'position': 'fixed',
          'bottom': 0,
          'left': 0,
          'right': 0,
          'padding': 2,
          'bgcolor': 'background.paper',
          'borderTop': '1px solid',
          'borderColor': 'divider',
          'zIndex': 1000,
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
        {isIOS ? (
          <>
            <Box sx={{ fontSize: '0.875rem', mb: 1 }}>
              To install this app on iOS:
              <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Tap the Share button</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
              </ol>
            </Box>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setShowInstallButton(false)}
            >
              Got it
            </Button>
          </>
        ) : (
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
        )}
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

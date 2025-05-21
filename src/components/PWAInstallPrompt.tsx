import { useState, useEffect } from 'react';
import { Button, Snackbar } from '@mui/material';
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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
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

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setShowSuccessMessage(true);
      setShowInstallButton(false);
    }

    // Clear the deferredPrompt for the next time
    setDeferredPrompt(null);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  if (!showInstallButton) return null;

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        onClick={handleInstallClick}
        startIcon={<GetAppIcon />}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '24px',
          padding: '10px 20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        Install App
      </Button>
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message='App installed successfully!'
      />
    </>
  );
}

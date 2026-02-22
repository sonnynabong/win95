import React, { useEffect } from 'react';

interface ShutdownScreenProps {
  onComplete: () => void;
  playSound: (type: 'startup' | 'shutdown' | 'error' | 'click') => void;
  soundsEnabled: boolean;
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ 
  onComplete,
  playSound,
  soundsEnabled 
}) => {
  useEffect(() => {
    if (soundsEnabled) {
      playSound('shutdown');
    }
    
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete, playSound, soundsEnabled]);

  return (
    <div className="win95-shutdown">
      <div className="text-6xl mb-4">🪟</div>
      <div>Please wait while your computer shuts down.</div>
      <div className="mt-8 text-sm">
        It is now safe to turn off your computer.
      </div>
    </div>
  );
};

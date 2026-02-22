import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
  playSound: (type: 'startup' | 'shutdown' | 'error' | 'click') => void;
  soundsEnabled: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ 
  onComplete, 
  playSound,
  soundsEnabled 
}) => {
  const [step, setStep] = useState(0);
  const bootText = [
    'Award Modular BIOS v4.51PG, An Energy Star Ally',
    'Copyright (C) 1984-95, Award Software, Inc.',
    '',
    'PENTIUM-S CPU at 133MHz',
    'Memory Test : 65536K OK',
    '',
    'Award Plug and Play BIOS Extension v1.0A',
    '',
    'Detecting HDD Primary Master ... SAMSUNG SV2044D',
    'Detecting HDD Primary Slave  ... None',
    'Detecting HDD Secondary Master ... CD-ROM CDU5211',
    'Detecting HDD Secondary Slave  ... None',
    '',
    'Starting Windows 95...',
  ];

  useEffect(() => {
    if (soundsEnabled) {
      playSound('startup');
    }
  }, []);

  useEffect(() => {
    if (step < bootText.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [step, bootText.length, onComplete]);

  return (
    <div className="win95-boot">
      <div className="win95-boot-text">
        {bootText.slice(0, step).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {step >= bootText.length && (
          <div className="mt-4">
            <div className="w-64 h-4 border-2 border-gray-500 p-0.5">
              <div 
                className="h-full bg-gray-500 animate-pulse"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

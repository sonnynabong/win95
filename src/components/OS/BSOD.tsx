import React from 'react';

interface BSODProps {
  onRestart: () => void;
}

export const BSOD: React.FC<BSODProps> = ({ onRestart }) => {
  return (
    <div className="win95-bsod" onClick={onRestart}>
      <h1>Windows</h1>
      
      <p className="mb-4">
        An error has occurred. To continue:
      </p>
      
      <p className="mb-4">
        Press Enter to return to Windows, or
      </p>
      
      <p className="mb-4">
        Press CTRL+ALT+DEL to restart your computer. If you do this,
        you will lose any unsaved information in all open applications.
      </p>
      
      <p className="mb-4">
        Error: 0E : 016F : BFF9B3D4
      </p>
      
      <p>
        Press any key to continue <span className="animate-pulse">_</span>
      </p>
    </div>
  );
};

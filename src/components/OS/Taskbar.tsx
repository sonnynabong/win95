import React, { useState, useEffect } from 'react';
import type { WindowState } from '../../types';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  minimizedWindows: Set<string>;
  onStartClick: () => void;
  onWindowClick: (id: string) => void;
  onWindowRestore: (id: string) => void;
  isStartMenuOpen: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  minimizedWindows,
  onStartClick,
  onWindowClick,
  onWindowRestore,
  isStartMenuOpen,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleWindowClick = (win: WindowState) => {
    if (minimizedWindows.has(win.id)) {
      onWindowRestore(win.id);
    } else if (activeWindowId === win.id) {
      // Minimize if already active
      // This would need minimize function passed down
    } else {
      onWindowClick(win.id);
    }
  };

  return (
    <div className="win95-taskbar">
      {/* Start Button */}
      <button
        className={`win95-button win95-start-btn ${isStartMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <span className="text-lg">🪟</span>
        <span>Start</span>
      </button>

      <div className="w-px h-5 bg-gray-500 mx-1 border-l border-white" />

      {/* Taskbar Items */}
      <div className="flex-1 flex gap-1 overflow-hidden">
        {windows.map(win => (
          <button
            key={win.id}
            className={`win95-button win95-taskbar-item ${
              activeWindowId === win.id && !minimizedWindows.has(win.id) ? 'active' : ''
            }`}
            onClick={() => handleWindowClick(win)}
            title={win.title}
          >
            <span className="text-sm">{win.icon}</span>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-gray-500 mx-1 border-l border-white" />

      {/* System Tray */}
      <div className="win95-tray">
        <span className="text-sm">🔊</span>
        <span className="win95-clock">{formatTime(time)}</span>
      </div>
    </div>
  );
};

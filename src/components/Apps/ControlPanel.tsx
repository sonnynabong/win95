import React from 'react';
import type { Settings } from '../../types';

interface ControlPanelProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  onUpdateSettings 
}) => {
  const handleToggleCRT = () => {
    onUpdateSettings({ crtEffect: !settings.crtEffect });
  };

  const handleToggleSounds = () => {
    onUpdateSettings({ sounds: !settings.sounds });
  };

  const handleToggleStartupSound = () => {
    onUpdateSettings({ startupSound: !settings.startupSound });
  };

  const handleWallpaperChange = (wallpaper: string) => {
    onUpdateSettings({ wallpaper });
  };

  const wallpapers = [
    { id: 'teal', name: 'Teal', color: '#008080' },
    { id: 'blue', name: 'Blue', color: '#000080' },
    { id: 'green', name: 'Green', color: '#008000' },
    { id: 'purple', name: 'Purple', color: '#800080' },
    { id: 'black', name: 'Black', color: '#000000' },
  ];

  const ControlItem = ({ 
    icon, 
    title, 
    description, 
    children 
  }: { 
    icon: string; 
    title: string; 
    description: string;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-start gap-4 p-4 border-b border-gray-400 hover:bg-blue-50">
      <div className="text-4xl">{icon}</div>
      <div className="flex-1">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-xs text-gray-600 mb-2">{description}</div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Title */}
      <div className="p-4 border-b border-gray-400 bg-gradient-to-r from-blue-900 to-blue-600 text-white">
        <h1 className="text-lg font-bold">Control Panel</h1>
        <p className="text-xs">Customize your Windows 95 Browser OS experience</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        {/* Display Settings */}
        <div className="p-2 bg-[#c0c0c0] border-b border-gray-500">
          <h2 className="text-sm font-bold mb-2">Display</h2>
        </div>

        <ControlItem
          icon="🖥️"
          title="Wallpaper"
          description="Change your desktop background color"
        >
          <div className="flex gap-2 mt-2">
            {wallpapers.map(wp => (
              <button
                key={wp.id}
                className={`w-8 h-8 border-2 ${settings.wallpaper === wp.id ? 'border-blue-500' : 'border-gray-400'}`}
                style={{ backgroundColor: wp.color }}
                onClick={() => handleWallpaperChange(wp.id)}
                title={wp.name}
              />
            ))}
          </div>
        </ControlItem>

        <ControlItem
          icon="📺"
          title="CRT Effect"
          description="Enable scanlines and CRT monitor effect"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.crtEffect}
              onChange={handleToggleCRT}
              className="w-4 h-4"
            />
            <span className="text-sm">Enable CRT scanline effect</span>
          </label>
        </ControlItem>

        {/* Sound Settings */}
        <div className="p-2 bg-[#c0c0c0] border-b border-gray-500 mt-2">
          <h2 className="text-sm font-bold mb-2">Sound</h2>
        </div>

        <ControlItem
          icon="🔊"
          title="System Sounds"
          description="Enable or disable system sounds"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sounds}
              onChange={handleToggleSounds}
              className="w-4 h-4"
            />
            <span className="text-sm">Enable system sounds</span>
          </label>
        </ControlItem>

        <ControlItem
          icon="🎵"
          title="Startup Sound"
          description="Play sound when Windows starts"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.startupSound}
              onChange={handleToggleStartupSound}
              disabled={!settings.sounds}
              className="w-4 h-4"
            />
            <span className="text-sm">Play startup sound</span>
          </label>
        </ControlItem>

        {/* System Info */}
        <div className="p-2 bg-[#c0c0c0] border-b border-gray-500 mt-2">
          <h2 className="text-sm font-bold mb-2">System</h2>
        </div>

        <ControlItem
          icon="⚙️"
          title="System Information"
          description="About this system"
        >
          <div className="text-xs space-y-1 mt-2">
            <div><strong>System:</strong> Windows 95 Browser OS</div>
            <div><strong>Version:</strong> 4.00.950</div>
            <div><strong>Memory:</strong> 64MB RAM</div>
            <div><strong>Processor:</strong> Pentium 133MHz</div>
            <div><strong>Storage:</strong> localStorage</div>
          </div>
        </ControlItem>
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-gray-400 bg-[#c0c0c0] flex justify-end gap-2">
        <button className="win95-button px-4 py-1" onClick={() => alert('Settings saved!')}>
          OK
        </button>
        <button className="win95-button px-4 py-1" onClick={() => window.location.reload()}>
          Cancel
        </button>
        <button className="win95-button px-4 py-1" onClick={() => alert('Settings applied!')}>
          Apply
        </button>
      </div>
    </div>
  );
};

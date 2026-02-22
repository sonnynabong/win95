import React, { useState, useEffect, useCallback } from 'react';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { Desktop } from './Desktop';
import { ContextMenu } from './ContextMenu';
import { BSOD } from './BSOD';
import { BootScreen } from './BootScreen';
import { ShutdownScreen } from './ShutdownScreen';
import { useWindowStore } from '../../stores/windowStore';
import { useFileSystemStore } from '../../stores/fileSystemStore';
import { playSound } from '../../utils/sounds';
import type { AppId, ContextMenuItem } from '../../types';

// Apps
import { Notepad } from '../Apps/Notepad';
import { Calculator } from '../Apps/Calculator';
import { Minesweeper } from '../Apps/Minesweeper';
import { Paint } from '../Apps/Paint';
import { Explorer } from '../Apps/Explorer';
import { InternetExplorer } from '../Apps/InternetExplorer';
import { ControlPanel } from '../Apps/ControlPanel';
import { MediaPlayer } from '../Apps/MediaPlayer';
import { CommandPrompt } from '../Apps/CommandPrompt';
import { Welcome } from '../Apps/Welcome';

const APP_COMPONENTS: Record<AppId, React.ComponentType<any>> = {
  'notepad': Notepad,
  'calculator': Calculator,
  'minesweeper': Minesweeper,
  'paint': Paint,
  'explorer': Explorer,
  'ie': InternetExplorer,
  'control-panel': ControlPanel,
  'media-player': MediaPlayer,
  'command': CommandPrompt,
  'welcome': Welcome,
};

export const OS: React.FC = () => {
  // State
  const [isBooting, setIsBooting] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const [bsodClicks, setBsodClicks] = useState(0);

  // Stores
  const fileSystem = useFileSystemStore();
  const windowStore = useWindowStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+Delete = BSOD easter egg
      if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        e.preventDefault();
        setShowBSOD(true);
        playSound('error', fileSystem.settings.sounds);
      }
      
      // ESC closes context menu
      if (e.key === 'Escape') {
        setContextMenu(null);
        setIsStartMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fileSystem.settings.sounds]);

  // Boot complete
  const handleBootComplete = () => {
    setIsBooting(false);
    // Open Welcome window on first boot
    if (!localStorage.getItem('win95_visited')) {
      windowStore.openWindow('welcome');
      localStorage.setItem('win95_visited', 'true');
    }
  };

  // Shutdown
  const handleShutdown = () => {
    setIsStartMenuOpen(false);
    setIsShuttingDown(true);
  };

  const handleShutdownComplete = () => {
    // Reset to boot screen
    setIsShuttingDown(false);
    setIsBooting(true);
    // Clear windows
    windowStore.windows.forEach(w => windowStore.closeWindow(w.id));
  };

  // BSOD restart
  const handleBSODRestart = () => {
    setShowBSOD(false);
    setBsodClicks(0);
  };

  // Open app
  const handleOpenApp = useCallback((appId: AppId) => {
    playSound('click', fileSystem.settings.sounds);
    windowStore.openWindow(appId);
  }, [windowStore, fileSystem.settings.sounds]);

  // Show context menu
  const handleShowContextMenu = useCallback((x: number, y: number, items: ContextMenuItem[]) => {
    setContextMenu({ x, y, items });
  }, []);

  // Secret BSOD trigger (click corner 5 times)
  const handleSecretClick = () => {
    setBsodClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowBSOD(true);
        playSound('error', fileSystem.settings.sounds);
        return 0;
      }
      return next;
    });
  };

  // Render app content
  const renderAppContent = (window: typeof windowStore.windows[0]) => {
    const AppComponent = APP_COMPONENTS[window.appId as AppId];
    if (!AppComponent) return <div>App not found</div>;

    const commonProps: any = {};

    // App-specific props
    switch (window.appId) {
      case 'notepad':
        commonProps.fileSystem = fileSystem;
        commonProps.fileId = window.content?.fileId;
        commonProps.onTitleChange = (title: string) => {
          // Could update window title here
        };
        break;
      case 'explorer':
        commonProps.fileSystem = fileSystem;
        commonProps.onOpenFile = (fileId: string) => {
          const file = fileSystem.getItem(fileId);
          if (file) {
            windowStore.openWindow('notepad', file.name, { fileId });
          }
        };
        break;
      case 'control-panel':
        commonProps.settings = fileSystem.settings;
        commonProps.onUpdateSettings = fileSystem.updateSettings;
        break;
      case 'welcome':
        commonProps.onOpenApp = handleOpenApp;
        break;
      case 'command':
        commonProps.fileSystem = fileSystem;
        break;
    }

    return <AppComponent {...commonProps} />;
  };

  // Boot screen
  if (isBooting) {
    return (
      <BootScreen 
        onComplete={handleBootComplete}
        playSound={playSound}
        soundsEnabled={fileSystem.settings.startupSound}
      />
    );
  }

  // Shutdown screen
  if (isShuttingDown) {
    return (
      <ShutdownScreen 
        onComplete={handleShutdownComplete}
        playSound={playSound}
        soundsEnabled={fileSystem.settings.sounds}
      />
    );
  }

  // BSOD
  if (showBSOD) {
    return <BSOD onRestart={handleBSODRestart} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Desktop */}
      <Desktop 
        onOpenApp={handleOpenApp}
        onShowContextMenu={handleShowContextMenu}
        settings={fileSystem.settings}
      />

      {/* Windows */}
      {windowStore.windows.map(win => (
        <Window
          key={win.id}
          window={win}
          appDefinitions={windowStore.appDefinitions}
          onActivate={() => windowStore.activateWindow(win.id)}
          onClose={() => windowStore.closeWindow(win.id)}
          onMinimize={() => windowStore.minimizeWindow(win.id)}
          onMaximize={() => windowStore.maximizeWindow(win.id)}
          onMove={(x, y) => windowStore.moveWindow(win.id, x, y)}
          onResize={(w, h) => windowStore.resizeWindow(win.id, w, h)}
        >
          {renderAppContent(win)}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar
        windows={windowStore.windows}
        activeWindowId={windowStore.activeWindowId}
        minimizedWindows={windowStore.minimizedWindows}
        onStartClick={() => {
          playSound('click', fileSystem.settings.sounds);
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
        onWindowClick={(id) => windowStore.activateWindow(id)}
        onWindowRestore={(id) => windowStore.restoreWindow(id)}
        isStartMenuOpen={isStartMenuOpen}
      />

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenApp={handleOpenApp}
        onShutDown={handleShutdown}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Secret BSOD trigger area (invisible) */}
      <div 
        className="absolute top-0 right-0 w-4 h-4 cursor-default z-[99999]"
        onClick={handleSecretClick}
        title=""
      />
    </div>
  );
};

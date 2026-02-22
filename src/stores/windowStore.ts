import { useState, useCallback } from 'react';
import type { WindowState, AppDefinition, AppId } from '../types';

const APP_DEFINITIONS: Record<AppId, AppDefinition> = {
  'notepad': {
    id: 'notepad',
    name: 'Notepad',
    icon: '📝',
    component: 'Notepad',
    defaultWidth: 500,
    defaultHeight: 400,
    canMaximize: true,
    canResize: true,
  },
  'calculator': {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    component: 'Calculator',
    defaultWidth: 260,
    defaultHeight: 320,
    canMaximize: false,
    canResize: false,
  },
  'minesweeper': {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: '💣',
    component: 'Minesweeper',
    defaultWidth: 180,
    defaultHeight: 240,
    canMaximize: false,
    canResize: false,
  },
  'paint': {
    id: 'paint',
    name: 'Paint',
    icon: '🎨',
    component: 'Paint',
    defaultWidth: 600,
    defaultHeight: 500,
    canMaximize: true,
    canResize: true,
  },
  'explorer': {
    id: 'explorer',
    name: 'My Computer',
    icon: '💻',
    component: 'Explorer',
    defaultWidth: 500,
    defaultHeight: 400,
    canMaximize: true,
    canResize: true,
  },
  'ie': {
    id: 'ie',
    name: 'Internet Explorer',
    icon: '🌐',
    component: 'InternetExplorer',
    defaultWidth: 640,
    defaultHeight: 480,
    canMaximize: true,
    canResize: true,
  },
  'control-panel': {
    id: 'control-panel',
    name: 'Control Panel',
    icon: '⚙️',
    component: 'ControlPanel',
    defaultWidth: 450,
    defaultHeight: 350,
    canMaximize: false,
    canResize: false,
  },
  'media-player': {
    id: 'media-player',
    name: 'Media Player',
    icon: '🎵',
    component: 'MediaPlayer',
    defaultWidth: 400,
    defaultHeight: 300,
    canMaximize: true,
    canResize: true,
  },
  'command': {
    id: 'command',
    name: 'MS-DOS Prompt',
    icon: '⌨️',
    component: 'CommandPrompt',
    defaultWidth: 640,
    defaultHeight: 400,
    canMaximize: true,
    canResize: true,
  },
  'welcome': {
    id: 'welcome',
    name: 'Welcome',
    icon: '👋',
    component: 'Welcome',
    defaultWidth: 400,
    defaultHeight: 300,
    canMaximize: false,
    canResize: false,
  },
};

export function useWindowStore() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<string>>(new Set());

  const openWindow = useCallback((appId: AppId, title?: string, content?: any) => {
    const app = APP_DEFINITIONS[appId];
    if (!app) return;

    // Check if window already exists and bring to front
    const existingWindow = windows.find(w => w.appId === appId && !content);
    if (existingWindow && !content) {
      activateWindow(existingWindow.id);
      if (minimizedWindows.has(existingWindow.id)) {
        restoreWindow(existingWindow.id);
      }
      return;
    }

    const id = `${appId}-${Date.now()}`;
    const centerX = typeof window !== 'undefined' ? Math.max(0, (window.innerWidth - app.defaultWidth) / 2) : 100;
    const centerY = typeof window !== 'undefined' ? Math.max(0, (window.innerHeight - app.defaultHeight) / 2 - 50) : 50;

    const newWindow: WindowState = {
      id,
      title: title || app.name,
      appId,
      icon: app.icon,
      x: centerX + windows.length * 20,
      y: centerY + windows.length * 20,
      width: app.defaultWidth,
      height: app.defaultHeight,
      isMinimized: false,
      isMaximized: false,
      isActive: true,
      zIndex: nextZIndex,
      content,
    };

    setWindows(prev => [...prev.map(w => ({ ...w, isActive: false })), newWindow]);
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  }, [windows, nextZIndex, minimizedWindows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setMinimizedWindows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id);
      if (remaining.length > 0) {
        const lastWindow = remaining[remaining.length - 1];
        setActiveWindowId(lastWindow.id);
        setWindows(prev => prev.map(w => ({
          ...w,
          isActive: w.id === lastWindow.id,
        })));
      } else {
        setActiveWindowId(null);
      }
    }
  }, [windows, activeWindowId]);

  const activateWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => ({
      ...w,
      isActive: w.id === id,
      zIndex: w.id === id ? nextZIndex : w.zIndex,
    })));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true, isActive: false } : w
    ));
    setMinimizedWindows(prev => new Set(prev).add(id));
    
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        const lastWindow = remaining[remaining.length - 1];
        activateWindow(lastWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  }, [windows, activeWindowId, activateWindow]);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: false, isActive: true, zIndex: nextZIndex } : { ...w, isActive: false }
    ));
    setMinimizedWindows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        return { 
          ...w, 
          isMaximized: false, 
          x: w.x,
          y: w.y,
          width: APP_DEFINITIONS[w.appId as AppId]?.defaultWidth || w.width,
          height: APP_DEFINITIONS[w.appId as AppId]?.defaultHeight || w.height,
        };
      }
      return { 
        ...w, 
        isMaximized: true, 
        x: 0, 
        y: 0, 
        width: typeof window !== 'undefined' ? window.innerWidth : w.width, 
        height: typeof window !== 'undefined' ? window.innerHeight - 28 : w.height,
      };
    }));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y, isMaximized: false } : w
    ));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ));
  }, []);

  return {
    windows,
    activeWindowId,
    minimizedWindows,
    openWindow,
    closeWindow,
    activateWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    appDefinitions: APP_DEFINITIONS,
  };
}

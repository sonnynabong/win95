import { useState, useEffect, useCallback } from 'react';
import type { FileSystemItem, Settings } from '../types';

const DEFAULT_FILESYSTEM: FileSystemItem[] = [
  { id: 'desktop', name: 'Desktop', type: 'folder', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'documents', name: 'My Documents', type: 'folder', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'music', name: 'My Music', type: 'folder', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'pictures', name: 'My Pictures', type: 'folder', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'readme', name: 'README.txt', type: 'file', content: 'Welcome to Windows 95 Browser OS!\n\nThis is a fully functional recreation of Windows 95 that runs in your browser.\n\nFeatures:\n- Notepad: Create and edit text files\n- Calculator: Basic calculations\n- Minesweeper: Classic game\n- Paint: Simple drawing\n- Explorer: File management\n- Internet Explorer: Browse the web\n- Control Panel: Customize settings\n- Media Player: Play audio files\n\nAll files are saved to your browser\'s localStorage.\n\nHave fun!', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
];

const DEFAULT_SETTINGS: Settings = {
  crtEffect: false,
  sounds: true,
  wallpaper: 'teal',
  startupSound: true,
};

const FS_KEY = 'win95_filesystem';
const SETTINGS_KEY = 'win95_settings';

export function useFileSystemStore() {
  const [items, setItems] = useState<FileSystemItem[]>(DEFAULT_FILESYSTEM);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedFS = localStorage.getItem(FS_KEY);
      if (savedFS) {
        setItems(JSON.parse(savedFS));
      }
      
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(FS_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save filesystem:', e);
    }
  }, [items, isLoaded]);

  // Save settings
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings, isLoaded]);

  const getChildren = useCallback((parentId: string | null) => {
    return items.filter(item => item.parentId === parentId);
  }, [items]);

  const getItem = useCallback((id: string) => {
    return items.find(item => item.id === id) || null;
  }, [items]);

  const createFolder = useCallback((name: string, parentId: string | null) => {
    const newFolder: FileSystemItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setItems(prev => [...prev, newFolder]);
    return newFolder.id;
  }, []);

  const createFile = useCallback((name: string, content: string, parentId: string | null) => {
    const newFile: FileSystemItem = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      content,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setItems(prev => [...prev, newFile]);
    return newFile.id;
  }, []);

  const updateFile = useCallback((id: string, content: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, content, updatedAt: Date.now() }
        : item
    ));
  }, []);

  const renameItem = useCallback((id: string, newName: string) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, name: newName, updatedAt: Date.now() }
        : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const toDelete = new Set<string>([id]);
      const collectChildren = (parentId: string) => {
        prev.forEach(item => {
          if (item.parentId === parentId) {
            toDelete.add(item.id);
            if (item.type === 'folder') {
              collectChildren(item.id);
            }
          }
        });
      };
      
      const item = prev.find(i => i.id === id);
      if (item?.type === 'folder') {
        collectChildren(id);
      }
      
      return prev.filter(item => !toDelete.has(item.id));
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const exportFileSystem = useCallback(() => {
    return JSON.stringify(items, null, 2);
  }, [items]);

  const importFileSystem = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        setItems(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid filesystem JSON:', e);
    }
    return false;
  }, []);

  return {
    items,
    settings,
    isLoaded,
    getChildren,
    getItem,
    createFolder,
    createFile,
    updateFile,
    renameItem,
    deleteItem,
    updateSettings,
    exportFileSystem,
    importFileSystem,
  };
}

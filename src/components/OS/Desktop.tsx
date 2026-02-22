import React, { useState, useRef, useEffect } from 'react';
import type { AppId, DesktopIcon as DesktopIconType } from '../../types';

interface DesktopProps {
  onOpenApp: (appId: AppId) => void;
  onShowContextMenu: (x: number, y: number, items: any[]) => void;
  settings: { wallpaper: string; crtEffect: boolean };
}

const DEFAULT_ICONS: DesktopIconType[] = [
  { id: 'my-computer', name: 'My Computer', icon: '💻', x: 20, y: 20, appId: 'explorer', isSelected: false },
  { id: 'network', name: 'Network Neighborhood', icon: '🌐', x: 20, y: 100, appId: 'ie', isSelected: false },
  { id: 'recycle-bin', name: 'Recycle Bin', icon: '🗑️', x: 20, y: 180, appId: 'explorer', isSelected: false },
  { id: 'notepad', name: 'Notepad', icon: '📝', x: 20, y: 260, appId: 'notepad', isSelected: false },
  { id: 'calculator', name: 'Calculator', icon: '🧮', x: 20, y: 340, appId: 'calculator', isSelected: false },
  { id: 'minesweeper', name: 'Minesweeper', icon: '💣', x: 20, y: 420, appId: 'minesweeper', isSelected: false },
  { id: 'paint', name: 'Paint', icon: '🎨', x: 100, y: 20, appId: 'paint', isSelected: false },
  { id: 'media-player', name: 'Media Player', icon: '🎵', x: 100, y: 100, appId: 'media-player', isSelected: false },
];

export const Desktop: React.FC<DesktopProps> = ({
  onOpenApp,
  onShowContextMenu,
  settings,
}) => {
  const [icons, setIcons] = useState<DesktopIconType[]>(DEFAULT_ICONS);
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragIcon, setDragIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === desktopRef.current) {
        setSelectedIcons(new Set());
        setIcons(prev => prev.map(icon => ({ ...icon, isSelected: false })));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIconClick = (e: React.MouseEvent, icon: DesktopIconType) => {
    e.stopPropagation();

    if (e.detail === 2) {
      // Double click - open app
      onOpenApp(icon.appId as AppId);
      return;
    }

    // Single click - select
    const newSelected = new Set(selectedIcons);
    if (e.ctrlKey || e.metaKey) {
      if (newSelected.has(icon.id)) {
        newSelected.delete(icon.id);
      } else {
        newSelected.add(icon.id);
      }
    } else {
      newSelected.clear();
      newSelected.add(icon.id);
    }
    setSelectedIcons(newSelected);
    setIcons(prev => prev.map(i => ({ ...i, isSelected: newSelected.has(i.id) })));
  };

  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIconType) => {
    e.stopPropagation();
    if (!selectedIcons.has(icon.id)) {
      handleIconClick(e, icon);
    }
    setIsDragging(true);
    setDragIcon(icon.id);
    setDragOffset({
      x: e.clientX - icon.x,
      y: e.clientY - icon.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragIcon) return;

    const newX = Math.max(0, e.clientX - dragOffset.x);
    const newY = Math.max(0, e.clientY - dragOffset.y);

    setIcons(prev => prev.map(icon => 
      icon.id === dragIcon 
        ? { ...icon, x: newX, y: newY }
        : icon
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIcon(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onShowContextMenu(e.clientX, e.clientY, [
      { label: 'View', shortcut: '' },
      { label: 'Arrange Icons', shortcut: '' },
      { label: 'Line up Icons', shortcut: '' },
      { type: 'separator' },
      { label: 'Paste', shortcut: '' },
      { label: 'Paste Shortcut', shortcut: '' },
      { type: 'separator' },
      { label: 'New', shortcut: '' },
      { type: 'separator' },
      { label: 'Properties', shortcut: '' },
    ]);
  };

  const getWallpaperStyle = () => {
    const wallpapers: Record<string, string> = {
      'teal': '#008080',
      'blue': '#000080',
      'green': '#008000',
      'purple': '#800080',
      'black': '#000000',
    };
    return wallpapers[settings.wallpaper] || '#008080';
  };

  return (
    <div
      ref={desktopRef}
      className={`win95-desktop ${settings.crtEffect ? 'crt-effect' : ''}`}
      style={{ backgroundColor: getWallpaperStyle() }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {icons.map(icon => (
        <div
          key={icon.id}
          className={`win95-desktop-icon ${icon.isSelected ? 'selected' : ''}`}
          style={{
            position: 'absolute',
            left: icon.x,
            top: icon.y,
            cursor: isDragging && dragIcon === icon.id ? 'grabbing' : 'pointer',
          }}
          onClick={(e) => handleIconClick(e, icon)}
          onMouseDown={(e) => handleIconMouseDown(e, icon)}
        >
          <div className="text-3xl select-none">{icon.icon}</div>
          <div className="win95-desktop-icon-label select-none">{icon.name}</div>
        </div>
      ))}
    </div>
  );
};

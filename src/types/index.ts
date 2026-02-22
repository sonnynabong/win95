export interface WindowState {
  id: string;
  title: string;
  appId: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  content?: any;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
  icon?: string;
}

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  appId: string;
  isSelected: boolean;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
  canMaximize: boolean;
  canResize: boolean;
}

export interface MinesweeperCell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export interface Settings {
  crtEffect: boolean;
  sounds: boolean;
  wallpaper: string;
  startupSound: boolean;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'audio' | 'video';
}

export type AppId = 
  | 'notepad' 
  | 'calculator' 
  | 'minesweeper' 
  | 'paint' 
  | 'explorer' 
  | 'ie' 
  | 'control-panel' 
  | 'media-player'
  | 'command'
  | 'welcome';

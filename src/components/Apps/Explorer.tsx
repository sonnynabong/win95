import React, { useState, useEffect } from 'react';
import type { FileSystemItem } from '../../types';

interface ExplorerProps {
  fileSystem: {
    items: FileSystemItem[];
    getChildren: (parentId: string | null) => FileSystemItem[];
    createFolder: (name: string, parentId: string | null) => string;
    createFile: (name: string, content: string, parentId: string | null) => string;
    deleteItem: (id: string) => void;
    renameItem: (id: string, newName: string) => void;
  };
  onOpenFile?: (fileId: string) => void;
}

const getIcon = (item: FileSystemItem) => {
  if (item.type === 'folder') return '📁';
  if (item.name.endsWith('.txt')) return '📝';
  if (item.name.endsWith('.png') || item.name.endsWith('.jpg') || item.name.endsWith('.gif')) return '🖼️';
  if (item.name.endsWith('.mp3') || item.name.endsWith('.wav')) return '🎵';
  return '📄';
};

export const Explorer: React.FC<ExplorerProps> = ({ fileSystem, onOpenFile }) => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'icons' | 'list'>('icons');
  const [breadcrumbs, setBreadcrumbs] = useState<FileSystemItem[]>([]);

  const items = fileSystem.getChildren(currentFolder);

  // Update breadcrumbs
  useEffect(() => {
    const crumbs: FileSystemItem[] = [];
    let current = currentFolder;
    while (current) {
      const item = fileSystem.items.find(i => i.id === current);
      if (item) {
        crumbs.unshift(item);
        current = item.parentId;
      } else {
        break;
      }
    }
    setBreadcrumbs(crumbs);
  }, [currentFolder, fileSystem.items]);

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentFolder(item.id);
      setSelectedItem(null);
    } else {
      onOpenFile?.(item.id);
    }
  };

  const handleItemClick = (item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item.id);
  };

  const handleBack = () => {
    if (currentFolder) {
      const current = fileSystem.items.find(i => i.id === currentFolder);
      setCurrentFolder(current?.parentId || null);
      setSelectedItem(null);
    }
  };

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:', 'New Folder');
    if (name) {
      fileSystem.createFolder(name, currentFolder);
    }
  };

  const handleNewFile = () => {
    const name = prompt('Enter file name:', 'New File.txt');
    if (name) {
      fileSystem.createFile(name, '', currentFolder);
    }
  };

  const handleDelete = () => {
    if (selectedItem && confirm('Are you sure you want to delete this item?')) {
      fileSystem.deleteItem(selectedItem);
      setSelectedItem(null);
    }
  };

  const handleRename = () => {
    if (selectedItem) {
      const item = fileSystem.items.find(i => i.id === selectedItem);
      if (item) {
        const newName = prompt('Enter new name:', item.name);
        if (newName && newName !== item.name) {
          fileSystem.renameItem(selectedItem, newName);
        }
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    setSelectedItem(item.id);
    // Context menu would be shown here
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-400 bg-[#c0c0c0]">
        <button 
          className="win95-button px-2 py-1 text-xs"
          onClick={handleBack}
          disabled={!currentFolder}
        >
          ← Back
        </button>
        
        <div className="flex-1 flex items-center gap-1 px-2 py-1 win95-border-sunken bg-white text-sm overflow-hidden">
          <span>📁</span>
          <span>My Computer</span>
          {breadcrumbs.map(crumb => (
            <span key={crumb.id} className="flex items-center gap-1">
              <span className="mx-1">{'>'}</span>
              <span>{crumb.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Menu Bar */}
      <div className="win95-menu-bar select-none">
        <span className="win95-menu-item">File</span>
        <span className="win95-menu-item">Edit</span>
        <span className="win95-menu-item">View</span>
        <span className="win95-menu-item">Go</span>
        <span className="win95-menu-item">Help</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            This folder is empty
          </div>
        ) : viewMode === 'icons' ? (
          <div className="grid grid-cols-auto-fill p-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, 80px)' }}>
            {items.map(item => (
              <div
                key={item.id}
                className={`flex flex-col items-center p-2 cursor-pointer rounded ${
                  selectedItem === item.id ? 'bg-[#000080] text-white' : 'hover:bg-blue-100'
                }`}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <span className="text-3xl mb-1">{getIcon(item)}</span>
                <span className="text-xs text-center break-words w-full leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-2 p-1 cursor-pointer ${
                  selectedItem === item.id ? 'bg-[#000080] text-white' : 'hover:bg-blue-100'
                }`}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <span className="text-lg">{getIcon(item)}</span>
                <span className="flex-1">{item.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-400 bg-[#c0c0c0] p-1 flex justify-between text-xs select-none">
        <span>{items.length} object(s)</span>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('icons')} className={viewMode === 'icons' ? 'font-bold' : ''}>Icons</button>
          <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'font-bold' : ''}>List</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-2 border-t border-gray-400 bg-[#c0c0c0]">
        <button className="win95-button px-3 py-1 text-xs" onClick={handleNewFolder}>
          New Folder
        </button>
        <button className="win95-button px-3 py-1 text-xs" onClick={handleNewFile}>
          New File
        </button>
        <button 
          className="win95-button px-3 py-1 text-xs" 
          onClick={handleDelete}
          disabled={!selectedItem}
        >
          Delete
        </button>
        <button 
          className="win95-button px-3 py-1 text-xs" 
          onClick={handleRename}
          disabled={!selectedItem}
        >
          Rename
        </button>
      </div>
    </div>
  );
};

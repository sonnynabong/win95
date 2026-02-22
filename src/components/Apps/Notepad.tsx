import React, { useState, useEffect, useRef } from 'react';
import type { FileSystemItem } from '../../types';

interface NotepadProps {
  fileId?: string;
  fileSystem: {
    items: FileSystemItem[];
    createFile: (name: string, content: string, parentId: string | null) => string;
    updateFile: (id: string, content: string) => void;
    getItem: (id: string) => FileSystemItem | null;
  };
  onTitleChange?: (title: string) => void;
}

export const Notepad: React.FC<NotepadProps> = ({ 
  fileId, 
  fileSystem, 
  onTitleChange 
}) => {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [wordWrap, setWordWrap] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load file content
  useEffect(() => {
    if (fileId) {
      const file = fileSystem.getItem(fileId);
      if (file && file.type === 'file') {
        setContent(file.content || '');
        setOriginalContent(file.content || '');
        onTitleChange?.(file.name);
      }
    } else {
      setContent('');
      setOriginalContent('');
    }
  }, [fileId, fileSystem, onTitleChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleSave = () => {
    if (fileId) {
      fileSystem.updateFile(fileId, content);
      setOriginalContent(content);
      alert('File saved successfully!');
    } else {
      // Save As dialog
      const name = prompt('Enter file name:', 'Untitled.txt');
      if (name) {
        fileSystem.createFile(name, content, null);
        alert('File saved successfully!');
        setOriginalContent(content);
      }
    }
  };

  const isModified = content !== originalContent;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Menu Bar */}
      <div className="win95-menu-bar select-none">
        <span className="win95-menu-item" onClick={handleSave}>File</span>
        <span className="win95-menu-item">Edit</span>
        <span className="win95-menu-item">Search</span>
        <span className="win95-menu-item">Help</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-1 bg-[#c0c0c0]">
        <textarea
          ref={textareaRef}
          className="win95-textarea w-full h-full resize-none"
          style={{ 
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            overflowWrap: wordWrap ? 'break-word' : 'normal',
          }}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type here..."
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-400 bg-[#c0c0c0] p-1 flex justify-between text-xs select-none">
        <span>{isModified ? 'Modified' : ''}</span>
        <span>Ln 1, Col {content.length + 1}</span>
      </div>
    </div>
  );
};

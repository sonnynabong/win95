import React, { useRef, useState, useEffect } from 'react';
import type { WindowState, AppId } from '../../types';

interface WindowProps {
  window: WindowState;
  appDefinitions: Record<AppId, any>;
  onActivate: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window: win,
  appDefinitions,
  onActivate,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  children,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const app = appDefinitions[win.appId as AppId];

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (win.isMaximized) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onMove(Math.max(0, newX), Math.max(0, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, win.isMaximized, onMove]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(200, resizeStart.width + deltaX);
      const newHeight = Math.max(150, resizeStart.height + deltaY);
      onResize(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, onResize]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.win95-window-controls')) {
      return;
    }
    onActivate();
    if (!win.isMaximized) {
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onActivate();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height,
    });
  };

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="win95-window"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={onActivate}
    >
      {/* Title Bar */}
      <div
        className={`win95-title-bar ${!win.isActive ? 'inactive' : ''}`}
        onMouseDown={handleTitleBarMouseDown}
        style={{ cursor: win.isMaximized ? 'default' : 'move' }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-sm">{win.icon}</span>
          <span className="truncate">{win.title}</span>
        </div>
        <div className="win95-window-controls">
          <button className="win95-window-btn" onClick={onMinimize} title="Minimize">
            _
          </button>
          {app?.canMaximize && (
            <button className="win95-window-btn" onClick={onMaximize} title="Maximize/Restore">
              {win.isMaximized ? '❐' : '□'}
            </button>
          )}
          <button className="win95-window-btn" onClick={onClose} title="Close">
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Resize Handle */}
      {app?.canResize && !win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #808080 50%)',
          }}
        />
      )}
    </div>
  );
};

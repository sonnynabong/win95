import React, { useEffect, useRef } from 'react';

interface ContextMenuItem {
  label?: string;
  shortcut?: string;
  type?: 'separator';
  onClick?: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      onClose();
    };

    // Adjust position if menu goes off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const adjustedX = x + rect.width > window.innerWidth ? x - rect.width : x;
      const adjustedY = y + rect.height > window.innerHeight ? y - rect.height : y;
      
      if (adjustedX !== x || adjustedY !== y) {
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [x, y, onClose]);

  return (
    <div
      ref={menuRef}
      className="win95-context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="win95-context-menu-separator" />;
        }

        return (
          <div
            key={index}
            className="win95-context-menu-item"
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="text-gray-500">{item.shortcut}</span>}
          </div>
        );
      })}
    </div>
  );
};

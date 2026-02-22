import React from 'react';
import type { AppId } from '../../types';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppId) => void;
  onShutDown: () => void;
}

interface MenuItem {
  id: AppId | 'separator' | 'shutdown';
  name: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'welcome', name: 'Welcome', icon: '👋' },
  { id: 'separator', name: '', icon: '' },
  { id: 'programs', name: 'Programs', icon: '📁' },
  { id: 'documents', name: 'Documents', icon: '📄' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
  { id: 'find', name: 'Find', icon: '🔍' },
  { id: 'help', name: 'Help', icon: '❓' },
  { id: 'run', name: 'Run...', icon: '🏃' },
  { id: 'separator', name: '', icon: '' },
  { id: 'shutdown', name: 'Shut Down...', icon: '🛑' },
];

const PROGRAMS_SUBMENU: { id: AppId; name: string; icon: string }[] = [
  { id: 'explorer', name: 'Windows Explorer', icon: '💻' },
  { id: 'notepad', name: 'Notepad', icon: '📝' },
  { id: 'calculator', name: 'Calculator', icon: '🧮' },
  { id: 'minesweeper', name: 'Minesweeper', icon: '💣' },
  { id: 'paint', name: 'Paint', icon: '🎨' },
  { id: 'ie', name: 'Internet Explorer', icon: '🌐' },
  { id: 'media-player', name: 'Media Player', icon: '🎵' },
  { id: 'command', name: 'MS-DOS Prompt', icon: '⌨️' },
  { id: 'control-panel', name: 'Control Panel', icon: '⚙️' },
];

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onShutDown,
}) => {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    if (item.id === 'shutdown') {
      onShutDown();
      onClose();
      return;
    }

    if (item.id === 'programs') {
      setExpandedItem(expandedItem === 'programs' ? null : 'programs');
      return;
    }

    if (item.id === 'settings') {
      onOpenApp('control-panel');
      onClose();
      return;
    }

    if (item.id === 'documents') {
      onOpenApp('explorer');
      onClose();
      return;
    }

    if (item.id === 'find' || item.id === 'help' || item.id === 'run') {
      // These would open dialogs in a full implementation
      onClose();
      return;
    }

    if (item.id !== 'separator') {
      onOpenApp(item.id as AppId);
      onClose();
    }
  };

  const handleProgramClick = (program: typeof PROGRAMS_SUBMENU[0]) => {
    onOpenApp(program.id);
    onClose();
    setExpandedItem(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9999]" 
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div className="win95-start-menu" onClick={(e) => e.stopPropagation()}>
        <div className="win95-start-menu-header">
          Windows 95
        </div>
        <div className="win95-start-menu-items">
          {MENU_ITEMS.map((item, index) => {
            if (item.id === 'separator') {
              return <div key={`sep-${index}`} className="win95-start-menu-separator" />;
            }

            const hasSubmenu = item.id === 'programs';

            return (
              <div key={item.id} className="relative">
                <div
                  className="win95-start-menu-item"
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => hasSubmenu && setExpandedItem(item.id)}
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {hasSubmenu && <span>▶</span>}
                </div>

                {/* Programs Submenu */}
                {hasSubmenu && expandedItem === 'programs' && (
                  <div 
                    className="absolute left-full top-0 ml-0 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-r-black border-b-black min-w-[160px] py-1 shadow-lg"
                    onMouseLeave={() => setExpandedItem(null)}
                  >
                    {PROGRAMS_SUBMENU.map(program => (
                      <div
                        key={program.id}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#000080] hover:text-white text-sm"
                        onClick={() => handleProgramClick(program)}
                      >
                        <span className="text-lg w-5 text-center">{program.icon}</span>
                        <span>{program.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

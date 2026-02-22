import React from 'react';

interface WelcomeProps {
  onOpenApp: (appId: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onOpenApp }) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      {/* Header */}
      <div className="p-6 border-b border-blue-400">
        <div className="flex items-center gap-4">
          <div className="text-6xl">🪟</div>
          <div>
            <h1 className="text-2xl font-bold">Welcome to Windows 95</h1>
            <p className="text-blue-200">Browser OS Edition</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">🎉 Congratulations!</h2>
          <p className="mb-4">
            You are now running a fully functional recreation of Windows 95 in your browser!
            This project includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-blue-100">
            <li>Multiple applications (Notepad, Calculator, Minesweeper, Paint, and more!)</li>
            <li>Working file system with localStorage persistence</li>
            <li>Window management (minimize, maximize, resize, drag)</li>
            <li>Desktop with icons and context menus</li>
            <li>CRT scanline effect and classic Windows 95 styling</li>
            <li>BSOD easter egg (try pressing Ctrl+Alt+Delete)</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => onOpenApp('notepad')}
          >
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-bold">Notepad</h3>
            <p className="text-sm text-blue-200">Create and edit text files</p>
          </div>

          <div 
            className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => onOpenApp('minesweeper')}
          >
            <div className="text-3xl mb-2">💣</div>
            <h3 className="font-bold">Minesweeper</h3>
            <p className="text-sm text-blue-200">Classic puzzle game</p>
          </div>

          <div 
            className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => onOpenApp('paint')}
          >
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold">Paint</h3>
            <p className="text-sm text-blue-200">Draw and create art</p>
          </div>

          <div 
            className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => onOpenApp('explorer')}
          >
            <div className="text-3xl mb-2">💻</div>
            <h3 className="font-bold">Explorer</h3>
            <p className="text-sm text-blue-200">Browse your files</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-blue-400 flex justify-between items-center text-sm">
        <span>Version 4.00.950</span>
        <button 
          className="bg-white text-blue-900 px-4 py-2 rounded font-bold hover:bg-blue-100"
          onClick={() => onOpenApp('notepad')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import type { FileSystemItem } from '../../types';

interface CommandPromptProps {
  fileSystem: {
    items: FileSystemItem[];
    getChildren: (parentId: string | null) => FileSystemItem[];
    getItem: (id: string) => FileSystemItem | null;
    createFolder: (name: string, parentId: string | null) => string;
    createFile: (name: string, content: string, parentId: string | null) => string;
    deleteItem: (id: string) => void;
    renameItem: (id: string, newName: string) => void;
  };
}

interface CommandHistory {
  command: string;
  output: string[];
  isError?: boolean;
}

export const CommandPrompt: React.FC<CommandPromptProps> = ({ fileSystem }) => {
  const [currentDir, setCurrentDir] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandBuffer, setCommandBuffer] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getPrompt = () => {
    const dirName = currentDir ? getDirName(currentDir) : 'C:\\WINDOWS';
    return `C:\\${dirName}>`;
  };

  const getDirName = (dirId: string) => {
    const item = fileSystem.getItem(dirId);
    if (!item) return 'WINDOWS';
    
    let path = item.name;
    let parent = item.parentId;
    while (parent) {
      const parentItem = fileSystem.getItem(parent);
      if (parentItem) {
        path = `${parentItem.name}\\${path}`;
        parent = parentItem.parentId;
      } else {
        break;
      }
    }
    return path;
  };

  const getCurrentItems = () => {
    return fileSystem.getChildren(currentDir);
  };

  const findItemByName = (name: string) => {
    const items = getCurrentItems();
    return items.find(item => item.name.toLowerCase() === name.toLowerCase());
  };

  const parsePath = (path: string): string | null => {
    if (path === '..' || path === '../') {
      if (!currentDir) return null;
      const current = fileSystem.getItem(currentDir);
      return current?.parentId || null;
    }
    if (path === '.' || path === './') return currentDir;
    if (path.startsWith('\\') || path.startsWith('/')) {
      // Absolute path - find root
      const parts = path.replace(/^\\?\//, '').split(/\\|\//);
      // For simplicity, just look in root
      const items = fileSystem.getChildren(null);
      const item = items.find(i => i.name.toLowerCase() === parts[0].toLowerCase());
      return item?.id || null;
    }
    
    // Relative path
    const item = findItemByName(path);
    return item?.type === 'folder' ? item.id : null;
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: string[] = [];
    let isError = false;

    switch (command) {
      case 'help':
      case '?':
        output = [
          'Windows 95 Command Prompt commands:',
          '',
          '  CD          Displays the name of or changes the current directory.',
          '  CLS         Clears the screen.',
          '  COPY        Copies one or more files to another location.',
          '  DATE        Displays or sets the date.',
          '  DEL         Deletes one or more files.',
          '  DIR         Displays a list of files and subdirectories in a directory.',
          '  ECHO        Displays messages, or turns command-echoing on or off.',
          '  EXIT        Quits the CMD.EXE program (command interpreter).',
          '  MD          Creates a directory.',
          '  RD          Removes a directory.',
          '  REN         Renames a file or files.',
          '  TIME        Displays or sets the system time.',
          '  TYPE        Displays the contents of a text file.',
          '  VER         Displays the Windows version.',
          '  VOL         Displays a disk volume label and serial number.',
          '',
          'Type HELP <command> for more information on a specific command.',
        ];
        break;

      case 'cd':
      case 'chdir':
        if (args.length === 0) {
          output = [getPrompt().replace('>', '')];
        } else {
          const newDir = parsePath(args[0]);
          if (newDir !== undefined) {
            setCurrentDir(newDir);
          } else {
            output = [`The system cannot find the path specified.`];
            isError = true;
          }
        }
        break;

      case 'cls':
        setHistory([]);
        return;

      case 'copy':
        if (args.length < 2) {
          output = ['The syntax of the command is incorrect.'];
          isError = true;
        } else {
          output = [`        1 file(s) copied.`];
        }
        break;

      case 'date':
        output = [`The current date is: ${new Date().toLocaleDateString('en-US')}`];
        break;

      case 'del':
      case 'delete':
      case 'erase':
        if (args.length === 0) {
          output = ['The syntax of the command is incorrect.'];
          isError = true;
        } else {
          const target = findItemByName(args[0]);
          if (target) {
            fileSystem.deleteItem(target.id);
            output = [];
          } else {
            output = [`Could not find ${args[0]}`];
            isError = true;
          }
        }
        break;

      case 'dir':
        const items = getCurrentItems();
        const dirs = items.filter(i => i.type === 'folder');
        const files = items.filter(i => i.type === 'file');
        
        output = [
          ` Volume in drive C is WINDOWS95`,
          ` Volume Serial Number is 1234-5678`,
          ` Directory of ${getPrompt().replace('>', '')}`,
          '',
          `.              <DIR>        ${new Date().toLocaleDateString('en-US')}`,
          `..             <DIR>        ${new Date().toLocaleDateString('en-US')}`,
          ...dirs.map(d => `${d.name.padEnd(14)} <DIR>        ${new Date(d.updatedAt).toLocaleDateString('en-US')}`),
          ...files.map(f => `${f.name.padEnd(14)}     ${String(f.content?.length || 0).padStart(10)} ${new Date(f.updatedAt).toLocaleDateString('en-US')}`),
          '',
          `               ${dirs.length + 2} Dir(s)               0 bytes`,
          `               ${files.length} File(s)          ${files.reduce((acc, f) => acc + (f.content?.length || 0), 0)} bytes`,
        ];
        break;

      case 'echo':
        output = [args.join(' ')];
        break;

      case 'exit':
        // This would close the window - handled by parent
        output = ['Exiting...'];
        break;

      case 'md':
      case 'mkdir':
        if (args.length === 0) {
          output = ['The syntax of the command is incorrect.'];
          isError = true;
        } else {
          fileSystem.createFolder(args[0], currentDir);
          output = [];
        }
        break;

      case 'rd':
      case 'rmdir':
        if (args.length === 0) {
          output = ['The syntax of the command is incorrect.'];
          isError = true;
        } else {
          const target = findItemByName(args[0]);
          if (target && target.type === 'folder') {
            fileSystem.deleteItem(target.id);
            output = [];
          } else {
            output = [`The directory name is invalid.`];
            isError = true;
          }
        }
        break;

      case 'ren':
      case 'rename':
        if (args.length < 2) {
          output = ['The syntax of the command is incorrect.'];
          isError = true;
        } else {
          const target = findItemByName(args[0]);
          if (target) {
            fileSystem.renameItem(target.id, args[1]);
            output = [];
          } else {
            output = [`The system cannot find the file specified.`];
            isError = true;
          }
        }
        break;

      case 'time':
        output = [`The current time is: ${new Date().toLocaleTimeString('en-US')}`];
        break;

      case 'type':
        if (args.length === 0) {
          output = ['The syntax of the command is incorrect.'];
          isError = true;
        } else {
          const target = findItemByName(args[0]);
          if (target && target.type === 'file') {
            output = target.content?.split('\n') || ['(empty file)'];
          } else {
            output = [`The system cannot find the file specified.`];
            isError = true;
          }
        }
        break;

      case 'ver':
        output = [
          '',
          'Windows 95 [Version 4.00.950]',
          '',
          'C:\\WINDOWS>',
        ];
        break;

      case 'vol':
        output = [
          ' Volume in drive C is WINDOWS95',
          ' Volume Serial Number is 1234-5678',
        ];
        break;

      default:
        output = [`'${command}' is not recognized as an internal or external command,`, `operable program or batch file.`];
        isError = true;
    }

    setHistory(prev => [...prev, { command: trimmed, output, isError }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex === -1) {
        setCommandBuffer([input]);
      }
      const newIndex = historyIndex + 1;
      if (newIndex < history.length) {
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      } else {
        setHistoryIndex(-1);
        setInput(commandBuffer[0] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const items = getCurrentItems();
      const match = items.find(i => i.name.toLowerCase().startsWith(input.toLowerCase()));
      if (match) {
        setInput(match.name);
      }
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-black font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output Area -- Window component provides the title bar */}
      <div 
        ref={outputRef}
        className="flex-1 p-2 overflow-auto text-gray-300"
        style={{ 
          fontFamily: '"Courier New", "Lucida Console", monospace',
          fontSize: '14px',
          lineHeight: '1.4',
        }}
      >
        <div className="mb-4">
          <div>Microsoft(R) Windows 95</div>
          <div>(C)Copyright Microsoft Corp 1981-1995.</div>
          <div className="mt-2">C:\\WINDOWS&gt;ver</div>
          <div></div>
          <div>Windows 95 [Version 4.00.950]</div>
          <div></div>
          <div>C:\\WINDOWS&gt;</div>
        </div>

        {history.map((entry, index) => (
          <div key={index} className="mb-1">
            <div className="text-gray-300">
              <span className="text-gray-500">{getPrompt()}</span>{entry.command}
            </div>
            {entry.output.map((line, i) => (
              <div key={i} className={entry.isError ? 'text-red-400' : 'text-gray-300'}>
                {line || ' '}
              </div>
            ))}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-gray-500 mr-1">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-300 outline-none border-none font-mono"
            style={{ 
              fontFamily: '"Courier New", "Lucida Console", monospace',
              fontSize: '14px',
            }}
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
          <span className="animate-pulse text-gray-300">_</span>
        </form>
      </div>
    </div>
  );
};

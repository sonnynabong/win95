import React, { useState } from 'react';

const HOMEPAGE = `
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Internet Explorer</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      background: linear-gradient(135deg, #001f3f, #0074d9);
      color: white;
      margin: 0;
      padding: 40px;
      min-height: 100vh;
    }
    h1 { color: #7fdbff; }
    .card {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
    }
    a { color: #7fdbff; }
    .marquee {
      background: #000080;
      color: yellow;
      padding: 10px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>🌐 Welcome to Internet Explorer 3.0</h1>
  <div class="marquee">
    <marquee>Welcome to the World Wide Web! The information superhighway awaits!</marquee>
  </div>
  <div class="card">
    <h2>Quick Links</h2>
    <ul>
      <li><a href="https://www.google.com" target="_blank">Google</a></li>
      <li><a href="https://www.wikipedia.org" target="_blank">Wikipedia</a></li>
      <li><a href="https://github.com" target="_blank">GitHub</a></li>
      <li><a href="https://archive.org" target="_blank">Internet Archive</a></li>
    </ul>
  </div>
  <div class="card">
    <h2>About This Browser</h2>
    <p>This is a simulated version of Internet Explorer running inside Windows 95 Browser OS.</p>
    <p>Connect to the internet and explore the World Wide Web!</p>
  </div>
  <div class="card">
    <h2>Fun Facts</h2>
    <ul>
      <li>The first website was created by Tim Berners-Lee in 1991</li>
      <li>The "@" symbol was chosen for email addresses in 1972</li>
      <li>The first emoticon was used in 1982 :-)</li>
      <li>Google was founded in 1998</li>
    </ul>
  </div>
</body>
</html>
`;

export const InternetExplorer: React.FC = () => {
  const [address, setAddress] = useState('http://home.microsoft.com/intl/en/');
  const [history, setHistory] = useState<string[]>([address]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(HOMEPAGE);

  const navigate = (url: string) => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      if (url.startsWith('http://home') || url === 'about:blank') {
        setContent(HOMEPAGE);
      } else {
        // For external links, show an iframe
        setContent(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { margin: 0; }
              .loading { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh;
                font-family: Arial, sans-serif;
                background: #f0f0f0;
              }
            </style>
          </head>
          <body>
            <iframe src="${url}" style="width:100%;height:100vh;border:none;" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </body>
          </html>
        `);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleGo = () => {
    let url = address;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      url = 'https://' + url;
    }
    setAddress(url);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    navigate(url);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAddress(history[newIndex]);
      navigate(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAddress(history[newIndex]);
      navigate(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    navigate(address);
  };

  const handleHome = () => {
    setAddress('http://home.microsoft.com/intl/en/');
    navigate('http://home.microsoft.com/intl/en/');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Menu Bar */}
      <div className="win95-menu-bar select-none">
        <span className="win95-menu-item">File</span>
        <span className="win95-menu-item">Edit</span>
        <span className="win95-menu-item">View</span>
        <span className="win95-menu-item">Go</span>
        <span className="win95-menu-item">Favorites</span>
        <span className="win95-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-400 bg-[#c0c0c0]">
        <div className="flex gap-1">
          <button 
            className="win95-button w-8 h-8 p-0 text-lg"
            onClick={handleBack}
            disabled={historyIndex === 0}
          >
            ←
          </button>
          <button 
            className="win95-button w-8 h-8 p-0 text-lg"
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
          >
            →
          </button>
          <button 
            className="win95-button w-8 h-8 p-0 text-lg"
            onClick={handleRefresh}
          >
            🔄
          </button>
          <button 
            className="win95-button w-8 h-8 p-0 text-lg"
            onClick={handleHome}
          >
            🏠
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-400 bg-[#c0c0c0]">
        <span className="text-sm font-bold">Address</span>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="win95-input flex-1 text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="win95-button px-4" onClick={handleGo}>
            Go
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <div className="text-lg">Loading...</div>
              <div className="w-48 h-2 bg-gray-300 mt-4">
                <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}
        <iframe
          srcDoc={content}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-popups"
          title="Internet Explorer"
        />
      </div>
    </div>
  );
};

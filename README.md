# 🖥️ Windows 95 Browser OS

A fully functional recreation of Windows 95 that runs entirely in your browser, built with [Astro](https://astro.build), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com).

![Windows 95 OS](https://img.shields.io/badge/Windows%2095-Browser%20OS-008080?style=for-the-badge)
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

## ✨ Features

### 🪟 Core OS Features
- **Window Management**: Drag, resize, minimize, maximize, and close windows
- **Taskbar**: Shows open windows with active state indication
- **Start Menu**: Full menu with programs, settings, and shutdown options
- **Desktop Icons**: Double-click to open apps, drag to rearrange
- **Context Menus**: Right-click on desktop for options
- **File System**: Persistent storage using localStorage

### 📦 Included Applications

| App | Description | Features |
|-----|-------------|----------|
| 📝 **Notepad** | Text editor | Create, edit, save text files to localStorage |
| 🧮 **Calculator** | Basic calculator | Standard arithmetic operations |
| 💣 **Minesweeper** | Classic game | 9x9 grid with 10 mines, timer, flag counter |
| 🎨 **Paint** | Drawing app | Brush, pencil, eraser, color palette, save to PNG |
| 💻 **Explorer** | File manager | Browse folders, create/delete/rename files |
| 🌐 **Internet Explorer** | Web browser | Browse the web (iframe-based) |
| ⚙️ **Control Panel** | Settings | CRT effect, sounds, wallpaper colors |
| 🎵 **Media Player** | Audio player | Playlist, volume control, file upload |

### 🎮 Easter Eggs
- **BSOD (Blue Screen of Death)**: Press `Ctrl+Alt+Delete` or click the top-right corner 5 times
- **Startup/Shutdown Sounds**: Classic Windows 95 sounds (synthesized)
- **CRT Scanline Effect**: Toggle in Control Panel for retro monitor feel

### 📱 Mobile Support
- Responsive layout for tablets and phones
- Touch-friendly interface
- Simplified mobile taskbar

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/win95-os.git
cd win95-os

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Static Hosting
The `dist` folder contains the static files ready for any hosting provider.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Apps/           # Application components
│   ├── Icons/          # Icon components
│   ├── OS/             # OS components (Desktop, Taskbar, Window, etc.)
│   └── UI/             # UI components (Button, Input)
├── layouts/
│   └── Layout.astro    # Main layout
├── pages/
│   └── index.astro     # Entry point
├── stores/
│   ├── fileSystemStore.ts  # File system state management
│   └── windowStore.ts      # Window state management
├── styles/
│   └── global.css      # Windows 95 styling
├── types/
│   └── index.ts        # TypeScript types
└── utils/
    └── sounds.ts       # Sound synthesis utilities
```

## 🎨 Windows 95 Design System

The project implements authentic Windows 95 styling:

- **Colors**: Classic teal (#008080), gray (#c0c0c0), blue (#000080)
- **Borders**: 3D raised/sunken borders using box-shadows
- **Fonts**: MS Sans Serif system font
- **Controls**: Buttons, inputs, scrollbars styled to match Windows 95

## 💾 Data Persistence

All user data is stored in the browser's localStorage:
- **Files**: Created in Notepad or Explorer
- **Settings**: Control Panel preferences
- **Desktop Layout**: Icon positions

Data survives browser restarts and is private to each user.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+Delete` | Trigger BSOD easter egg |
| `Ctrl+S` (in Notepad) | Save file |
| `Esc` | Close menus |
| `Double-click` icon | Open application |

## 🔧 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Windows 95 is a trademark of Microsoft Corporation
- This is a fan-made project for educational purposes
- Inspired by [win95.css](https://github.com/AlexBSoft/win95.css) and similar projects

---

Made with ❤️ and nostalgia for the golden age of computing.

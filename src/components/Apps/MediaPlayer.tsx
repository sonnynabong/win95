import React, { useState, useRef, useEffect } from 'react';

const SAMPLE_TRACKS = [
  { id: '1', name: 'Windows 95 Startup', url: '/sounds/startup.mp3', type: 'audio' as const },
  { id: '2', name: 'Windows 95 Shutdown', url: '/sounds/shutdown.mp3', type: 'audio' as const },
  { id: '3', name: 'The Microsoft Sound', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', type: 'audio' as const },
];

export const MediaPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<typeof SAMPLE_TRACKS[0] | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlist, setPlaylist] = useState(SAMPLE_TRACKS);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(isNaN(progress) ? 0 : progress);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playTrack = (track: typeof SAMPLE_TRACKS[0]) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newTrack = {
        id: `local-${Date.now()}`,
        name: file.name,
        url,
        type: 'audio' as const,
      };
      setPlaylist(prev => [...prev, newTrack]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Hidden Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={() => setIsPlaying(false)}
          autoPlay
        />
      )}

      {/* Visualizer Area */}
      <div className="h-32 bg-black m-2 win95-border-sunken flex items-center justify-center relative overflow-hidden">
        {isPlaying ? (
          <div className="flex items-end gap-1 h-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-3 bg-green-500 transition-all duration-100"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  animation: `pulse 0.2s ease-in-out ${i * 0.05}s infinite alternate`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-green-500 font-mono text-sm">
            {currentTrack ? 'Paused' : 'No file loaded'}
          </div>
        )}
        
        {/* Track Info */}
        <div className="absolute bottom-1 left-2 text-green-500 font-mono text-xs">
          {currentTrack?.name || 'Ready'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full"
          disabled={!currentTrack}
        />
        <div className="flex justify-between text-xs mt-1">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 p-2 border-t border-b border-gray-400">
        <button 
          className="win95-button w-10 h-8 p-0 text-lg"
          onClick={() => {
            const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
            const prevTrack = playlist[currentIndex - 1] || playlist[playlist.length - 1];
            if (prevTrack) playTrack(prevTrack);
          }}
          disabled={playlist.length === 0}
        >
          ⏮
        </button>
        <button 
          className="win95-button w-10 h-8 p-0 text-lg"
          onClick={stop}
          disabled={!currentTrack}
        >
          ⏹
        </button>
        <button 
          className={`win95-button w-10 h-8 p-0 text-lg ${isPlaying ? 'active' : ''}`}
          onClick={togglePlay}
          disabled={!currentTrack}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button 
          className="win95-button w-10 h-8 p-0 text-lg"
          onClick={() => {
            const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
            const nextTrack = playlist[currentIndex + 1] || playlist[0];
            if (nextTrack) playTrack(nextTrack);
          }}
          disabled={playlist.length === 0}
        >
          ⏭
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="text-xs">Volume:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs w-8">{Math.round(volume * 100)}%</span>
      </div>

      {/* Playlist */}
      <div className="flex-1 overflow-auto m-2 win95-border-sunken bg-white">
        <div className="p-2 text-xs font-bold bg-[#c0c0c0] border-b border-gray-400">
          Playlist
        </div>
        {playlist.map(track => (
          <div
            key={track.id}
            className={`flex items-center gap-2 p-2 cursor-pointer text-sm ${
              currentTrack?.id === track.id ? 'bg-[#000080] text-white' : 'hover:bg-blue-100'
            }`}
            onClick={() => playTrack(track)}
          >
            <span>{currentTrack?.id === track.id && isPlaying ? '▶️' : '🎵'}</span>
            <span className="flex-1 truncate">{track.name}</span>
          </div>
        ))}
      </div>

      {/* File Upload */}
      <div className="p-2 border-t border-gray-400">
        <label className="win95-button w-full flex items-center justify-center gap-2 cursor-pointer">
          <span>📁</span>
          <span>Open File...</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

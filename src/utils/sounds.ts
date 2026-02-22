// Simple sound synthesis for Windows 95 sounds
// In a real implementation, you'd use actual audio files

export const playSound = (type: 'startup' | 'shutdown' | 'error' | 'click' | 'ding', enabled: boolean = true) => {
  // Check if sounds are enabled
  if (!enabled) return;
  
  const settings = localStorage.getItem('win95_settings');
  if (settings) {
    const parsed = JSON.parse(settings);
    if (!parsed.sounds) return;
  }

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playChord = (frequencies: number[], duration: number) => {
    frequencies.forEach((freq, i) => {
      setTimeout(() => playTone(freq, duration), i * 50);
    });
  };

  switch (type) {
    case 'startup':
      // Windows 95 startup sound (simplified)
      playChord([523.25, 659.25, 783.99, 1046.50], 1.5);
      break;
    case 'shutdown':
      // Windows 95 shutdown sound (simplified)
      playChord([1046.50, 783.99, 659.25, 523.25], 1);
      break;
    case 'error':
      // Error beep
      playTone(200, 0.3, 'sawtooth');
      setTimeout(() => playTone(150, 0.3, 'sawtooth'), 150);
      break;
    case 'click':
      // Subtle click
      playTone(800, 0.05, 'sine');
      break;
    case 'ding':
      // Ding notification
      playTone(880, 0.2, 'sine');
      break;
  }
};

// Preload sounds (for actual audio files)
export const preloadSounds = () => {
  const sounds = ['startup', 'shutdown', 'error', 'click', 'ding'];
  sounds.forEach(sound => {
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.load();
  });
};

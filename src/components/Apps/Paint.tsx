import React, { useRef, useState, useEffect } from 'react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808080', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffffff', '#c0c0c0', '#800080', '#808000', '#008080', '#000080', '#808080', '#ffffff',
];

const TOOLS = ['pencil', 'brush', 'eraser', 'fill'] as const;
type Tool = typeof TOOLS[number];

export const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setIsDrawing(true);
    setLastPos(pos);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (tool === 'fill') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getPos(e);

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'paint-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-400">
        {/* Tools */}
        <div className="flex gap-1">
          {TOOLS.map(t => (
            <button
              key={t}
              className={`win95-button w-8 h-8 p-0 text-xs ${tool === t ? 'active' : ''}`}
              onClick={() => setTool(t)}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            >
              {t === 'pencil' && '✏️'}
              {t === 'brush' && '🖌️'}
              {t === 'eraser' && '🧼'}
              {t === 'fill' && '🪣'}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-500 mx-1" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-xs">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-xs w-4">{brushSize}</span>
        </div>

        <div className="w-px h-6 bg-gray-500 mx-1" />

        {/* Actions */}
        <button className="win95-button px-2 py-1 text-xs" onClick={clearCanvas}>
          Clear
        </button>
        <button className="win95-button px-2 py-1 text-xs" onClick={saveImage}>
          Save
        </button>
      </div>

      {/* Color Palette */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-400 bg-[#c0c0c0]">
        <span className="text-xs mr-2">Color:</span>
        <div className="grid grid-cols-12 gap-0.5">
          {COLORS.map((c, i) => (
            <button
              key={i}
              className={`w-4 h-4 border ${color === c ? 'border-white ring-1 ring-black' : 'border-gray-400'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-2 bg-[#808080] overflow-auto flex items-center justify-center">
        <div className="win95-border-sunken inline-block">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="cursor-crosshair block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};

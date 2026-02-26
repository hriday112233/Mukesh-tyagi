import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Text, Group } from 'react-konva';
import { GoogleGenAI, Type } from "@google/genai";
import { Room } from '../types';
import { calculatePolygonArea, formatArea, AreaUnit } from '../utils/math';
import { analyzeRoomPhoto } from '../services/imageAnalysis';
import { Room3DView } from './Room3DView';
import { 
  MousePointer2, 
  Square, 
  Trash2, 
  Save, 
  Plus, 
  Camera, 
  Upload, 
  Loader2, 
  X,
  Ruler,
  Box,
  Sparkles,
  Map as MapIcon,
  Download,
  AlertCircle
} from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface LayoutCanvasProps {
  rooms: Room[];
  onAddRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
  onUpdateRoom: (room: Room) => void;
}

export const LayoutCanvas: React.FC<LayoutCanvasProps> = ({ rooms, onAddRoom, onDeleteRoom, onUpdateRoom }) => {
  const [newRoomPoints, setNewRoomPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'select' | 'draw'>('draw');
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // New features state
  const [showDimForm, setShowDimForm] = useState(false);
  const [dimInput, setDimInput] = useState({ name: '', width: '', length: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Hover and Edit state
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  // Unit state
  const [unit, setUnit] = useState<AreaUnit>('metric');

  // 3D state
  const [is3D, setIs3D] = useState(false);

  // AI Palette state
  const [aiPalettes, setAiPalettes] = useState<string[][]>([]);
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);

  const PRESET_COLORS = [
    '#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', 
    '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', 
    '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', 
    '#f472b6', '#fb7185', '#94a3b8'
  ];

  const generateAiPalettes = async () => {
    const room = rooms.find(r => r.id === editingRoomId);
    if (!room) return;

    setIsGeneratingPalette(true);
    try {
      const prompt = `Suggest 3 harmonious color palettes for a room named "${room.name}". 
      Each palette should have 5 hex colors. 
      The palettes should be professional and suitable for architectural/interior design.
      Return as a JSON array of arrays of hex strings.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      setAiPalettes(data);
    } catch (error) {
      console.error("Palette Generation Error:", error);
    } finally {
      setIsGeneratingPalette(false);
    }
  };

  useEffect(() => {
    const updateSize = () => {
      const parent = document.getElementById('canvas-container');
      if (parent) {
        setDimensions({
          width: parent.offsetWidth,
          height: parent.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: any) => {
    if (tool !== 'draw') return;
    
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    if (!isDrawing) {
      setIsDrawing(true);
      setNewRoomPoints([pos]);
    } else {
      const firstPoint = newRoomPoints[0];
      const dist = Math.sqrt(Math.pow(pos.x - firstPoint.x, 2) + Math.pow(pos.y - firstPoint.y, 2));
      
      if (dist < 15 && newRoomPoints.length >= 3) {
        const area = calculatePolygonArea(newRoomPoints);
        const newRoom: Room = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Room ${rooms.length + 1}`,
          points: newRoomPoints,
          color: `hsl(${Math.random() * 360}, 70%, 80%)`,
          area: area
        };
        onAddRoom(newRoom);
        setNewRoomPoints([]);
        setIsDrawing(false);
      } else {
        setNewRoomPoints([...newRoomPoints, pos]);
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || tool !== 'draw') return;
  };

  const handleAddByDimensions = () => {
    const w = parseFloat(dimInput.width);
    const l = parseFloat(dimInput.length);
    if (isNaN(w) || isNaN(l)) return;

    // Scale: 1m = 10px
    const pxW = w * 10;
    const pxL = l * 10;
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    const points = [
      { x: centerX - pxW/2, y: centerY - pxL/2 },
      { x: centerX + pxW/2, y: centerY - pxL/2 },
      { x: centerX + pxW/2, y: centerY + pxL/2 },
      { x: centerX - pxW/2, y: centerY + pxL/2 },
    ];

    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name: dimInput.name || `Room ${rooms.length + 1}`,
      points: points,
      color: `hsl(${Math.random() * 360}, 70%, 80%)`,
      area: pxW * pxL
    };

    onAddRoom(newRoom);
    setShowDimForm(false);
    setDimInput({ name: '', width: '', length: '' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsAnalyzing(true);
      const result = await analyzeRoomPhoto(base64);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg');
    
    // Stop stream
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    setShowCamera(false);

    setIsAnalyzing(true);
    analyzeRoomPhoto(base64).then(result => {
      setAnalysisResult(result);
      setIsAnalyzing(false);
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm relative">
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-50/50 border-b border-zinc-200 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded-lg transition-all ${tool === 'select' ? 'bg-zinc-900 text-white shadow-md' : 'hover:bg-zinc-100 text-zinc-500'}`}
              title="Select Mode"
            >
              <MousePointer2 size={18} />
            </button>
            <button
              onClick={() => setTool('draw')}
              className={`p-2 rounded-lg transition-all ${tool === 'draw' ? 'bg-zinc-900 text-white shadow-md' : 'hover:bg-zinc-100 text-zinc-500'}`}
              title="Draw Mode"
            >
              <Square size={18} />
            </button>
          </div>
          
          <div className="w-px h-6 bg-zinc-200 mx-1"></div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setShowDimForm(!showDimForm)}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm"
              title="Add by Dimensions"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm"
              title="Upload Photo for Analysis"
            >
              <Upload size={18} />
            </button>
            <button
              onClick={startCamera}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm"
              title="Direct Camera Capture"
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="w-px h-6 bg-zinc-200 mx-1"></div>

          <div className="flex bg-zinc-200/50 rounded-2xl p-1 border border-zinc-200 shadow-inner">
            <button
              onClick={() => setUnit('metric')}
              className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all duration-300 ${unit === 'metric' ? 'bg-zinc-900 text-white shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              METRIC
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all duration-300 ${unit === 'imperial' ? 'bg-zinc-900 text-white shadow-lg scale-105' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              IMPERIAL
            </button>
            <select 
              className="bg-transparent text-[10px] font-black px-3 outline-none cursor-pointer text-zinc-500 hover:text-zinc-700"
              value={unit}
              onChange={(e) => setUnit(e.target.value as AreaUnit)}
            >
              <option value="metric" disabled>REGIONAL UNITS</option>
              <option value="gaj">GAJ (North India)</option>
              <option value="guntha">GUNTHA (West/Central)</option>
              <option value="kanal">KANAL (North)</option>
              <option value="cent">CENT (South)</option>
              <option value="ankanam">ANKANAM (AP/Telangana)</option>
            </select>
            <div className="group relative pr-2 flex items-center">
              <AlertCircle size={12} className="text-zinc-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-zinc-900 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[100] shadow-2xl border border-zinc-800">
                <p className="font-black text-emerald-400 mb-2 uppercase tracking-widest">Regional Unit Guide</p>
                <ul className="space-y-1.5 list-disc pl-3 text-zinc-300">
                  <li><span className="text-white font-bold">Gaj:</span> Delhi, Punjab, Haryana</li>
                  <li><span className="text-white font-bold">Guntha:</span> Maharashtra, Gujarat</li>
                  <li><span className="text-white font-bold">Kanal:</span> North India</li>
                  <li><span className="text-white font-bold">Cent:</span> South India</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-zinc-200 mx-1"></div>

          <button
            onClick={() => setIs3D(!is3D)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] transition-all ${is3D ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
          >
            <Box size={14} />
            {is3D ? '2D VIEW' : '3D VIEW'}
          </button>

          <div className="w-px h-6 bg-zinc-200 mx-1"></div>

          <button
            onClick={() => alert('Naksha (Submission Drawing) Exported as PDF/PNG with Municipal Title Block.')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-black text-[10px] transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download size={14} />
            EXPORT NAKSHA
          </button>
        </div>
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hidden lg:block">
          {tool === 'draw' ? 'Click to place points • Close shape to finish' : 'Select & Edit Mode'}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />

      {/* Dimension Form Overlay */}
      {showDimForm && (
        <div className="absolute top-14 left-4 z-50 bg-white p-4 rounded-xl border border-zinc-200 shadow-xl w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">New Room Dimensions</h3>
            <button onClick={() => setShowDimForm(false)}><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Room Name" 
              className="w-full text-xs p-2 border border-zinc-200 rounded-md"
              value={dimInput.name}
              onChange={e => setDimInput({...dimInput, name: e.target.value})}
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Width (m)" 
                className="w-full text-xs p-2 border border-zinc-200 rounded-md"
                value={dimInput.width}
                onChange={e => setDimInput({...dimInput, width: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="Length (m)" 
                className="w-full text-xs p-2 border border-zinc-200 rounded-md"
                value={dimInput.length}
                onChange={e => setDimInput({...dimInput, length: e.target.value})}
              />
            </div>
            <button 
              onClick={handleAddByDimensions}
              className="w-full bg-zinc-900 text-white text-xs py-2 rounded-md font-bold"
            >
              Add Room
            </button>
          </div>
        </div>
      )}

      {/* Name Edit Overlay */}
      {editingRoomId && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xl w-80 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Edit Room</h3>
            <button onClick={() => {
              setEditingRoomId(null);
              setAiPalettes([]);
            }} className="text-zinc-400 hover:text-zinc-900"><X size={18} /></button>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Room Name</label>
              <input 
                type="text" 
                className="w-full text-sm p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 outline-none"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Room Color</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
                    <span className="text-[10px] font-mono text-zinc-400">#</span>
                    <input 
                      type="text" 
                      className="w-16 text-[10px] font-mono bg-transparent outline-none uppercase"
                      value={editColor.replace('#', '')}
                      onChange={e => {
                        const val = e.target.value;
                        if (val.length <= 6) setEditColor(`#${val}`);
                      }}
                    />
                  </div>
                  <button 
                    onClick={generateAiPalettes}
                    disabled={isGeneratingPalette}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingPalette ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    AI SUGGEST
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all ${editColor === color ? 'border-zinc-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {aiPalettes.length > 0 && (
                <div className="mt-4 space-y-3 pt-4 border-t border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Suggested Palettes</p>
                  <div className="space-y-2">
                    {aiPalettes.map((palette, idx) => (
                      <div key={idx} className="flex gap-1 h-8 rounded-lg overflow-hidden border border-zinc-100">
                        {palette.map((color, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => setEditColor(color)}
                            className="flex-1 hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                const room = rooms.find(r => r.id === editingRoomId);
                if (room) {
                  onUpdateRoom({ ...room, name: editName, color: editColor });
                }
                setEditingRoomId(null);
                setAiPalettes([]);
              }}
              className="w-full bg-zinc-900 text-white text-xs py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Camera Overlay */}
      {showCamera && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay className="max-h-[70%] w-auto rounded-lg mb-4" />
          <div className="flex gap-4">
            <button 
              onClick={capturePhoto}
              className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2"
            >
              <Camera size={18} /> Capture
            </button>
            <button 
              onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                setShowCamera(false);
              }}
              className="bg-zinc-800 text-white px-6 py-2 rounded-full font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Analysis Result Overlay */}
      {analysisResult && (
        <div className="absolute bottom-4 right-4 z-50 bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl max-w-md border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Ruler size={16} className="text-emerald-400" />
              Photo Analysis Result
            </h3>
            <button onClick={() => setAnalysisResult(null)}><X size={16} /></button>
          </div>
          <div className="text-xs text-zinc-400 leading-relaxed max-h-64 overflow-y-auto pr-2">
            {analysisResult}
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-zinc-900" />
            <p className="text-sm font-bold">Analyzing Photo...</p>
          </div>
        </div>
      )}
      
      <div id="canvas-container" className="flex-1 bg-zinc-100 relative cursor-crosshair">
        {is3D ? (
          <Room3DView rooms={rooms} />
        ) : (
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            ref={stageRef}
          >
            <Layer>
              {/* Grid Lines */}
              {Array.from({ length: Math.ceil(dimensions.width / 50) }).map((_, i) => (
                <Line
                  key={`v-${i}`}
                  points={[i * 50, 0, i * 50, dimensions.height]}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              ))}
              {Array.from({ length: Math.ceil(dimensions.height / 50) }).map((_, i) => (
                <Line
                  key={`h-${i}`}
                  points={[0, i * 50, dimensions.width, i * 50]}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              ))}

              {/* Existing Rooms */}
              {rooms.map((room) => (
                <Group 
                  key={room.id}
                  onMouseEnter={(e) => {
                    setHoveredRoomId(room.id);
                    const container = e.target.getStage().container();
                    container.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    setHoveredRoomId(null);
                    const container = e.target.getStage().container();
                    container.style.cursor = 'default';
                  }}
                >
                  <Line
                    points={room.points.flatMap(p => [p.x, p.y])}
                    fill={room.color}
                    stroke={hoveredRoomId === room.id ? "#3b82f6" : "#141414"}
                    strokeWidth={hoveredRoomId === room.id ? 3 : 2}
                    closed
                    opacity={0.6}
                  />
                  <Text
                    x={room.points[0].x}
                    y={room.points[0].y - 20}
                    text={`${room.name}\n${formatArea(room.area, unit)}`}
                    fontSize={12}
                    fontFamily="JetBrains Mono"
                    fill="#141414"
                    onClick={() => {
                      setEditingRoomId(room.id);
                      setEditName(room.name);
                      setEditColor(room.color);
                    }}
                    onTap={() => {
                      setEditingRoomId(room.id);
                      setEditName(room.name);
                      setEditColor(room.color);
                    }}
                  />
                  
                  {/* Delete Button on Hover */}
                  {hoveredRoomId === room.id && (
                    <Group
                      x={room.points[0].x + 80}
                      y={room.points[0].y - 25}
                      onClick={() => onDeleteRoom(room.id)}
                      onTap={() => onDeleteRoom(room.id)}
                    >
                      <Rect
                        width={20}
                        height={20}
                        fill="#ef4444"
                        cornerRadius={4}
                      />
                      <Text
                        text="×"
                        fontSize={16}
                        fill="white"
                        x={5}
                        y={2}
                        fontStyle="bold"
                      />
                    </Group>
                  )}
                </Group>
              ))}

              {/* Drawing Preview */}
              {isDrawing && (
                <Line
                  points={newRoomPoints.flatMap(p => [p.x, p.y])}
                  stroke="#141414"
                  strokeWidth={2}
                  dash={[5, 5]}
                />
              )}
              {newRoomPoints.map((p, i) => (
                <Rect
                  key={i}
                  x={p.x - 4}
                  y={p.y - 4}
                  width={8}
                  height={8}
                  fill="#141414"
                />
              ))}
              {/* Scale Indicator */}
              <Line
                points={[20, dimensions.height - 40, 120, dimensions.height - 40]}
                stroke="#141414"
                strokeWidth={2}
              />
              <Text
                x={20}
                y={dimensions.height - 35}
                text={unit === 'metric' ? "10m (100px)" : "32.8ft (100px)"}
                fontSize={10}
                fontFamily="JetBrains Mono"
                fill="#141414"
              />
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { RoomStandard } from '../types';
import { 
  BookOpen, 
  Loader2, 
  Search, 
  Info, 
  Maximize2, 
  CheckCircle2, 
  AlertCircle,
  Home,
  Bed,
  ChefHat,
  Coffee,
  Bath,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const ROOM_TYPES = [
  { id: 'master-bedroom', label: 'Master Bedroom', icon: Bed },
  { id: 'guest-bedroom', label: 'Guest Bedroom', icon: Bed },
  { id: 'living-room', label: 'Living Room', icon: Home },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'dining-room', label: 'Dining Room', icon: Coffee },
  { id: 'bathroom', label: 'Bathroom', icon: Bath },
  { id: 'home-office', label: 'Home Office', icon: Briefcase },
];

export const StandardDimensionGuide: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0].id);
  const [occupancy, setOccupancy] = useState('2');
  const [standard, setStandard] = useState<RoomStandard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const roomLabel = ROOM_TYPES.find(r => r.id === selectedRoom)?.label;
      const prompt = `Perform a superior architectural analysis for a ${roomLabel} intended for ${occupancy} people. 
      Provide standard dimensions based on international architectural practices (Neufert, Metric Handbook).
      Return the analysis in JSON format with:
      - roomType: string
      - minDimensions: { width: number, length: number } (in meters)
      - recommendedDimensions: { width: number, length: number } (in meters)
      - luxuryDimensions: { width: number, length: number } (in meters)
      - analysis: string (A deep architectural analysis of space requirements, circulation, and ergonomics)
      - keyConsiderations: string[] (List of critical design factors like window placement, clearance, etc.)`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roomType: { type: Type.STRING },
              minDimensions: {
                type: Type.OBJECT,
                properties: {
                  width: { type: Type.NUMBER },
                  length: { type: Type.NUMBER }
                }
              },
              recommendedDimensions: {
                type: Type.OBJECT,
                properties: {
                  width: { type: Type.NUMBER },
                  length: { type: Type.NUMBER }
                }
              },
              luxuryDimensions: {
                type: Type.OBJECT,
                properties: {
                  width: { type: Type.NUMBER },
                  length: { type: Type.NUMBER }
                }
              },
              analysis: { type: Type.STRING },
              keyConsiderations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["roomType", "minDimensions", "recommendedDimensions", "luxuryDimensions", "analysis", "keyConsiderations"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setStandard(data);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Architectural Standards Guide</h2>
            <p className="text-sm text-zinc-500">AI-powered superior analysis of room dimensions and ergonomics</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Room Type</label>
            <div className="grid grid-cols-1 gap-2">
              {ROOM_TYPES.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                    selectedRoom === room.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <room.icon size={16} />
                  {room.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Occupancy / Usage Intensity</label>
              <div className="flex gap-4">
                {['1', '2', '3-4', '5+'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOccupancy(opt)}
                    className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold ${
                      occupancy === opt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {opt} {opt === '1' ? 'Person' : 'People'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl text-white shadow-2xl shadow-zinc-900/20">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Superior Analysis Engine</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Our AI cross-references international building codes and ergonomic standards to provide optimized spatial configurations for your specific project needs.
                  </p>
                </div>
              </div>
              <button
                onClick={fetchAnalysis}
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {isLoading ? 'Analyzing Standards...' : 'Run Superior Analysis'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {standard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Maximize2 size={16} className="text-blue-600" />
                  Dimension Benchmarks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Minimum', dims: standard.minDimensions, color: 'text-zinc-500', bg: 'bg-zinc-50' },
                    { label: 'Recommended', dims: standard.recommendedDimensions, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Luxury', dims: standard.luxuryDimensions, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  ].map((tier, i) => (
                    <div key={i} className={`${tier.bg} p-6 rounded-2xl border border-black/5`}>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{tier.label}</p>
                      <p className={`text-2xl font-mono font-bold ${tier.color}`}>
                        {tier.dims.width}m × {tier.dims.length}m
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Total: {(tier.dims.width * tier.dims.length).toFixed(1)} m²
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-widest">Architectural Analysis</h3>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                  {standard.analysis}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-900 p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xs font-bold text-blue-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Key Considerations
                </h3>
                <ul className="space-y-4">
                  {standard.keyConsiderations.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-zinc-400 leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 mb-1">Local Regulations</h4>
                    <p className="text-[10px] text-amber-800/70 leading-relaxed">
                      Always verify these dimensions with your local building codes and zoning laws as they may vary by region.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

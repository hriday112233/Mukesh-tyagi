import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { LayoutSuggestion } from '../types';
import { Sparkles, Loader2, Wand2, Ruler, Palette, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const LayoutSuggester: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: '', length: '' });
  const [style, setStyle] = useState('Modern');
  const [requirements, setRequirements] = useState('');
  const [suggestions, setSuggestions] = useState<LayoutSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!dimensions.width || !dimensions.length || isLoading) return;

    setIsLoading(true);
    try {
      const prompt = `Generate 3-5 distinct, optimized room layout configurations for a room with dimensions ${dimensions.width}m x ${dimensions.length}m. 
      Style: ${style}. 
      Functional Requirements: ${requirements}.
      For each layout, provide:
      1. A title.
      2. A brief description.
      3. A list of furniture items and their suggested placement.
      4. An explanation of the design choices.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                furniture: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                explanation: { type: Type.STRING }
              },
              required: ["title", "description", "furniture", "explanation"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      setSuggestions(data);
    } catch (error) {
      console.error("Layout Generation Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">AI Layout Optimizer</h2>
            <p className="text-sm text-zinc-500">Intelligent furniture placement and space configuration</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Wand2 size={24} />
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Room Dimensions (m)</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="number"
                  placeholder="Width"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="number"
                  placeholder="Length"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Design Style</label>
            <div className="relative">
              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900/10 outline-none appearance-none transition-all"
              >
                <option>Modern</option>
                <option>Minimalist</option>
                <option>Bohemian</option>
                <option>Industrial</option>
                <option>Scandinavian</option>
                <option>Mid-Century Modern</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Functional Requirements</label>
            <input
              type="text"
              placeholder="e.g., Home office, entertainment area..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={generateSuggestions}
            disabled={isLoading || !dimensions.width || !dimensions.length}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-zinc-900/20"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing Space...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Layout Suggestions
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0{index + 1}
                  </span>
                  <h3 className="font-bold text-zinc-900">{suggestion.title}</h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{suggestion.description}</p>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Furniture Placement
                  </h4>
                  <ul className="space-y-2">
                    {suggestion.furniture.map((item, i) => (
                      <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-zinc-300 rounded-full mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Lightbulb size={12} />
                    Design Logic
                  </h4>
                  <p className="text-xs text-emerald-800/80 leading-relaxed italic">
                    {suggestion.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {suggestions.length === 0 && !isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-4 opacity-50">
          <Wand2 size={48} />
          <p className="text-sm font-medium">Enter dimensions and requirements to see AI suggestions</p>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Room, ProjectRequirement } from '../types';
import { Sparkles, Loader2, TrendingUp, Lightbulb, Target, Compass } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface TrendAnalysisProps {
  rooms: Room[];
  requirements: ProjectRequirement[];
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ rooms, requirements }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const projectSummary = `
        Rooms: ${rooms.map(r => `${r.name} (${r.area.toFixed(1)}m²)`).join(', ')}
        Requirements: ${requirements.map(req => `${req.item} (${req.category})`).join(', ')}
      `;

      const prompt = `As a world-class architectural trend analyst, perform a deep analysis of this project:
      ${projectSummary}
      
      Provide:
      1. **Current Trend Alignment**: How this project aligns with 2025-2026 architectural trends.
      2. **Innovative Suggestions**: 3-5 bold, innovative ideas to elevate this design.
      3. **Material & Tech Trends**: Suggested materials and smart technologies that fit this specific layout.
      4. **Sustainability Score**: How to improve the environmental impact of this design.
      
      Use professional, inspiring language. Format in Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAnalysis(response.text || "Analysis failed.");
    } catch (error) {
      console.error("Trend Analysis Error:", error);
      setAnalysis("Error generating analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-8 py-10 bg-zinc-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">AI Trend Analysis</h2>
            </div>
            <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
              Leverage superior design intelligence to align your project with global architectural movements and future-proof your design.
            </p>
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="mt-8 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isLoading ? 'Analyzing Project...' : 'Generate Trend Report'}
            </button>
          </div>
        </div>

        <div className="p-8">
          {analysis ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="prose prose-zinc prose-sm max-w-none"
            >
              <div className="markdown-body">
                <Markdown>{analysis}</Markdown>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
              {[
                { icon: Lightbulb, title: 'Future-Proofing', desc: 'Identify design choices that will stay relevant for decades.' },
                { icon: Target, title: 'Market Alignment', desc: 'Ensure your design meets current high-end market demands.' },
                { icon: Compass, title: 'Material Innovation', desc: 'Discover cutting-edge sustainable materials for your layout.' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Room } from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  Languages, 
  FileText, 
  Calculator, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Scale,
  Map as MapIcon,
  Globe
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'mai', name: 'Maithili (मैथिली)' },
  { code: 'sat', name: 'Santali (संताली)' },
  { code: 'ks', name: 'Kashmiri (کأشُر)' }
];

interface MunicipalComplianceProps {
  rooms: Room[];
}

export const MunicipalCompliance: React.FC<MunicipalComplianceProps> = ({ rooms }) => {
  const [location, setLocation] = useState({ state: '', city: '', address: '' });
  const [language, setLanguage] = useState('hi');
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'laws' | 'calculator' | 'naksha'>('laws');

  const checkCompliance = async () => {
    if (!location.state || !location.city) return;
    setIsLoading(true);
    try {
      const selectedLang = INDIAN_LANGUAGES.find(l => l.code === language)?.name || 'Hindi';
      const totalArea = rooms.reduce((acc, r) => acc + r.area, 0);
      
      const prompt = `As an expert Indian Building Bylaws Consultant, provide a detailed compliance report for a project in ${location.address}, ${location.city}, ${location.state}.
      
      The project currently has a total built-up area of ${totalArea.toFixed(2)} m² across ${rooms.length} rooms.
      
      Please provide the following in ${selectedLang}:
      1. **Municipal Laws (Bylaws)**: Specific FSI/FAR, Setbacks (Front, Rear, Side), and Height restrictions for ${location.city} Municipal Corporation.
      2. **Naksha Requirements**: List of drawings and documents required for municipal approval (Sanction Plan, Site Plan, etc.).
      3. **Compliance Calculation**: Based on typical bylaws for this region, calculate if the current layout is likely to be approved.
      4. **Legal Warnings**: Any specific local restrictions (e.g., Coastal Regulation Zone, Heritage zones, Airport height limits).
      
      Format in Markdown. Use professional legal and architectural terminology.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setReport(response.text || "Report generation failed.");
    } catch (error) {
      console.error("Compliance Error:", error);
      setReport("Error fetching municipal laws. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-zinc-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Municipal Compliance & Naksha</h2>
              </div>
              <p className="text-zinc-400 text-sm max-w-md">
                Verify your design against local building bylaws and generate municipal submission requirements in 15 Indian languages.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-1 flex">
                {['laws', 'calculator', 'naksha'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeSubTab === tab ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> State
              </label>
              <input 
                type="text" 
                placeholder="e.g. Maharashtra"
                className="w-full text-sm p-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                value={location.state}
                onChange={e => setLocation({...location, state: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} /> City
              </label>
              <input 
                type="text" 
                placeholder="e.g. Mumbai"
                className="w-full text-sm p-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                value={location.city}
                onChange={e => setLocation({...location, city: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Languages size={12} /> Language
              </label>
              <select 
                className="w-full text-sm p-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                {INDIAN_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={checkCompliance}
                disabled={isLoading || !location.state || !location.city}
                className="w-full h-[46px] bg-zinc-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                {isLoading ? 'Fetching Laws...' : 'Check Compliance'}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="Detailed Address (Optional for more accuracy)"
              className="w-full text-sm p-3 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
              value={location.address}
              onChange={e => setLocation({...location, address: e.target.value})}
            />
          </div>
        </div>

        {/* Report Area */}
        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {report ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-zinc prose-sm max-w-none"
              >
                <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">Compliance Report Generated</h4>
                    <p className="text-xs text-emerald-700">Based on ${location.city} Municipal Corporation Building Bylaws.</p>
                  </div>
                </div>
                <div className="markdown-body">
                  <Markdown>{report}</Markdown>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-300">
                  {activeSubTab === 'laws' && <Scale size={40} />}
                  {activeSubTab === 'calculator' && <Calculator size={40} />}
                  {activeSubTab === 'naksha' && <MapIcon size={40} />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900">Ready to Verify</h3>
                  <p className="text-sm text-zinc-500 max-w-xs">
                    Enter your project location and select your preferred language to get started.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Scale, title: 'FSI/FAR Limits', desc: 'Understand the maximum permissible built-up area for your plot size.' },
          { icon: FileText, title: 'Document Checklist', desc: 'Get a complete list of documents required for municipal submission.' },
          { icon: AlertCircle, title: 'Zonal Restrictions', desc: 'Check for airport, heritage, or environmental buffer zone restrictions.' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400">
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Namaste! I'm your Design Mentor. I'm here to help trainee architects and interior designers master their craft. Ask me about space planning, material science, or building bylaws!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const TRAINEE_PROMPTS = [
    "Critique my layout",
    "Explain FSI/FAR",
    "Lighting for small rooms",
    "Sustainable materials",
    "Standard door sizes"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are a professional architectural and interior design mentor for trainees. Provide expert advice that is educational, precise, and inspiring. When explaining concepts like FSI, setbacks, or material properties, use clear examples. Encourage sustainable and user-centric design. Use markdown for formatting.",
        }
      });

      const assistantMessage = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Unable to connect to AI services. Please check your configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100 rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <h3 className="font-black text-xs uppercase tracking-widest">Design Mentor</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Trainee Mode</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-zinc-900'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700' 
                  : 'bg-zinc-800/50 text-zinc-300 rounded-tl-none border border-zinc-700/50'
              }`}>
                <div className="markdown-body prose prose-invert prose-sm max-w-none">
                  <Markdown>{m.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 flex items-center justify-center animate-pulse border border-emerald-500/30">
              <Bot size={16} className="text-emerald-400" />
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-[24px] rounded-tl-none border border-zinc-700/50">
              <Loader2 size={18} className="animate-spin text-zinc-500" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-5">
        <div className="flex flex-wrap gap-2">
          {TRAINEE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[9px] font-black px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl border border-zinc-700 transition-all uppercase tracking-widest"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your mentor anything..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500 text-zinc-900 rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

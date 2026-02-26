import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  Ruler, 
  ShieldCheck, 
  Palette,
  Box
} from 'lucide-react';
import { motion } from 'motion/react';

const STEPS = [
  { 
    title: 'Site Analysis', 
    desc: 'Start by capturing the site photo or entering dimensions. Analyze the orientation for natural light.',
    icon: Ruler,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  { 
    title: 'Zoning & Compliance', 
    desc: 'Check Municipal Compliance for FSI, setbacks, and local building bylaws before drafting.',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  { 
    title: 'Layout Drafting', 
    desc: 'Use the Layout Planner to draw rooms. Use AI Suggester for optimized furniture placement.',
    icon: Box,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  { 
    title: 'Material & Palette', 
    desc: 'Select harmonious colors using AI Palette suggestions. Consider durability and aesthetics.',
    icon: Palette,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  { 
    title: '3D Visualization', 
    desc: 'Switch to 3D View to understand volume and spatial relationships. Check for ergonomics.',
    icon: Lightbulb,
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  }
];

export const TraineeGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-all">
      <div className="p-6 bg-zinc-900 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <BookOpen size={24} />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-widest">Design Mentor</h3>
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Architectural Workflow</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {STEPS.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm`}>
              <step.icon size={22} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Step 0{i + 1}</span>
                <h4 className="font-black text-zinc-900 text-sm tracking-tight">{step.title}</h4>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-5 bg-zinc-50 border-t border-zinc-100">
        <button className="w-full bg-zinc-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
          Start New Project <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

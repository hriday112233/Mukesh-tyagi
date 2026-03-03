import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Ruler, 
  Box, 
  ShieldCheck, 
  Calculator, 
  TrendingUp,
  Sparkles,
  Layers,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Architex AI',
    desc: 'Your professional design suite. Start by drawing your site or uploading a photo in the Layout Planner.',
    icon: Layers,
    color: 'bg-zinc-900 text-white'
  },
  {
    title: 'Layout Planner',
    desc: 'Use the "Draw Mode" to click and place points for your rooms. Close the shape by clicking the first point.',
    icon: Ruler,
    color: 'bg-blue-500 text-white'
  },
  {
    title: '3D Visualization',
    desc: 'Switch between 2D and 3D views instantly to understand spatial volume and wall heights.',
    icon: Box,
    color: 'bg-indigo-500 text-white'
  },
  {
    title: 'AI Layout Optimizer',
    desc: 'Let AI suggest the most efficient furniture arrangements and spatial flows for your rooms. (Pro Feature)',
    icon: Wand2,
    color: 'bg-purple-500 text-white'
  },
  {
    title: 'Municipal Compliance',
    desc: 'Check local building bylaws (FSI, setbacks) in 15 Indian languages based on your city. (Pro Feature)',
    icon: ShieldCheck,
    color: 'bg-emerald-500 text-white'
  },
  {
    title: 'Material Estimation',
    desc: 'Get preliminary estimates for paint, tiles, and labor costs based on your drafted area. (Pro Feature)',
    icon: Calculator,
    color: 'bg-amber-500 text-white'
  },
  {
    title: 'Material Catalog',
    desc: 'Browse an extensive database of furniture, flooring, and decorative items with AI-powered search. (Pro Feature)',
    icon: Layers,
    color: 'bg-emerald-500 text-white'
  },
  {
    title: 'Trend Analysis',
    desc: 'Analyze your design against 2025-2026 architectural trends and sustainability scores. (Pro Feature)',
    icon: TrendingUp,
    color: 'bg-rose-500 text-white'
  }
];

export const TutorialOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200"
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Platform Tutorial</span>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-6 py-4">
            <motion.div 
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center shadow-xl`}
            >
              <step.icon size={40} />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{step.title}</h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-zinc-900' : 'w-2 bg-zinc-200'}`} 
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="p-3 bg-zinc-100 text-zinc-900 rounded-2xl hover:bg-zinc-200 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              
              <button 
                onClick={() => {
                  if (currentStep < TUTORIAL_STEPS.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    onClose();
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm tracking-tight hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
              >
                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next Step'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

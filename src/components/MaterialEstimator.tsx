import React, { useState } from 'react';
import { Room } from '../types';
import { 
  Calculator, 
  PaintBucket, 
  Grid, 
  Layers, 
  ArrowRight, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MaterialEstimatorProps {
  rooms: Room[];
}

export const MaterialEstimator: React.FC<MaterialEstimatorProps> = ({ rooms }) => {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const calculateMaterials = (area: number) => {
    return {
      paint: (area * 0.1).toFixed(1), // Liters (approx 1L per 10sqm)
      tiles: (area * 1.05).toFixed(1), // Sq meters (including 5% wastage)
      cement: (area * 0.25).toFixed(1), // Bags (approx 1 bag per 4sqm for flooring)
      laborDays: Math.ceil(area / 15) // Approx 15sqm per day for 2 workers
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
        <div className="p-10 bg-zinc-900 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Calculator size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Material & Cost Estimator</h2>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Preliminary Project Analysis</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-5">
          {rooms.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-[32px] bg-zinc-50/50">
              <Layers size={48} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">No rooms defined yet</p>
              <p className="text-zinc-400 text-xs mt-2">Draw rooms in the Layout Planner to see estimates.</p>
            </div>
          ) : (
            rooms.map((room) => {
              const materials = calculateMaterials(room.area);
              const isExpanded = expandedRoom === room.id;

              return (
                <div key={room.id} className="border border-zinc-100 rounded-[24px] overflow-hidden transition-all hover:border-zinc-200">
                  <button 
                    onClick={() => setExpandedRoom(isExpanded ? null : room.id)}
                    className="w-full flex items-center justify-between p-5 bg-zinc-50/50 hover:bg-zinc-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: room.color }} />
                      <span className="font-black text-sm text-zinc-900 tracking-tight">{room.name}</span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-zinc-100">{room.area.toFixed(1)} m²</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 shadow-sm">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 bg-white">
                          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3 text-blue-600">
                              <PaintBucket size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Paint</span>
                            </div>
                            <p className="text-2xl font-black text-blue-900 tracking-tight">{materials.paint} L</p>
                            <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mt-2">Approx. 2 coats</p>
                          </div>

                          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3 text-emerald-600">
                              <Grid size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Tiles</span>
                            </div>
                            <p className="text-2xl font-black text-emerald-900 tracking-tight">{materials.tiles} m²</p>
                            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-2">Incl. 5% wastage</p>
                          </div>

                          <div className="p-5 bg-zinc-50/50 rounded-2xl border border-zinc-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3 text-zinc-600">
                              <Layers size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Cement</span>
                            </div>
                            <p className="text-2xl font-black text-zinc-900 tracking-tight">{materials.cement} Bags</p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Standard 50kg</p>
                          </div>

                          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3 text-amber-600">
                              <Calculator size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Labor</span>
                            </div>
                            <p className="text-2xl font-black text-amber-900 tracking-tight">{materials.laborDays} Days</p>
                            <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-2">Est. 2 workers</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0 shadow-sm">
            <Info size={14} />
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic">
            Note: These are preliminary estimates based on standard architectural averages. Actual requirements may vary based on site conditions, material quality, and specific design choices.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-10 rounded-[40px] border border-emerald-400/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[24px] flex items-center justify-center text-white shadow-xl border border-white/20">
            <Calculator size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Total Project Estimate</h3>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Combined materials for {rooms.length} rooms</p>
          </div>
        </div>
        <div className="text-center md:text-right relative z-10">
          <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-2">Est. Budget Range</p>
          <p className="text-4xl font-black text-white tracking-tighter">
            ₹ {(rooms.reduce((acc, r) => acc + r.area, 0) * 1500).toLocaleString()} - ₹ {(rooms.reduce((acc, r) => acc + r.area, 0) * 2500).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

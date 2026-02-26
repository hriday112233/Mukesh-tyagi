import React, { useState } from 'react';
import { LayoutCanvas } from './components/LayoutCanvas';
import { AIAssistant } from './components/AIAssistant';
import { RequirementTable } from './components/RequirementTable';
import { TrendGallery } from './components/TrendGallery';
import { LayoutSuggester } from './components/LayoutSuggester';
import { StandardDimensionGuide } from './components/StandardDimensionGuide';
import { TrendAnalysis } from './components/TrendAnalysis';
import { MunicipalCompliance } from './components/MunicipalCompliance';
import { TraineeGuide } from './components/TraineeGuide';
import { MaterialEstimator } from './components/MaterialEstimator';
import { TutorialOverlay } from './components/TutorialOverlay';
import { UI_TRANSLATIONS } from './translations';
import { Room, ProjectRequirement } from './types';
import { 
  LayoutDashboard, 
  Ruler, 
  ClipboardList, 
  Palette, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight,
  PieChart as PieChartIcon,
  Layers,
  Wand2,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_REQUIREMENTS: ProjectRequirement[] = [
  { id: '1', category: 'Structural', item: 'Load-bearing Wall', quantity: 2, specification: 'Reinforced concrete, 200mm', status: 'completed' },
  { id: '2', category: 'Interior', item: 'Oak Flooring', quantity: 120, specification: 'Engineered oak, matte finish', status: 'in-progress' },
  { id: '3', category: 'Electrical', item: 'LED Recessed Lights', quantity: 24, specification: '3000K, Dimmable', status: 'pending' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'layout' | 'requirements' | 'trends' | 'ai-layout' | 'standards' | 'trend-analysis' | 'compliance' | 'material-estimator'>('dashboard');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [requirements, setRequirements] = useState<ProjectRequirement[]>(INITIAL_REQUIREMENTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const t = (key: string) => UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS['en'][key] || key;

  const addRoom = (room: Room) => setRooms([...rooms, room]);
  const deleteRoom = (id: string) => setRooms(rooms.filter(r => r.id !== id));
  const updateRoom = (updatedRoom: Room) => setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  
  const updateRequirementStatus = (id: string, status: ProjectRequirement['status']) => {
    setRequirements(requirements.map(r => r.id === id ? { ...r, status } : r));
  };

  const addRequirement = () => {
    const newItem: ProjectRequirement = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'New',
      item: 'New Item',
      quantity: 1,
      specification: 'TBD',
      status: 'pending'
    };
    setRequirements([...requirements, newItem]);
  };

  const areaData = rooms.map(r => ({ name: r.name, value: r.area }));
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-zinc-900 border-r border-zinc-800 flex flex-col z-20 text-zinc-400"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Layers className="text-white" size={20} />
            </div>
            {isSidebarOpen && <span className="font-black text-lg tracking-tight text-white italic">Architex<span className="text-emerald-400">AI</span></span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-zinc-500 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), color: 'text-blue-400' },
            { id: 'layout', icon: Ruler, label: t('layout'), color: 'text-emerald-400' },
            { id: 'ai-layout', icon: Wand2, label: t('aiLayout'), color: 'text-purple-400' },
            { id: 'standards', icon: BookOpen, label: t('standards'), color: 'text-amber-400' },
            { id: 'trend-analysis', icon: TrendingUp, label: t('trendAnalysis'), color: 'text-rose-400' },
            { id: 'compliance', icon: ShieldCheck, label: t('compliance'), color: 'text-cyan-400' },
            { id: 'material-estimator', icon: Calculator, label: t('materialEstimator'), color: 'text-orange-400' },
            { id: 'requirements', icon: ClipboardList, label: t('requirements'), color: 'text-indigo-400' },
            { id: 'trends', icon: Palette, label: t('trends'), color: 'text-pink-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white shadow-xl shadow-black/20' 
                  : 'hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? item.color : 'text-zinc-500 group-hover:text-zinc-300'} />
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              {isSidebarOpen && activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-1">
          <button 
            onClick={() => setIsTutorialOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:bg-white/5 hover:text-white rounded-xl transition-all"
          >
            <BookOpen size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">{t('help')}</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Settings size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">{t('settings')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder={t('search')}
                className="w-full bg-zinc-100/50 border border-zinc-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <select 
              className="bg-zinc-100/50 border border-zinc-200 rounded-2xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer hover:bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="mr">मराठी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
              <option value="gu">ગુજરાતી</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
            <button className="relative p-2.5 bg-zinc-100/50 rounded-2xl text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all border border-transparent hover:border-zinc-200">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-zinc-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-zinc-900 tracking-tight">Pro Architect</p>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Premium Suite</p>
              </div>
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-zinc-200">
                <img src="https://picsum.photos/seed/architect/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { label: t('totalArea'), value: rooms.reduce((acc, r) => acc + r.area, 0).toFixed(1) + ' m²', icon: Ruler, color: 'bg-blue-500 text-white', shadow: 'shadow-blue-500/20' },
                        { label: t('requirements'), value: requirements.length, icon: ClipboardList, color: 'bg-emerald-500 text-white', shadow: 'shadow-emerald-500/20' },
                        { label: t('completion'), value: Math.round((requirements.filter(r => r.status === 'completed').length / (requirements.length || 1)) * 100) + '%', icon: PieChartIcon, color: 'bg-amber-500 text-white', shadow: 'shadow-amber-500/20' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                          <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                          </div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
                          <p className="text-4xl font-black text-zinc-900 tracking-tighter">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white p-10 rounded-[32px] border border-zinc-200 shadow-sm h-[450px] flex flex-col hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">{t('areaDistribution')}</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live Data</span>
                        </div>
                      </div>
                      {rooms.length > 0 ? (
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={areaData}
                                cx="50%"
                                cy="50%"
                                innerRadius={100}
                                outerRadius={140}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                              >
                                {areaData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-6">
                          <div className="w-20 h-20 bg-zinc-50 rounded-[32px] flex items-center justify-center border border-zinc-100">
                            <Ruler size={40} className="opacity-20" />
                          </div>
                          <p className="text-sm font-medium italic">No rooms defined yet. Start in the Layout Planner.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6 flex flex-col h-[calc(100vh-14rem)]">
                    <TraineeGuide />
                    <div className="flex-1">
                      <AIAssistant />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'layout' && (
                <motion.div
                  key="layout"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-14rem)]"
                >
                  <div className="lg:col-span-3 h-full">
                    <LayoutCanvas 
                      rooms={rooms} 
                      onAddRoom={addRoom} 
                      onDeleteRoom={deleteRoom} 
                      onUpdateRoom={updateRoom}
                    />
                  </div>
                  <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                    <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
                      <h3 className="text-xs font-black text-zinc-900 mb-6 uppercase tracking-widest">Room Inventory</h3>
                      <div className="space-y-4">
                        {rooms.map(room => (
                          <div key={room.id} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 group hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: room.color }} />
                              <div>
                                <p className="text-sm font-black text-zinc-900 tracking-tight">{room.name}</p>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{(room.area * 0.01).toFixed(2)} m²</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteRoom(room.id)}
                              className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        {rooms.length === 0 && (
                          <div className="text-center py-10 border-2 border-dashed border-zinc-100 rounded-2xl">
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Inventory Empty</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <TraineeGuide />
                  </div>
                </motion.div>
              )}

              {activeTab === 'requirements' && (
                <motion.div
                  key="requirements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RequirementTable 
                    requirements={requirements} 
                    onAdd={addRequirement} 
                    onUpdateStatus={updateRequirementStatus} 
                  />
                </motion.div>
              )}

              {activeTab === 'trends' && (
                <motion.div
                  key="trends"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TrendGallery />
                </motion.div>
              )}

              {activeTab === 'ai-layout' && (
                <motion.div
                  key="ai-layout"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <LayoutSuggester />
                </motion.div>
              )}

              {activeTab === 'standards' && (
                <motion.div
                  key="standards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <StandardDimensionGuide />
                </motion.div>
              )}

              {activeTab === 'trend-analysis' && (
                <motion.div
                  key="trend-analysis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TrendAnalysis rooms={rooms} requirements={requirements} />
                </motion.div>
              )}

              {activeTab === 'compliance' && (
                <motion.div
                  key="compliance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MunicipalCompliance rooms={rooms} />
                </motion.div>
              )}

              {activeTab === 'material-estimator' && (
                <motion.div
                  key="material-estimator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MaterialEstimator rooms={rooms} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <TutorialOverlay isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
}

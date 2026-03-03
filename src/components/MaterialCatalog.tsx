import React, { useState, useMemo } from 'react';
import { CatalogItem } from '../types';
import { CATALOG_DATA } from '../data/catalog';
import { 
  Search, 
  Filter, 
  Tag, 
  ExternalLink, 
  Info, 
  X, 
  ChevronRight, 
  Grid as GridIcon, 
  List, 
  Sparkles,
  Loader2,
  Package,
  IndianRupee,
  Layers,
  Palette,
  Layout,
  Lamp,
  Flower2,
  Droplets,
  Image as ImageIcon,
  Crown,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Package },
  { id: 'flooring', label: 'Flooring', icon: Layers },
  { id: 'paint', label: 'Paint', icon: Palette },
  { id: 'wallpaper', label: 'Wallpaper', icon: Layout },
  { id: 'furniture', label: 'Furniture', icon: GridIcon },
  { id: 'lighting', label: 'Lighting', icon: Lamp },
  { id: 'plumbing', label: 'Plumbing', icon: Droplets },
  { id: 'scenery', label: 'Scenery', icon: ImageIcon },
  { id: 'decorative', label: 'Decorative', icon: Flower2 },
];

const STYLES = ['modern', 'minimalist', 'bohemian', 'industrial', 'scandinavian', 'classic'];

interface MaterialCatalogProps {
  isPro?: boolean;
  onUpgradeClick?: () => void;
}

export const MaterialCatalog: React.FC<MaterialCatalogProps> = ({ isPro, onUpgradeClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);

  const brands = useMemo(() => {
    const allBrands = CATALOG_DATA.map(item => item.brand);
    return Array.from(new Set(allBrands)).sort();
  }, []);

  const filteredItems = useMemo(() => {
    let items = CATALOG_DATA;

    if (aiFilteredIds) {
      items = items.filter(item => aiFilteredIds.includes(item.id));
    } else {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.brand.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query)
        );
      }

      if (selectedCategory !== 'all') {
        items = items.filter(item => item.category === selectedCategory);
      }

      if (selectedStyle) {
        items = items.filter(item => item.style === selectedStyle);
      }

      if (selectedBrand) {
        items = items.filter(item => item.brand === selectedBrand);
      }

      items = items.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
    }

    return items;
  }, [searchQuery, selectedCategory, selectedStyle, selectedBrand, priceRange, aiFilteredIds]);

  const handleAiSearch = async () => {
    if (!searchQuery || isAiSearching) return;

    setIsAiSearching(true);
    try {
      const catalogSummary = CATALOG_DATA.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        style: item.style,
        type: item.type,
        application: item.application.join(', ')
      }));

      const prompt = `Based on the user's query: "${searchQuery}", filter the following catalog and return ONLY the IDs of the items that match the user's intent. 
      Catalog: ${JSON.stringify(catalogSummary)}
      Return as a JSON array of strings (IDs).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const ids = JSON.parse(response.text || '[]');
      setAiFilteredIds(ids);
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStyle(null);
    setSelectedBrand(null);
    setPriceRange([0, 100000]);
    setAiFilteredIds(null);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Search and Filters Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search materials, furniture, brands..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (aiFilteredIds) setAiFilteredIds(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
            {searchQuery && (
              <button 
                onClick={handleAiSearch}
                disabled={isAiSearching}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-50"
                title="AI Smart Search"
              >
                {isAiSearching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              </button>
            )}
          </div>
          
          <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <GridIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setAiFilteredIds(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.id 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/20' 
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-zinc-100">
          <div className="space-y-3">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Styles:</span>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    setSelectedStyle(selectedStyle === style ? null : style);
                    setAiFilteredIds(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedStyle === style 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-zinc-50 text-zinc-500 border border-zinc-100 hover:bg-zinc-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Brands:</span>
            <select 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-zinc-900/10"
              value={selectedBrand || ''}
              onChange={(e) => {
                setSelectedBrand(e.target.value || null);
                setAiFilteredIds(null);
              }}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Price Range:</span>
              <span className="text-[10px] font-bold text-zinc-900">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              step="1000"
              value={priceRange[1]}
              onChange={(e) => {
                setPriceRange([priceRange[0], parseInt(e.target.value)]);
                setAiFilteredIds(null);
              }}
              className="w-full accent-zinc-900"
            />
          </div>
        </div>

        {(selectedStyle || selectedBrand || priceRange[1] < 100000 || aiFilteredIds) && (
          <div className="flex justify-end">
            <button 
              onClick={resetFilters}
              className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest flex items-center gap-1"
            >
              <X size={12} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
              }
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer ${
                    viewMode === 'list' ? 'flex items-center p-4 gap-6' : ''
                  }`}
                  onClick={() => {
                    if (item.isPro && !isPro) {
                      onUpgradeClick?.();
                    } else {
                      setSelectedItem(item);
                    }
                  }}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-32 h-32 rounded-2xl shrink-0' : 'aspect-[4/3]'}`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-900 shadow-sm">
                        {item.category}
                      </span>
                      {item.isPro && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-1">
                          {!isPro ? <Shield size={10} /> : <Crown size={10} />} {!isPro ? 'Locked' : 'Pro'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`p-5 flex flex-col flex-1 ${viewMode === 'list' ? 'p-0' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-zinc-900 flex items-center justify-end gap-0.5">
                          <IndianRupee size={12} />
                          {item.price.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase">per {item.unit}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
                      <div className="flex gap-1">
                        <span className="px-2 py-0.5 bg-zinc-50 text-zinc-500 rounded text-[9px] font-bold uppercase">
                          {item.style}
                        </span>
                      </div>
                      <button className="p-2 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-300">
                <Package size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900">No items found</h3>
                <p className="text-sm text-zinc-500 max-w-xs">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden border border-zinc-200 flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="md:w-1/2 relative bg-zinc-100">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 left-6 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-zinc-900 shadow-xl border border-white/20 hover:bg-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="md:w-1/2 p-10 overflow-y-auto space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      {selectedItem.category}
                    </span>
                    <span className="px-2.5 py-1 bg-zinc-50 text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-zinc-100">
                      {selectedItem.style}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{selectedItem.name}</h2>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{selectedItem.brand}</p>
                </div>

                <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Price Estimate</p>
                    <p className="text-3xl font-black text-zinc-900 flex items-center gap-1">
                      <IndianRupee size={24} />
                      {selectedItem.price.toLocaleString()}
                      <span className="text-sm text-zinc-400 font-bold uppercase">/ {selectedItem.unit}</span>
                    </p>
                  </div>
                  <a 
                    href={selectedItem.supplierUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} /> Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedItem.specifications).map(([key, value]) => (
                      <div key={key} className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{key}</p>
                        <p className="text-xs font-bold text-zinc-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Recommended Applications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.application.map((app) => (
                      <span key={app} className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

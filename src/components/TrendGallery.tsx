import React from 'react';
import { DesignTrend } from '../types';
import { ExternalLink, Heart } from 'lucide-react';

const TRENDS: DesignTrend[] = [
  {
    title: "Biophilic Minimalism",
    description: "Integrating natural elements with clean lines and sustainable materials.",
    imageUrl: "https://picsum.photos/seed/biophilic/800/600",
    tags: ["Nature", "Sustainable", "Minimal"]
  },
  {
    title: "Industrial Chic 2.0",
    description: "Refined industrial aesthetics with warm wood accents and soft lighting.",
    imageUrl: "https://picsum.photos/seed/industrial/800/600",
    tags: ["Metal", "Wood", "Urban"]
  },
  {
    title: "Neo-Classical Revival",
    description: "Traditional architectural details reimagined for modern open-plan living.",
    imageUrl: "https://picsum.photos/seed/classical/800/600",
    tags: ["Classic", "Luxury", "Detail"]
  },
  {
    title: "Smart Space Optimization",
    description: "Modular furniture and hidden storage solutions for compact urban apartments.",
    imageUrl: "https://picsum.photos/seed/smart/800/600",
    tags: ["Modular", "Compact", "Tech"]
  }
];

export const TrendGallery: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif italic text-zinc-900">Latest Interior Trends</h3>
        <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">View All Trends</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRENDS.map((trend, i) => (
          <div key={i} className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={trend.imageUrl}
                alt={trend.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-zinc-900">{trend.title}</h4>
                <div className="flex gap-2">
                  <button className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors">
                    <Heart size={16} />
                  </button>
                  <button className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{trend.description}</p>
              <div className="flex flex-wrap gap-2">
                {trend.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-medium rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

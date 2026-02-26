import React from 'react';
import { ProjectRequirement } from '../types';
import { CheckCircle2, Circle, Clock, MoreVertical, Plus } from 'lucide-react';

interface RequirementTableProps {
  requirements: ProjectRequirement[];
  onAdd: () => void;
  onUpdateStatus: (id: string, status: ProjectRequirement['status']) => void;
}

export const RequirementTable: React.FC<RequirementTableProps> = ({ requirements, onAdd, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Project Requirements</h3>
          <p className="text-xs text-zinc-500">Manage configurations and structural needs</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Specification</th>
              <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {requirements.map((req) => (
              <tr key={req.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 uppercase">
                    {req.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-zinc-900">{req.item}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 font-mono">{req.quantity}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 italic">{req.specification}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      const nextStatus: Record<ProjectRequirement['status'], ProjectRequirement['status']> = {
                        'pending': 'in-progress',
                        'in-progress': 'completed',
                        'completed': 'pending'
                      };
                      onUpdateStatus(req.id, nextStatus[req.status]);
                    }}
                    className={`flex items-center gap-2 text-xs font-medium ${
                      req.status === 'completed' ? 'text-emerald-600' : 
                      req.status === 'in-progress' ? 'text-amber-600' : 'text-zinc-400'
                    }`}
                  >
                    {req.status === 'completed' ? <CheckCircle2 size={14} /> : 
                     req.status === 'in-progress' ? <Clock size={14} /> : <Circle size={14} />}
                    <span className="capitalize">{req.status.replace('-', ' ')}</span>
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

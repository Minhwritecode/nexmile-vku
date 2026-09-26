import React from 'react';
import { Home, GitCompare, MapPin, Bell, BrainCircuit, Sliders, History } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface NavigationProps {
  onOpenSimulationModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenSimulationModal }) => {
  const { activeTab, setActiveTab, allAnomalies } = useSimulation();

  interface NavItem {
    id: 'home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeCount?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'compare', label: 'So sánh', icon: GitCompare },
    { id: 'track', label: 'Theo dõi xe', icon: MapPin },
    {
      id: 'alerts',
      label: 'Cảnh báo',
      icon: Bell,
      badgeCount: allAnomalies.length,
    },
    { id: 'ai_details', label: 'Chi tiết AI', icon: BrainCircuit },
    { id: 'history', label: 'Lịch sử', icon: History },
  ];

  return (
    <>
      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block max-w-5xl mx-auto px-4 mt-3">
        <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Quick Simulation Trigger Button */}
          <button
            onClick={onOpenSimulationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Mô phỏng dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Sticky) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5">
        <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

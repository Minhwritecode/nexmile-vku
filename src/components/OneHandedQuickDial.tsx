import React, { useState } from 'react';
import {
  Hand,
  Zap,
  X,
  Bus,
  CloudRain,
  Radio,
  Sliders,
  Smartphone,
  Navigation as NavigationIcon,
  HelpCircle,
  Sun,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  History,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const OneHandedQuickDial: React.FC = () => {
  const {
    handMode,
    toggleHandMode,
    setActiveTab,
    setSelectedTrackingRoute,
    vkuWeather,
    changeWeather,
    traffic,
    simulateTrafficCongested,
    simulateSensorScanned,
    setIsGesturesModalOpen,
    goToNextTab,
    goToPrevTab,
  } = useSimulation();

  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (cb: () => void) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }
    cb();
    setIsOpen(false);
  };

  const handleTrackRoute = (route: 'route_6' | 'route_13') => {
    handleAction(() => {
      setSelectedTrackingRoute(route);
      setActiveTab('track');
    });
  };

  const handleCycleWeather = () => {
    const nextMap = {
      sunny: 'cloudy',
      cloudy: 'rain',
      rain: 'heavy_rain',
      heavy_rain: 'sunny',
    } as const;
    const next = nextMap[vkuWeather.condition] || 'sunny';
    handleAction(() => {
      changeWeather(next);
    });
  };

  const handleToggleTraffic = () => {
    handleAction(() => {
      simulateTrafficCongested(traffic !== 'jammed');
    });
  };

  const handleScanSensor = () => {
    handleAction(() => {
      simulateSensorScanned();
    });
  };

  const isRight = handMode === 'right';

  return (
    <>
      {/* Backdrop when dial is open on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* Floating Action Container anchored to the student's thumb reach zone */}
      <div
        className={`fixed bottom-20 md:bottom-6 z-40 flex flex-col ${
          isRight ? 'right-4 items-end' : 'left-4 items-start'
        }`}
      >
        {/* Expanded Quick Action Wheel / Card */}
        {isOpen && (
          <div
            className={`mb-3 w-72 sm:w-80 rounded-3xl bg-slate-900 border border-slate-700/90 p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-200 ${
              isRight ? 'origin-bottom-right' : 'origin-bottom-left'
            }`}
          >
            {/* Header of thumb panel */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Hand className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Phím Tắt 1 Tay</span>
                    <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                      {isRight ? 'Tay Phải 👉' : 'Tay Trái 👈'}
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Chạm 1 ngón không cần với tay</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={toggleHandMode}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition-colors"
                  title="Chuyển vị trí sang bên kia màn hình"
                >
                  {isRight ? '← Trái' : 'Phải →'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick 1-Tap Action Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Action 1: Track Route 13 */}
              <button
                onClick={() => handleTrackRoute('route_13')}
                className="p-2.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-left flex items-start gap-2 transition-all active:scale-95 group"
              >
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block group-hover:text-emerald-300">
                    Tuyến 13 VKU
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">Xem vị trí xe</span>
                </div>
              </button>

              {/* Action 2: Track Route 06 */}
              <button
                onClick={() => handleTrackRoute('route_6')}
                className="p-2.5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-left flex items-start gap-2 transition-all active:scale-95 group"
              >
                <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block group-hover:text-blue-300">
                    Tuyến 06 VKU
                  </span>
                  <span className="text-[9px] text-blue-400 font-mono">Xem vị trí xe</span>
                </div>
              </button>

              {/* Action 3: Cycle Weather */}
              <button
                onClick={handleCycleWeather}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-start gap-2 transition-all active:scale-95 group"
              >
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block group-hover:text-amber-300 truncate">
                    Thời tiết: {vkuWeather.temperatureC}°C
                  </span>
                  <span className="text-[9px] text-slate-400">Đổi nắng/mưa</span>
                </div>
              </button>

              {/* Action 4: Toggle Traffic */}
              <button
                onClick={handleToggleTraffic}
                className={`p-2.5 rounded-2xl border text-left flex items-start gap-2 transition-all active:scale-95 group ${
                  traffic === 'jammed'
                    ? 'bg-rose-950/40 border-rose-500/40'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl shrink-0 ${
                    traffic === 'jammed'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span
                    className={`text-[11px] font-bold block truncate ${
                      traffic === 'jammed' ? 'text-rose-300' : 'text-white'
                    }`}
                  >
                    {traffic === 'jammed' ? 'Kẹt xe: BẬT' : 'Giao thông'}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {traffic === 'jammed' ? 'Bấm để tắt' : 'Bật thử kẹt'}
                  </span>
                </div>
              </button>

              {/* Action 5: Scan Station Sensor */}
              <button
                onClick={handleScanSensor}
                className="p-2.5 rounded-2xl bg-teal-950/40 hover:bg-teal-900/50 border border-teal-500/30 text-left flex items-start gap-2 transition-all active:scale-95 group"
              >
                <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block group-hover:text-teal-300">
                    Quét Trạm Xe
                  </span>
                  <span className="text-[9px] text-teal-400">Chạm thẻ ảo</span>
                </div>
              </button>

              {/* Action 6: Open Full Gestures CheatSheet */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsGesturesModalOpen(true);
                }}
                className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-start gap-2 transition-all active:scale-95 group"
              >
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block group-hover:text-purple-300">
                    Bảng Cử Chỉ
                  </span>
                  <span className="text-[9px] text-slate-400">Xem toàn bộ</span>
                </div>
              </button>

              {/* Action 7: Trip History */}
              <button
                onClick={() => {
                  handleAction(() => setActiveTab('history'));
                }}
                className="col-span-2 p-2 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between px-3 transition-all active:scale-95 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-teal-500/20 text-teal-400">
                    <History className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-teal-300">
                    Nhật ký & Lịch sử di chuyển
                  </span>
                </div>
                <span className="text-[10px] text-teal-400 font-mono">Xem thống kê →</span>
              </button>
            </div>

            {/* Quick Swipe Preview Control */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  goToPrevTab();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-slate-800/70"
              >
                <ArrowLeft className="w-3 h-3 text-slate-400" />
                <span>Trang trước</span>
              </button>

              <span className="text-[10px] text-slate-400 italic">hoặc vuốt ngang màn hình</span>

              <button
                onClick={() => {
                  goToNextTab();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white px-2 py-1 rounded-lg bg-slate-800/70"
              >
                <span>Trang sau</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* Main Floating Thumb Trigger Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-xs shadow-2xl transition-all active:scale-90 border ${
            isOpen
              ? 'bg-slate-800 text-white border-slate-600 ring-2 ring-emerald-500/50'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white border-emerald-400/40 shadow-emerald-950/60'
          }`}
          title="Chế độ Một Tay & Cử Chỉ Nhanh"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 text-slate-300" />
              <span className="text-xs">Đóng</span>
            </>
          ) : (
            <>
              <Hand className="w-4 h-4 text-emerald-200" />
              <span className="font-bold">1 Tay</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

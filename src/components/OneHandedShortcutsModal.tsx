import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Keyboard,
  Hand,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Bus,
  CloudRain,
  Radio,
  Sliders,
  Check,
  RotateCcw,
  Navigation as NavigationIcon,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface OneHandedShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneHandedShortcutsModal: React.FC<OneHandedShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    handMode,
    setHandMode,
    toggleHandMode,
    goToNextTab,
    goToPrevTab,
    activeTab,
  } = useSimulation();

  const [activeTabSection, setActiveTabSection] = useState<'gestures' | 'keyboard'>('gestures');
  const [playgroundSwipeCount, setPlaygroundSwipeCount] = useState(0);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'left' | 'right' | null>(null);

  if (!isOpen) return null;

  // Local playground touch handlers
  let touchStartX = 0;
  let touchStartY = 0;

  const handlePlaygroundTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handlePlaygroundTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaY) > 60) return;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setLastSwipeDirection('left');
        setPlaygroundSwipeCount((c) => c + 1);
        if ('vibrate' in navigator) navigator.vibrate(25);
      } else {
        setLastSwipeDirection('right');
        setPlaygroundSwipeCount((c) => c + 1);
        if ('vibrate' in navigator) navigator.vibrate(25);
      }
    }
  };

  const mobileGestures = [
    {
      icon: <ArrowRight className="w-5 h-5 text-emerald-400" />,
      title: 'Vuốt sang trái (Swipe Left)',
      desc: 'Chuyển nhanh sang màn hình kế tiếp theo thứ tự: Trang chủ → So sánh → Theo dõi xe → Cảnh báo → Chi tiết AI.',
      badge: 'Chuyển tab 1 chạm',
    },
    {
      icon: <ArrowLeft className="w-5 h-5 text-blue-400" />,
      title: 'Vuốt sang phải (Swipe Right)',
      desc: 'Quay lại màn hình trước đó ngay lập tức mà không cần với ngón tay xuống đáy màn hình.',
      badge: 'Quay lại tức thì',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Vòng tròn ngón cái nổi (Thumb Quick Wheel)',
      desc: 'Nút nổi hình bàn tay góc dưới mở ra các phím tắt 1 chạm kích thước lớn (≥ 48px) chuẩn công thái học.',
      badge: 'Dễ với ngón tay',
    },
    {
      icon: <Hand className="w-5 h-5 text-teal-400" />,
      title: 'Tùy chọn tay thuận (Trái 👈 / Phải 👉)',
      desc: 'Dễ dàng đổi vị trí nút nổi sang góc dưới-phải (cho người thuận tay phải) hoặc dưới-trái (cho người thuận tay trái).',
      badge: 'Tùy biến góc cầm',
    },
  ];

  const keyboardShortcuts = [
    { key: '1 hoặc H', label: 'Về Trang chủ (Home)', category: 'Điều hướng' },
    { key: '2 hoặc C', label: 'Màn hình So sánh lộ trình (Compare)', category: 'Điều hướng' },
    { key: '3 hoặc T', label: 'Bản đồ Theo dõi xe buýt (Track)', category: 'Điều hướng' },
    { key: '4 hoặc A', label: 'Trung tâm Cảnh báo sự cố (Alerts)', category: 'Điều hướng' },
    { key: '5 hoặc D', label: 'Chi tiết phân tích Lõi AI (AI Details)', category: 'Điều hướng' },
    { key: '6 hoặc L', label: 'Lịch sử di chuyển & Thống kê (History)', category: 'Điều hướng' },
    { key: 'R', label: 'Chuyển đổi theo dõi Tuyến 6 ⇄ Tuyến 13', category: 'Xe buýt' },
    { key: 'W', label: 'Chuyển đổi thời tiết mô phỏng tại VKU', category: 'Mô phỏng' },
    { key: 'J', label: 'Bật / tắt cảnh báo kẹt xe giờ cao điểm', category: 'Mô phỏng' },
    { key: 'S', label: 'Quét thẻ cảm biến trạm xe buýt ảo (NFC/IoT)', category: 'Cảm biến' },
    { key: 'M', label: 'Bật / tắt bảng điều khiển mô phỏng dữ liệu', category: 'Hệ thống' },
    { key: '? hoặc G', label: 'Mở / đóng bảng Cử chỉ & Phím tắt này', category: 'Trợ giúp' },
    { key: 'Esc', label: 'Đóng cửa sổ hiện tại', category: 'Hệ thống' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Cử Chỉ Một Tay & Bảng Phím Tắt
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  One-Handed Mobile Reach
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tối ưu cho sinh viên VKU cầm điện thoại bằng 1 tay khi đi bộ, che ô hoặc đứng trên xe buýt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs Switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-slate-900">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTabSection('gestures')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTabSection === 'gestures'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Cử chỉ vuốt di động (Mobile)</span>
            </button>
            <button
              onClick={() => setActiveTabSection('keyboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTabSection === 'keyboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Phím tắt bàn phím (Desktop)</span>
            </button>
          </div>

          {/* Quick Handedness Toggle */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Vùng ngón cái:</span>
            <button
              onClick={toggleHandMode}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                handMode === 'right'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}
              title="Đổi vị trí phím ngón cái sang góc trái hoặc phải"
            >
              <Hand className="w-3.5 h-3.5" />
              <span>{handMode === 'right' ? 'Tay Phải 👉' : 'Tay Trái 👈'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTabSection === 'gestures' ? (
            <>
              {/* Gestures List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mobileGestures.map((g, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          {g.icon}
                        </div>
                        <h4 className="text-xs font-bold text-white">{g.title}</h4>
                      </div>
                      <span className="text-[10px] bg-slate-700/70 text-slate-300 font-medium px-2 py-0.5 rounded-full">
                        {g.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed pl-1">{g.desc}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Gesture Playground Box */}
              <div className="rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-950/20 p-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Khu vực trải nghiệm thử cử chỉ vuốt 1 tay:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Dùng ngón tay vuốt ngang (trái hoặc phải) trong khung xám bên dưới để thử cảm giác lướt màn hình:
                </p>

                <div
                  onTouchStart={handlePlaygroundTouchStart}
                  onTouchEnd={handlePlaygroundTouchEnd}
                  className="mx-auto max-w-md h-24 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center select-none active:bg-slate-800 transition-colors cursor-grab"
                >
                  <div className="flex items-center gap-4 text-slate-400">
                    <ArrowLeft className={`w-5 h-5 ${lastSwipeDirection === 'right' ? 'text-blue-400 scale-125' : ''}`} />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      ← Vuốt ngang ngón cái ở đây →
                    </span>
                    <ArrowRight className={`w-5 h-5 ${lastSwipeDirection === 'left' ? 'text-emerald-400 scale-125' : ''}`} />
                  </div>
                  {playgroundSwipeCount > 0 && (
                    <div className="text-[11px] text-emerald-400 font-bold mt-1.5 animate-in fade-in">
                      ✓ Đã nhận diện cử chỉ {lastSwipeDirection === 'left' ? 'Vuốt sang Trái (Tiến)' : 'Vuốt sang Phải (Lùi)'}! (Tổng: {playgroundSwipeCount} lần)
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Try Buttons */}
              <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-300">
                  <span className="font-semibold text-white">Thử đổi tab ngay: </span>
                  <span className="text-slate-400">Đang ở tab <strong>{activeTab}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevTab}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Lùi tab (Vuốt phải)</span>
                  </button>
                  <button
                    onClick={goToNextTab}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Tiến tab (Vuốt trái)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Keyboard Shortcuts List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {keyboardShortcuts.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors"
                  >
                    <div className="text-xs text-slate-300">
                      <span className="font-semibold text-white block">{s.label}</span>
                      <span className="text-[10px] text-slate-400">{s.category}</span>
                    </div>
                    <kbd className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs font-black text-emerald-400 shadow-sm shrink-0">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-200">Mẹo bàn phím:</strong> Trên bất kỳ màn hình nào, bạn có thể nhấn phím số <kbd className="px-1 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">1</kbd>–<kbd className="px-1 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">5</kbd> để nhảy nhanh đến màn hình tương ứng, hoặc phím <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">W</kbd> để kiểm tra phản ứng của AI khi thời tiết VKU mưa to.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold">Esc</kbd> hoặc bấm ngoài để đóng
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-colors"
          >
            Đã hiểu, sẵn sàng dùng
          </button>
        </div>
      </div>
    </div>
  );
};

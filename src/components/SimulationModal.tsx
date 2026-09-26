import React from 'react';
import {
  X,
  Sliders,
  AlertTriangle,
  Radio,
  WifiOff,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Navigation,
  RotateCcw,
  Sparkles,
  Bus,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose }) => {
  const {
    route6Telemetry,
    route13Telemetry,
    sensors,
    traffic,
    weather,
    vkuWeather,
    changeWeather,
    simulateRoute6Delayed,
    simulateRoute13Delayed,
    simulateRoute13Approaching,
    simulateBusPassedStop,
    simulateGpsSignalLost,
    simulateSensorScanned,
    simulateSensorUnstable,
    simulateHeavyRain,
    simulateTrafficCongested,
    simulateFounderIncident,
    simulateHonestAiMotorbike,
    resetSimulation,
    setIsDemoModeActive,
    jumpToDemoStep,
  } = useSimulation();

  if (!isOpen) return null;

  const r13Sensor = sensors['SN-13-06'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bảng Điều Khiển Mô Phỏng Dữ Liệu</h3>
              <p className="text-[11px] text-slate-400">Thay đổi trạng thái để xem AI phản hồi ngay lập tức</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Quick Demo Launch Alert */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-800 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kịch bản Demo Cuộc Thi (11 Bước Chuẩn)</span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Chạy toàn bộ quy trình từ chọn giờ, so sánh, trễ chuyến đến cảm biến quét trạm.
              </p>
            </div>
            <button
              onClick={() => {
                setIsDemoModeActive(true);
                jumpToDemoStep(1);
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 flex items-center gap-1 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Bật Demo Tour</span>
            </button>
          </div>

          {/* Group 1: Bus Vehicle Triggers */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mô phỏng Phương tiện & ETA
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Route 13 Delayed */}
              <button
                onClick={() => simulateRoute13Delayed()}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  route13Telemetry.delayMinutes > 0
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Xe Tuyến 13 bị trễ</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {route13Telemetry.delayMinutes > 0 ? 'Đang trễ 12 phút (Bật)' : 'Trễ 12 phút do tắc đường'}
                  </div>
                </div>
              </button>

              {/* Route 6 Delayed */}
              <button
                onClick={() => simulateRoute6Delayed()}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  route6Telemetry.delayMinutes > 0
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Xe Tuyến 06 bị trễ</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {route6Telemetry.delayMinutes > 0 ? 'Đang trễ 10 phút (Bật)' : 'Trễ 10 phút tại Ngã Ba Huế'}
                  </div>
                </div>
              </button>

              {/* Route 13 Approaching */}
              <button
                onClick={simulateRoute13Approaching}
                className="p-3 rounded-xl border bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 text-left flex items-start gap-2.5 transition-all"
              >
                <Bus className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Xe Tuyến 13 đến gần</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Khoảng cách &lt; 400m, ETA 2–4 phút</div>
                </div>
              </button>

              {/* Bus Passed Stop */}
              <button
                onClick={() => simulateBusPassedStop()}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  route13Telemetry.hasPassedUserStop
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bus className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Xe đã đi qua trạm</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {route13Telemetry.hasPassedUserStop ? 'Xe đã qua trạm (Bật)' : 'Kích hoạt cảnh báo lỡ chuyến'}
                  </div>
                </div>
              </button>

              {/* Slide 2: Real-life Founder Observation (12:2x -> 12:55) */}
              <button
                onClick={() => {
                  simulateFounderIncident();
                  onClose();
                }}
                className="p-3 rounded-xl border bg-amber-950/30 border-amber-500/40 text-amber-200 hover:bg-amber-950/50 text-left flex items-start gap-2.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-300">Sự cố thực tế Slide 02 (12:2x ➔ 12:55)</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    Dự kiến 12:2x nhưng xe đến lúc 12:55. AI kiểm chứng xe chưa qua trạm, khuyên an tâm chờ.
                  </div>
                </div>
              </button>

              {/* Slide 5 & 10: Honest AI test */}
              <button
                onClick={() => {
                  simulateHonestAiMotorbike();
                  onClose();
                }}
                className="p-3 rounded-xl border bg-blue-950/30 border-blue-500/40 text-blue-200 hover:bg-blue-950/50 text-left flex items-start gap-2.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-cyan-300">Kiểm chứng AI Trung Thực (Slide 05 & 10)</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    Cả 2 tuyến buýt đều trễ nặng. AI thẳng thắn khuyên đi xe máy để kịp giờ học/thi VKU.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: IoT Sensors & GPS Telemetry */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cảm biến Trạm & Viễn thám GPS
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Sensor Scanned */}
              <button
                onClick={simulateSensorScanned}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  r13Sensor?.status === 'scanned'
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Radio className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Cảm biến trạm đã quét</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {r13Sensor?.status === 'scanned' ? 'Đã xác nhận quét thành công' : 'Mô phỏng xe lướt qua cảm biến'}
                  </div>
                </div>
              </button>

              {/* Sensor Unstable */}
              <button
                onClick={() => simulateSensorUnstable()}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  r13Sensor?.status === 'unstable'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Cảm biến không ổn định</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {r13Sensor?.status === 'unstable' ? 'Tín hiệu yếu chập chờn (Bật)' : 'Giảm độ tin cậy trạm'}
                  </div>
                </div>
              </button>

              {/* GPS Signal Lost */}
              <button
                onClick={() => simulateGpsSignalLost()}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  route13Telemetry.isGpsStale
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <WifiOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">GPS mất tín hiệu / Dữ liệu cũ</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {route13Telemetry.isGpsStale ? 'Tọa độ GPS cũ 3 phút trước' : 'Mô phỏng mất tín hiệu vệ tinh'}
                  </div>
                </div>
              </button>

              {/* VKU Weather Presets */}
              <div className="p-3 rounded-xl border bg-slate-800/80 border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {weather === 'sunny' ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : weather === 'cloudy' ? (
                      <Cloud className="w-4 h-4 text-slate-300" />
                    ) : weather === 'rain' ? (
                      <CloudRain className="w-4 h-4 text-blue-400" />
                    ) : (
                      <CloudLightning className="w-4 h-4 text-cyan-400 animate-bounce" />
                    )}
                    <span>Thời tiết tại VKU: {vkuWeather.temperatureC}°C</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    +{vkuWeather.aiModeWeightImpact.busBonusPercent}% ưu tiên Bus
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => changeWeather('sunny')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                      weather === 'sunny'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nắng 32°C</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeWeather('cloudy')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                      weather === 'cloudy'
                        ? 'bg-slate-700/60 border-slate-400 text-white font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5 text-slate-300" />
                    <span>Mây 28°C</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeWeather('rain')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                      weather === 'rain'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mưa 25°C</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeWeather('heavy_rain')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                      weather === 'heavy_rain'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CloudLightning className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mưa to 23°C</span>
                  </button>
                </div>
              </div>

              {/* Congested Traffic */}
              <button
                onClick={() => simulateTrafficCongested()}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all sm:col-span-2 ${
                  traffic === 'jammed'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Navigation className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">
                    {traffic === 'jammed' ? 'Đang kẹt xe giờ cao điểm (Bật)' : 'Cảnh báo kẹt xe bất ngờ'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Bắn thông báo Toast đẩy: Ùn tắc nghiêm trọng Lê Văn Hiến, tăng +15 phút di chuyển
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetSimulation}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại mặc định</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-colors shadow-md shadow-emerald-950/40"
          >
            Đóng bảng điều khiển
          </button>
        </div>
      </div>
    </div>
  );
};

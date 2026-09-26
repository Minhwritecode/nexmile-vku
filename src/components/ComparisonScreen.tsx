import React from 'react';
import {
  Sparkles,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Bus,
  Bike,
  Navigation as NavIcon,
  HelpCircle,
  ThumbsUp,
  Flame,
  Check,
  Zap,
  TrendingUp,
  History,
  Info,
  Layers,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { CommuteOption, WeatherCondition } from '../types';
import { Sun, Cloud, CloudRain, CloudLightning, ShieldAlert, Droplets, Wind } from 'lucide-react';

export const ComparisonScreen: React.FC = () => {
  const {
    recommendation,
    desiredArrivalTime,
    setSelectedTrackingRoute,
    setActiveTab,
    priority,
    vkuWeather,
    changeWeather,
    route6Telemetry,
    route13Telemetry,
    traffic,
    addCurrentTripToHistory,
  } = useSimulation();

  const handleSelectRoute = (routeId: 'route_6' | 'route_13') => {
    setSelectedTrackingRoute(routeId);
    setActiveTab('track');
  };

  const getBadgeStyle = (badgeColor: CommuteOption['badgeColor']) => {
    switch (badgeColor) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'blue':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'rose':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  // Determine dynamic next-action recommendation
  const hasRoute13Delay = route13Telemetry.delayMinutes > 0;
  const hasRoute6Delay = route6Telemetry.delayMinutes > 0;
  const isBadWeather = vkuWeather.condition === 'rain' || vkuWeather.condition === 'heavy_rain';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-28 md:pb-16">
      {/* Top Hackathon Demo Banner */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold text-white">Hệ thống Trợ lý AI Đón Xe Buýt VKU</span>
          <span className="text-slate-400 hidden sm:inline">• Trình diễn thuật toán đa tầng</span>
        </div>
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
          Dữ liệu mô phỏng cho prototype
        </span>
      </div>

      {/* AI Decision Rationale Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/70 border border-emerald-500/40 p-5 md:p-6 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Lớp AI 1: Phân tích & Lựa chọn phương án
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Độ tin cậy tổng thể: {recommendation.overallConfidencePercent}%
                </span>
              </div>

              <button
                onClick={addCurrentTripToHistory}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <History className="w-3.5 h-3.5" />
                <span>Lưu vào Lịch sử</span>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {recommendation.primaryRationale}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {recommendation.detailedExplanation}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-emerald-900/60 mt-3">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Nên rời nhà lúc: <strong className="text-amber-300 text-sm font-mono">{recommendation.leaveHomeTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dự kiến đến VKU: <strong className="text-emerald-300 text-sm font-mono">{recommendation.expectedArrivalTime}</strong> (mục tiêu {desiredArrivalTime})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Next-Action Banner (Mục tiêu 3: Khi dữ liệu thay đổi, AI tự động đề xuất hành động tiếp theo) */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                AI Tự Động Đề Xuất Hành Động Tiếp Theo (Real-Time Next Action)
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.2 rounded font-mono font-bold">
                Tự thích ứng
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {hasRoute13Delay ? (
                <span>
                  <strong className="text-amber-400">Cảnh báo:</strong> Tuyến 13 đang trễ {route13Telemetry.delayMinutes} phút. AI đề xuất sinh viên đi bộ nhanh ra trạm đón hoặc chuyển sang Tuyến 06 để kịp giờ vào lớp {desiredArrivalTime}.
                </span>
              ) : isBadWeather ? (
                <span>
                  <strong className="text-cyan-300">Khuyến nghị thời tiết:</strong> Mưa lớn làm tăng 40% rủi ro trượt ngã xe máy và ngập đường Nam Kỳ Khởi Nghĩa. AI tự động khóa ưu tiên xe buýt có mái che.
                </span>
              ) : traffic === 'jammed' ? (
                <span>
                  <strong className="text-rose-400">Ùn tắc giờ cao điểm:</strong> AI đã cộng thêm 12 phút dự phòng cho xe máy và đề xuất đón Tuyến 13 chạy đường gom thông thoáng.
                </span>
              ) : (
                <span>
                  Lộ trình Tuyến 13 đang tối ưu nhất. AI khuyến nghị sinh viên bước ra trạm lúc <strong className="text-emerald-400 font-mono">{recommendation.leaveHomeTime}</strong> để đón đúng chuyến xe không cần chờ lâu.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => handleSelectRoute('route_13')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
          >
            <span>Thực hiện ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Core Hackathon Pillars Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pillar 1: Bus vs Personal Vehicle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Bus className="w-4 h-4" />
              <span>1. Xe Buýt vs Xe Máy</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">
              Tiết kiệm 75%
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Vé buýt chỉ 5.000đ, miễn phí gửi xe bãi VKU (tiết kiệm 10–15 phút xếp hàng lấy vé vào giờ cao điểm).
          </p>
        </div>

        {/* Pillar 2: Route 6 vs Route 13 Prediction */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>2. Độ Tin Cậy Tuyến 6 & 13</span>
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono font-bold">
              T13: 94% | T06: 78%
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Tuyến 13 chờ 8–10 phút (ít ùn ứ), Tuyến 06 chờ 10–15 phút do trục Cầu Rồng dễ đông đúc.
          </p>
        </div>

        {/* Pillar 3: Adaptive Data Triggers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>3. Phản Ứng Dữ Liệu Tức Thì</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
              IoT Sensor + GPS
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Cảm biến trạm quẹt thẻ đối chiếu vị trí vệ tinh. Tự động chuyển tuyến dự phòng nếu xe trước bị sự cố.
          </p>
        </div>
      </div>

      {/* VKU Campus Weather Integration Context Strip */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-emerald-400 shrink-0">
            {vkuWeather.condition === 'heavy_rain' ? (
              <CloudLightning className="w-5 h-5 text-cyan-400 animate-bounce" />
            ) : vkuWeather.condition === 'rain' ? (
              <CloudRain className="w-5 h-5 text-blue-400" />
            ) : vkuWeather.condition === 'cloudy' ? (
              <Cloud className="w-5 h-5 text-slate-300" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Khí tượng VKU: {vkuWeather.conditionLabel} ({vkuWeather.temperatureC}°C)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                Mưa {vkuWeather.rainProbabilityPercent}%
              </span>
              {vkuWeather.floodRisk !== 'none' && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                  Ngập Nam Kỳ Khởi Nghĩa
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {vkuWeather.aiCommuteAdvice}
            </p>
          </div>
        </div>

        {/* Quick Weather Simulator Selector for Comparison */}
        <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
          <span className="text-[10px] text-slate-400 hidden lg:inline">Đổi thời tiết:</span>
          {(['sunny', 'cloudy', 'rain', 'heavy_rain'] as WeatherCondition[]).map((cond) => (
            <button
              key={cond}
              onClick={() => changeWeather(cond)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                vkuWeather.condition === cond
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {cond === 'sunny'
                ? '☀️ Nắng'
                : cond === 'cloudy'
                ? '⛅ Mây'
                : cond === 'rain'
                ? '🌧️ Mưa'
                : '⛈️ Mưa to'}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Comparison Cards (Clean layout with non-clipped cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendation.comparisonOptions.map((opt) => {
          const isRec = opt.isRecommended;
          const isBus = opt.category === 'bus';

          return (
            <div
              key={opt.id}
              className={`relative rounded-3xl p-5 border transition-colors flex flex-col justify-between ${
                isRec
                  ? 'bg-slate-900/90 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
              style={isRec ? {
                animation: 'recommendedPulse 2.5s ease-in-out infinite',
              } : undefined}
            >
              {/* Top Banner Tag */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        opt.id === 'route_6'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : opt.id === 'route_13'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {opt.id === 'motorbike' ? <Bike className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{opt.name}</h4>
                      <span className="text-[11px] text-slate-400">
                        {opt.category === 'bus' ? 'Xe buýt trợ giá Đà Nẵng' : 'Xe máy cá nhân'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getBadgeStyle(
                      opt.badgeColor
                    )}`}
                  >
                    {opt.badge}
                  </span>
                </div>

                {/* Key Timetable snippet */}
                <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rời nhà lúc</span>
                    <span className="text-sm font-bold font-mono text-white">{opt.leaveHomeTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Đến cổng trường</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">{opt.arrivalTime}</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="space-y-2 pt-1 text-xs">
                  {/* Total travel time */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tổng thời gian:</span>
                    </span>
                    <span className="font-bold text-white font-mono">{opt.totalTimeMinutes} phút</span>
                  </div>

                  {/* Waiting time range */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Thời gian chờ xe:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      {opt.waitingTimeMinutesRange[0] === 0 && opt.waitingTimeMinutesRange[1] === 0
                        ? '0 phút (chủ động)'
                        : `${opt.waitingTimeMinutesRange[0]}–${opt.waitingTimeMinutesRange[1]} phút`}
                    </span>
                  </div>

                  {/* Estimated Cost */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chi phí ước tính:</span>
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {opt.estimatedCostVnd.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {/* On time probability */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Khả năng đúng giờ:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-400 h-full rounded-full"
                          style={{ width: `${opt.onTimeProbabilityPercent}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-teal-300 font-mono text-[11px]">
                        {opt.onTimeProbabilityPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Confidence score */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Độ tin cậy AI:</span>
                    <span className="font-bold text-slate-200 font-mono">{opt.confidencePercent}%</span>
                  </div>

                  {/* VKU Parking note */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Gửi xe bãi VKU:</span>
                    <span className={`font-semibold ${opt.parkingTimeMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {opt.parkingTimeMinutes > 0 ? `Chờ ~${opt.parkingTimeMinutes} phút` : '0 phút (xuống cổng)'}
                    </span>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="pt-2 space-y-1.5 text-[11px]">
                  {/* Slide 8 Specific Highlight Snippet */}
                  {opt.id === 'route_13' && (
                    <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2.5 text-[11px] text-emerald-300 space-y-0.5">
                      <div className="font-bold flex items-center justify-between">
                        <span>Tại sao chọn Tuyến 13? (Slide 08)</span>
                        <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono font-bold">RECOMMENDED</span>
                      </div>
                      <div className="text-slate-300">Cửa sổ thời gian đến ổn định hơn (8–12 phút), ít bị ùn ứ tại các nút giao cầu sông Hàn.</div>
                    </div>
                  )}

                  {opt.id === 'route_6' && (
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-0.5">
                      <div className="font-bold text-amber-300">Đặc thù Tuyến 06 (Slide 08)</div>
                      <div className="text-slate-400">Khoảng chờ dao động rộng (5–18 phút) do đoạn Ngã Ba Huế & Cầu Rồng biến động theo giờ.</div>
                    </div>
                  )}

                  {opt.id === 'motorbike' && (
                    <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-2.5 text-[11px] text-blue-300 space-y-0.5">
                      <div className="font-bold text-cyan-300">Nguyên tắc AI Trung Thực (Slide 05 & 10)</div>
                      <div className="text-slate-300">Không quảng cáo xe buýt mù quáng. Nếu cả 2 tuyến buýt đều trễ giờ vào lớp, AI sẽ đề xuất xe máy.</div>
                    </div>
                  )}

                  <div className="text-slate-300 space-y-1 pt-1">
                    {opt.pros.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-emerald-300/90">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                    {opt.cons.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5"></span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-800">
                {isBus ? (
                  <button
                    onClick={() => handleSelectRoute(opt.id as 'route_6' | 'route_13')}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isRec
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <span>Theo dõi trực tiếp {opt.name.slice(0, 8)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-center py-2 text-[11px] text-slate-400 bg-slate-800/40 rounded-xl">
                    Phương án tự túc • Hãy chú ý đội mũ bảo hiểm & thời tiết
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


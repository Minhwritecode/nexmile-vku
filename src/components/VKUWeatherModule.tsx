import React, { useState } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Gauge,
  Info,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { WeatherCondition } from '../types';

interface VKUWeatherModuleProps {
  compact?: boolean;
}

export const VKUWeatherModule: React.FC<VKUWeatherModuleProps> = ({ compact = false }) => {
  const { vkuWeather, changeWeather, setActiveTab } = useSimulation();
  const [showHourly, setShowHourly] = useState(false);

  const getWeatherIcon = (cond: WeatherCondition, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-10 h-10',
    };
    const cls = sizeClasses[size];

    switch (cond) {
      case 'heavy_rain':
        return <CloudLightning className={`${cls} text-cyan-400 animate-bounce`} />;
      case 'rain':
        return <CloudRain className={`${cls} text-blue-400`} />;
      case 'cloudy':
        return <Cloud className={`${cls} text-slate-300`} />;
      case 'sunny':
      default:
        return <Sun className={`${cls} text-amber-400 animate-[spin_12s_linear_infinite]`} />;
    }
  };

  const weatherOptions: {
    id: WeatherCondition;
    label: string;
    temp: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'sunny',
      label: 'Nắng ráo',
      temp: '32°C',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      color: 'hover:border-amber-400',
    },
    {
      id: 'cloudy',
      label: 'Nhiều mây',
      temp: '28°C',
      icon: <Cloud className="w-4 h-4 text-slate-300" />,
      color: 'hover:border-slate-400',
    },
    {
      id: 'rain',
      label: 'Mưa rào',
      temp: '25°C',
      icon: <CloudRain className="w-4 h-4 text-blue-400" />,
      color: 'hover:border-blue-400',
    },
    {
      id: 'heavy_rain',
      label: 'Mưa to / Ngập',
      temp: '23°C',
      icon: <CloudLightning className="w-4 h-4 text-cyan-400" />,
      color: 'hover:border-cyan-400',
    },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 p-5 shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Background ambient glow based on weather condition */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20 ${
          vkuWeather.condition === 'heavy_rain'
            ? 'bg-cyan-500'
            : vkuWeather.condition === 'rain'
            ? 'bg-blue-500'
            : vkuWeather.condition === 'cloudy'
            ? 'bg-slate-400'
            : 'bg-amber-500'
        }`}
      ></div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Trạm Khí tượng VKU (Hòa Quý • Ngũ Hành Sơn)
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quan trắc vi khí hậu khuôn viên trường phục vụ thuật toán AI
            </p>
          </div>
        </div>

        {/* Flood or Weather Warning Badge */}
        {vkuWeather.floodRisk !== 'none' && (
          <div
            className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border animate-pulse ${
              vkuWeather.floodRisk === 'high'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {vkuWeather.floodRisk === 'high'
                ? 'Cảnh báo ngập đường Nam Kỳ Khởi Nghĩa (15-25cm)'
                : 'Nguy cơ đọng nước đoạn rẽ vào VKU'}
            </span>
          </div>
        )}
      </div>

      {/* Main Weather Information Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 relative z-10">
        {/* Left: Temperature & Condition Summary */}
        <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="shrink-0">{getWeatherIcon(vkuWeather.condition, 'lg')}</div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">
                {vkuWeather.temperatureC}°C
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Cảm giác {vkuWeather.feelsLikeC}°C
              </span>
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">
              {vkuWeather.conditionLabel}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              AQI: <strong className="text-emerald-300">{vkuWeather.airQualityAqi}</strong> (Tốt) • UV:{' '}
              <strong className={vkuWeather.uvIndex >= 6 ? 'text-amber-400' : 'text-slate-300'}>
                {vkuWeather.uvIndex}
              </strong>
            </div>
          </div>
        </div>

        {/* Center: Real-time environmental metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80">
            <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Độ ẩm</span>
              <span className="font-bold text-white font-mono">{vkuWeather.humidityPercent}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80">
            <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Xác suất mưa</span>
              <span className="font-bold text-cyan-300 font-mono">
                {vkuWeather.rainProbabilityPercent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80">
            <Wind className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Gió</span>
              <span className="font-bold text-white text-[11px] truncate block">
                {vkuWeather.windSpeedKmh} km/h
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80">
            <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Mặt đường</span>
              <span className="font-bold text-slate-200 text-[10px] truncate block">
                {vkuWeather.condition === 'sunny'
                  ? 'Khô ráo'
                  : vkuWeather.condition === 'heavy_rain'
                  ? 'Ngập trũng'
                  : 'Trơn ướt'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: AI Decision Impact Card */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-800/80 to-slate-800 p-3.5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tác động trực tiếp vào AI</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">
                {vkuWeather.aiModeWeightImpact.busBonusPercent >= 20 ? 'Ưu tiên Xe Buýt' : 'Cân bằng'}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
              {vkuWeather.aiCommuteAdvice}
            </p>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">
                Xe buýt: +{vkuWeather.aiModeWeightImpact.busBonusPercent}%
              </span>
              {vkuWeather.aiModeWeightImpact.motorbikePenaltyPercent > 0 && (
                <span className="text-rose-400 font-semibold">
                  Xe máy: -{vkuWeather.aiModeWeightImpact.motorbikePenaltyPercent}%
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab('compare')}
              className="text-emerald-300 hover:text-white flex items-center gap-0.5 font-bold transition-colors"
            >
              <span>Xem bảng điểm</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Weather Simulation Switcher Row */}
      <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Thử nghiệm điều kiện thời tiết tại VKU:</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {weatherOptions.map((opt) => {
            const isSelected = vkuWeather.condition === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => changeWeather(opt.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
                <span className="text-[10px] font-mono opacity-80">({opt.temp})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hourly Weather Micro-Chart — always visible, feeds AI ETA logic */}
      <div
        className="mt-4 pt-4 border-t border-slate-800 relative z-10"
        style={{ animation: 'chartFadeIn 0.4s ease-out' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Biểu đồ thời tiết theo giờ → Hỗ trợ AI dự báo ETA xe buýt
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Xác suất mưa % + Nhiệt độ °C</span>
        </div>

        {/* SVG Mini Bar Chart */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/60 p-3 overflow-hidden">
          <svg
            viewBox="0 0 400 90"
            className="w-full"
            style={{ height: '90px' }}
            role="img"
            aria-label="Biểu đồ xác suất mưa theo giờ tại VKU"
          >
            {vkuWeather.hourlyForecast.map((h, i) => {
              const totalSlots = vkuWeather.hourlyForecast.length;
              const slotWidth = 400 / totalSlots;
              const barMaxHeight = 55;
              const rainBarH = Math.max(3, (h.rainProb / 100) * barMaxHeight);
              const barX = i * slotWidth + slotWidth * 0.18;
              const barW = slotWidth * 0.45;
              const rainBarY = 62 - rainBarH;

              // Temp line: map tempC 20-38 → y 10-55
              const tempY = 55 - ((h.tempC - 20) / 18) * 40;

              // Rain bar color
              const rainColor =
                h.rainProb >= 70
                  ? '#38bdf8'   // cyan-400
                  : h.rainProb >= 40
                  ? '#60a5fa'   // blue-400
                  : '#34d399';  // emerald-400

              return (
                <g key={i}>
                  {/* Grid line */}
                  <line
                    x1={i * slotWidth}
                    y1="62"
                    x2={i * slotWidth}
                    y2="64"
                    stroke="#334155"
                    strokeWidth="1"
                  />

                  {/* Rain probability bar */}
                  <rect
                    x={barX}
                    y={rainBarY}
                    width={barW}
                    height={rainBarH}
                    rx="2"
                    fill={rainColor}
                    opacity="0.8"
                    style={{
                      transformOrigin: `${barX + barW / 2}px 62px`,
                      animation: `barGrowUp 0.6s ease-out ${i * 0.08}s both`,
                    }}
                  />

                  {/* Rain % label on bar */}
                  {h.rainProb >= 15 && (
                    <text
                      x={barX + barW / 2}
                      y={rainBarY - 2}
                      textAnchor="middle"
                      fontSize="7"
                      fill={rainColor}
                      fontWeight="bold"
                    >
                      {h.rainProb}%
                    </text>
                  )}

                  {/* Hour label */}
                  <text
                    x={barX + barW / 2}
                    y="75"
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="#94a3b8"
                    fontWeight="600"
                  >
                    {h.time}
                  </text>

                  {/* Ca label */}
                  <text
                    x={barX + barW / 2}
                    y="84"
                    textAnchor="middle"
                    fontSize="6"
                    fill="#64748b"
                  >
                    {i === 0 ? 'Ca 1' : i === 1 ? 'Ca 2' : i === 2 ? 'Tan' : 'Chiều'}
                  </text>

                  {/* Temp dot */}
                  <circle
                    cx={barX + barW / 2}
                    cy={tempY}
                    r="3"
                    fill={h.tempC >= 30 ? '#f59e0b' : '#e2e8f0'}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {/* Temp label */}
                  <text
                    x={barX + barW / 2 + 6}
                    y={tempY + 3}
                    textAnchor="start"
                    fontSize="7"
                    fill={h.tempC >= 30 ? '#f59e0b' : '#94a3b8'}
                    fontWeight="bold"
                  >
                    {h.tempC}°
                  </text>

                  {/* Temp line connector */}
                  {i < vkuWeather.hourlyForecast.length - 1 && (() => {
                    const nextH = vkuWeather.hourlyForecast[i + 1];
                    const nextSlotX = (i + 1) * slotWidth + slotWidth * 0.18 + barW / 2;
                    const nextTempY = 55 - ((nextH.tempC - 20) / 18) * 40;
                    return (
                      <line
                        x1={barX + barW / 2}
                        y1={tempY}
                        x2={nextSlotX}
                        y2={nextTempY}
                        stroke="#475569"
                        strokeWidth="1"
                        strokeDasharray="3 2"
                      />
                    );
                  })()}
                </g>
              );
            })}

            {/* Baseline */}
            <line x1="0" y1="62" x2="400" y2="62" stroke="#334155" strokeWidth="1" />

            {/* Legend */}
            <rect x="0" y="0" width="8" height="6" rx="1" fill="#34d399" opacity="0.8" />
            <text x="10" y="6.5" fontSize="6.5" fill="#94a3b8">Mưa thấp</text>
            <rect x="52" y="0" width="8" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
            <text x="62" y="6.5" fontSize="6.5" fill="#94a3b8">Mưa trung bình</text>
            <rect x="118" y="0" width="8" height="6" rx="1" fill="#38bdf8" opacity="0.8" />
            <text x="128" y="6.5" fontSize="6.5" fill="#94a3b8">Mưa cao</text>
            <circle cx="164" cy="3" r="3" fill="#f59e0b" />
            <text x="169" y="6.5" fontSize="6.5" fill="#94a3b8">Nhiệt độ (°C)</text>
          </svg>
        </div>

        {/* AI ETA Impact note */}
        <div className="mt-2 flex items-start gap-2 px-1">
          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            <span className="text-emerald-400 font-semibold">AI:</span>{' '}
            {vkuWeather.hourlyForecast[0]?.rainProb >= 60
              ? `Xác suất mưa ${vkuWeather.hourlyForecast[0].rainProb}% trong ca đầu → AI cộng thêm ${vkuWeather.aiModeWeightImpact.estimatedExtraDelayMinutes} phút dự phòng vào ETA tuyến 06 & 13.`
              : vkuWeather.hourlyForecast[0]?.rainProb >= 30
              ? `Mưa rào có thể xuất hiện. AI tự động điều chỉnh trọng số thời tiết trong thuật toán ETA.`
              : `Thời tiết thuận lợi. AI đang ưu tiên tối thiểu thời gian chờ (không cộng thêm buffer mưa).`}
          </p>
        </div>

        {/* Collapsible hourly card detail */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setShowHourly(!showHourly)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 font-medium transition-colors"
          >
            <span>
              {showHourly ? 'Ẩn chi tiết từng giờ' : 'Xem chi tiết từng giờ'}
            </span>
            {showHourly ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showHourly && (
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {vkuWeather.hourlyForecast.map((h, i) => (
              <div
                key={i}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center space-y-1"
              >
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                  {h.time} {i === 0 ? '(Ca 1)' : i === 1 ? '(Ca 2)' : i === 2 ? '(Tan ca)' : '(Ca chiều)'}
                </span>
                <div className="flex items-center justify-center py-0.5">
                  {getWeatherIcon(h.condition, 'sm')}
                </div>
                <div className="text-xs font-bold text-white font-mono">{h.tempC}°C</div>
                <div className="text-[10px] text-cyan-400 font-medium">Mưa: {h.rainProb}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

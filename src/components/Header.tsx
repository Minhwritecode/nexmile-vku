import React, { useState, useEffect } from 'react';
import {
  Bus,
  Sparkles,
  AlertCircle,
  PlayCircle,
  RotateCcw,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Activity,
  ShieldCheck,
  Hand,
  Smartphone,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext';
import { WeatherCondition } from '../types';

interface HeaderProps {
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const {
    weather,
    vkuWeather,
    changeWeather,
    traffic,
    setTraffic,
    resetSimulation,
    isDemoModeActive,
    setIsDemoModeActive,
    jumpToDemoStep,
    allAnomalies,
    setIsGesturesModalOpen,
  } = useSimulation();

  const [currentTime, setCurrentTime] = useState('');

  const nextWeatherMap: Record<WeatherCondition, WeatherCondition> = {
    sunny: 'cloudy',
    cloudy: 'rain',
    rain: 'heavy_rain',
    heavy_rain: 'sunny',
  };

  const handleCycleWeather = () => {
    const next = nextWeatherMap[weather] || 'sunny';
    changeWeather(next);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Disclaimer Watermark */}
      <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-blue-500/15 border-b border-slate-800 px-3 py-1 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Dữ liệu mô phỏng cho prototype • Dành riêng cho sinh viên VKU Đà Nẵng</span>
          <span className="hidden sm:inline-block bg-slate-800/80 text-emerald-400 px-1.5 py-0.5 rounded text-[11px] font-mono border border-emerald-500/30">
            Tuyến 06 & Tuyến 13
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white font-black text-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                NexMile
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                VKU Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block truncate max-w-md">
              <span className="font-semibold text-emerald-400">Choose smarter. Wait less. Arrive on time.</span>
              <span className="text-slate-400"> • Minh (23IT162) & Nhi (24DM078)</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Clock */}
        <div className="flex items-center gap-2">
          {/* Live Clock */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{currentTime || '07:15:00'}</span>
          </div>

          {/* Weather Quick Switch connected to VKU Campus Station */}
          <button
            onClick={handleCycleWeather}
            title={`Trạm Khí tượng VKU: ${vkuWeather.conditionLabel} (${vkuWeather.temperatureC}°C). Bấm để chuyển đổi thời tiết mô phỏng.`}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
              weather === 'sunny'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : weather === 'cloudy'
                ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                : weather === 'rain'
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 hover:bg-blue-500/30'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 ring-1 ring-cyan-500/30'
            }`}
          >
            {weather === 'sunny' ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : weather === 'cloudy' ? (
              <Cloud className="w-4 h-4 text-slate-300 shrink-0" />
            ) : weather === 'rain' ? (
              <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <CloudLightning className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce" />
            )}
            <span className="hidden sm:inline text-[11px] font-semibold">
              VKU: {vkuWeather.temperatureC}°C
            </span>
            <span className="sm:hidden text-[10px] font-mono">{vkuWeather.temperatureC}°</span>
          </button>

          {/* Guided Demo Launch Button */}
          <button
            onClick={() => {
              setIsDemoModeActive(!isDemoModeActive);
              if (!isDemoModeActive) jumpToDemoStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isDemoModeActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-900/50'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <PlayCircle className={`w-4 h-4 ${isDemoModeActive ? 'text-white' : 'text-emerald-400'}`} />
            <span className="hidden sm:inline">Kịch bản Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Shortcuts & Gestures Modal Button */}
          <button
            onClick={() => setIsGesturesModalOpen(true)}
            title="Bảng phím tắt & Cử chỉ 1 tay (Nhấn ?)"
            className="p-2 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Hand className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden md:inline text-[11px] font-semibold">Cử chỉ & Phím tắt</span>
          </button>

          {/* Reset button */}
          <button
            onClick={resetSimulation}
            title="Đặt lại dữ liệu mô phỏng ban đầu"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Account / Profile Badge */}
          {user ? (
            <div className="relative group ml-1">
              <button 
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-800/90 border border-emerald-500/40 hover:border-emerald-400 transition shadow-sm"
                title={`${user.fullName} (${user.studentId || user.email})`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-slate-950 ${
                  user.avatarColor === 'cyan' ? 'bg-cyan-400' :
                  user.avatarColor === 'amber' ? 'bg-amber-400' :
                  user.avatarColor === 'teal' ? 'bg-teal-400' :
                  user.avatarColor === 'blue' ? 'bg-blue-400' :
                  user.avatarColor === 'rose' ? 'bg-rose-400' : 'bg-emerald-400'
                }`}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left text-[11px] leading-tight max-w-[100px] truncate">
                  <div className="font-semibold text-slate-200 truncate">{user.fullName}</div>
                  <div className="text-[10px] text-emerald-400 font-mono truncate">{user.studentId || user.faculty || 'VKU'}</div>
                </div>
              </button>

              {/* Dropdown Menu on hover/focus */}
              <div className="absolute right-0 mt-1 w-52 py-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                  {user.studentId && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      MSSV: {user.studentId}
                    </span>
                  )}
                </div>
                <div className="px-3 py-1.5 text-[11px] text-slate-400">
                  <p>Khoa: <span className="text-slate-200 font-medium">{user.faculty || 'CNTT'}</span></p>
                  <p>Tuyến: <span className="text-emerald-400 font-medium">{user.preferredRouteId === 'route_6' ? 'Tuyến 06' : user.preferredRouteId === 'both' ? 'Tuyến 06 & 13' : 'Tuyến 13'}</span></p>
                </div>
                <div className="border-t border-slate-800 mt-1 pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                  >
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth ? onOpenAuth() : null}
              className="ml-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  Radio,
  Wifi,
  WifiOff,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Navigation as NavIcon,
  Play,
  ArrowRight,
  Maximize2,
  Sliders,
  Building2,
  Phone,
  ExternalLink,
  Calendar,
  Users,
  Info,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { ROUTE_6_STOPS, ROUTE_13_STOPS } from '../data/mockRoutes';

export const TrackingScreen: React.FC = () => {
  const {
    selectedTrackingRoute,
    setSelectedTrackingRoute,
    route6Telemetry,
    route13Telemetry,
    sensors,
    simulateSensorScanned,
    simulateRoute13Delayed,
    simulateBusPassedStop,
    simulateGpsSignalLost,
    simulateFounderIncident,
    traffic,
    weather,
    futaStations,
    futaRoutes,
    getRealtimeFutaDepartures,
  } = useSimulation();

  const [activeTrackingSubTab, setActiveTrackingSubTab] = useState<'stops' | 'realtime_trips' | 'futa_stations'>('stops');

  const isR13 = selectedTrackingRoute === 'route_13';
  const currentTelemetry = isR13 ? route13Telemetry : route6Telemetry;
  const currentFutaRoute = futaRoutes[selectedTrackingRoute];
  const realtimeDepartures = getRealtimeFutaDepartures(selectedTrackingRoute);
  const stops = isR13 ? ROUTE_13_STOPS : ROUTE_6_STOPS;
  const userStop = stops.find((s) => s.isUserStop) || stops[5];
  const userSensor = sensors[userStop.sensorId] || {
    sensorId: userStop.sensorId,
    status: 'ready',
    stopName: userStop.name,
    signalStrengthRssi: -60,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Route Switcher Tabs */}
      <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTrackingRoute('route_13')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              isR13
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tuyến 13 (BV Ung Bướu - VKU)</span>
            <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded">
              Khuyên dùng
            </span>
          </button>

          <button
            onClick={() => setSelectedTrackingRoute('route_6')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              !isR13
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span>Tuyến 06 (BX Trung Tâm - VKU)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="hidden sm:inline bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            FUTA Bus Lines • Danabus
          </span>
          <span className="hidden md:inline">Xe phụ trách: <strong className="text-white">{isR13 ? '43B-013.88' : '43B-006.12'}</strong></span>
        </div>
      </div>

      {/* Official FUTA Bus Lines Authority Banner */}
      <div className="bg-gradient-to-r from-orange-500/15 via-slate-900 to-emerald-500/10 rounded-2xl border border-orange-500/30 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-orange-950/40">
            FUTA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Hãng xe Phương Trang (FUTA Bus Lines) • Danabus
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono border border-orange-500/30 font-semibold">
                Dữ liệu chính thức
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Vận hành các tuyến buýt trợ giá sinh viên VKU (Tuyến 06 & 13) • 05:30 – 19:00 hàng ngày • Vé HSSV: 5.000đ/lượt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <a
            href="tel:19006067"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 font-bold transition shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>1900 6067</span>
          </a>
          <a
            href="https://futabus.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
          >
            <span>futabus.vn</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Sub-view switcher tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTrackingSubTab('stops')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTrackingSubTab === 'stops'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Lộ trình trạm & Cảm biến IoT</span>
        </button>

        <button
          onClick={() => setActiveTrackingSubTab('realtime_trips')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTrackingSubTab === 'realtime_trips'
              ? 'bg-slate-800 text-orange-400 border border-orange-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Chuyến xe FUTA Realtime ({currentFutaRoute.peakHeadwayMinutes}p/chuyến)</span>
        </button>

        <button
          onClick={() => setActiveTrackingSubTab('futa_stations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTrackingSubTab === 'futa_stations'
              ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>3 Bến xe Đà Nẵng (Phương Trang)</span>
        </button>
      </div>

      {/* VIEW 1: STOPS & TELEMETRY */}
      {activeTrackingSubTab === 'stops' && (
        <>
          {/* Main ETA & Status Telemetry Card (Layer 2 AI) */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isR13 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  <Bus className="w-6 h-6" />
                </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lớp AI 2: Dự đoán thời gian chờ thông minh
                </span>
                {currentTelemetry.hasPassedUserStop ? (
                  <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                    Xe đã đi qua trạm
                  </span>
                ) : currentTelemetry.delayMinutes > 0 ? (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    Bị trễ {currentTelemetry.delayMinutes} phút
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Đang di chuyển đúng lịch trình
                  </span>
                )}
              </div>

              {/* Main ETA Highlight */}
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {currentTelemetry.hasPassedUserStop ? (
                  <span className="text-rose-400">Xe đã rời khỏi trạm bạn chờ</span>
                ) : (
                  <>
                    Xe {currentTelemetry.routeName} còn khoảng{' '}
                    <span className="text-emerald-400 font-mono">
                      {currentTelemetry.estimatedArrivalMinMinutes}–{currentTelemetry.estimatedArrivalMaxMinutes} phút
                    </span>
                  </>
                )}
              </h2>

              <p className="text-xs text-slate-300 mt-1">
                Trạm đón của bạn: <strong className="text-white font-semibold">{userStop.name}</strong> (Mã cảm biến: <span className="font-mono text-emerald-400">{userStop.sensorId}</span>)
              </p>
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 min-w-[140px] text-center self-start md:self-auto">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mức độ tin cậy AI</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {currentTelemetry.confidencePercent}%
            </span>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentTelemetry.confidencePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Telemetry Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* GPS telemetry */}
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              {currentTelemetry.isGpsStale ? (
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              )}
              <span>Tín hiệu GPS</span>
            </div>
            <div className="text-xs font-bold text-white">
              {currentTelemetry.isGpsStale ? (
                <span className="text-rose-400">Dữ liệu cũ ({Math.round(currentTelemetry.gpsLastUpdatedSecondsAgo / 60)} ph trước)</span>
              ) : (
                <span className="text-emerald-300">Cập nhật {currentTelemetry.gpsLastUpdatedSecondsAgo}s trước</span>
              )}
            </div>
          </div>

          {/* Station Sensor Status */}
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Radio className="w-3.5 h-3.5 text-teal-400" />
              <span>Cảm biến trạm</span>
            </div>
            <div className="text-xs font-bold">
              {userSensor.status === 'scanned' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã quét ({userSensor.lastScannedTimestamp || '07:18'})
                </span>
              ) : userSensor.status === 'unstable' ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Tín hiệu chập chờn
                </span>
              ) : (
                <span className="text-teal-300">Đã sẵn sàng quét</span>
              )}
            </div>
          </div>

          {/* Speed & Traffic */}
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <NavIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Vận tốc thực tế</span>
            </div>
            <div className="text-xs font-bold text-white font-mono">
              {currentTelemetry.speedKmh} km/h • {traffic === 'jammed' ? 'Ùn tắc nặng' : traffic === 'dense' ? 'Đông đúc' : 'Thông thoáng'}
            </div>
          </div>

          {/* Hardware Verification */}
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đối chiếu GPS & Cảm biến</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {userSensor.status === 'scanned' ? (
                <span className="text-emerald-300">Khớp chuẩn (&lt; 15m)</span>
              ) : (
                <span>Đang đồng bộ vệ tinh</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Simulation Action Buttons for Testing */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Thử nghiệm nhanh:</span>
          <button
            onClick={simulateSensorScanned}
            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Mô phỏng cảm biến đã quét</span>
          </button>

          <button
            onClick={() => simulateRoute13Delayed(currentTelemetry.delayMinutes === 0)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Mô phỏng xe bị trễ</span>
          </button>

          <button
            onClick={() => simulateBusPassedStop(!currentTelemetry.hasPassedUserStop)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Mô phỏng xe đã qua trạm</span>
          </button>

          <button
            onClick={simulateFounderIncident}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sự cố thực tế Slide 02 (12:2x ➔ 12:55)</span>
          </button>
        </div>
      </div>

      {/* Visual Bus Route Transit Diagram (Schematic Map) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Sơ đồ hành trình {currentTelemetry.routeName} đến VKU
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {stops.length} trạm dừng • Điểm cuối: VKU
          </span>
        </div>

        {/* Linear Schematic Map Line */}
        <div className="relative pt-16 pb-8 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          {/* Main Transit Track Line */}
          <div className="relative min-w-[720px] pt-4">
            {/* Background line */}
            <div className="absolute top-1/2 left-8 right-8 h-2 -translate-y-1/2 bg-slate-800 rounded-full"></div>
            {/* Active completed line */}
            <div
              className={`absolute top-1/2 left-8 h-2 -translate-y-1/2 rounded-full transition-all duration-700 ${
                isR13 ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  ((currentTelemetry.currentStopIndex + currentTelemetry.progressToNextStop) / (stops.length - 1)) * 100
                )}%`,
              }}
            ></div>

            {/* Stations along the track */}
            <div className="relative flex justify-between items-center z-10">
              {stops.map((stop, index) => {
                const isBusHere = index === currentTelemetry.currentStopIndex;
                const isPassed = index < currentTelemetry.currentStopIndex;
                const isUserWaitingStop = stop.isUserStop;
                const isDestinationStop = stop.isDestination;

                return (
                  <div key={stop.id} className="flex flex-col items-center group relative min-w-[72px]">
                    {/* Station Node Marker */}
                    <div className="relative mb-2">
                      {isUserWaitingStop && (
                        <div className="absolute -inset-2 bg-amber-400/30 rounded-full animate-ping pointer-events-none"></div>
                      )}

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDestinationStop
                            ? 'bg-emerald-500 border-white text-slate-950 font-black shadow-lg shadow-emerald-500/50'
                            : isUserWaitingStop
                            ? 'bg-amber-400 border-white text-slate-950 font-bold shadow-lg shadow-amber-400/50'
                            : isPassed
                            ? 'bg-emerald-700 border-emerald-500 text-white'
                            : 'bg-slate-800 border-slate-600 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-mono">{index + 1}</span>
                      </div>

                      {/* Moving Bus Avatar Icon above stop */}
                      {isBusHere && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce pointer-events-none">
                          <div
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono text-white whitespace-nowrap shadow-2xl flex items-center gap-1.5 ${
                              isR13
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 border border-emerald-300 shadow-emerald-950/70'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-500 border border-blue-300 shadow-blue-950/70'
                            }`}
                          >
                            <Bus className="w-3.5 h-3.5 text-white" />
                            <span>{currentTelemetry.routeName}</span>
                          </div>
                          <div
                            className={`w-2.5 h-2.5 rotate-45 -mt-1.5 ${
                              isR13 ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Station Name & Sensor Details */}
                    <div className="text-center w-24">
                      <span
                        className={`text-[11px] block leading-tight font-medium ${
                          isUserWaitingStop
                            ? 'text-amber-300 font-extrabold underline decoration-amber-400'
                            : isDestinationStop
                            ? 'text-emerald-400 font-bold'
                            : isPassed
                            ? 'text-slate-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {stop.shortName}
                      </span>

                      {/* Sensor Tag */}
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                        {stop.sensorId}
                      </span>

                      {/* Station specific badges */}
                      {isUserWaitingStop && (
                        <span className="inline-block mt-1 bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-500/40">
                          Trạm bạn chờ
                        </span>
                      )}
                      {isDestinationStop && (
                        <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/40">
                          Đích đến
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span>Trạm bạn đang đứng chờ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Cổng trường ĐH VKU</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-teal-400" />
              <span>Cảm biến trạm IoT</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            *Dữ liệu lộ trình và điểm dừng theo thông tin chuẩn từ Danabus & FUTA Bus Lines
          </span>
        </div>
      </div>
        </>
      )}

      {/* VIEW 2: REAL-TIME FUTA DEPARTURES */}
      {activeTrackingSubTab === 'realtime_trips' && (
        <div className="space-y-4">
          {/* Header Card for Route Schedule */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-bold text-xs border border-orange-500/30">
                    FUTA City Bus
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Biểu đồ giờ các chuyến xe tiếp theo ({currentFutaRoute.routeNumber})
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Đơn vị khai thác: <strong className="text-orange-400">{currentFutaRoute.operator}</strong> • Tần suất: {currentFutaRoute.peakHeadwayMinutes} phút/chuyến
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-emerald-500/15 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/30 font-semibold font-mono">
                  Giá vé: {currentFutaRoute.studentFareVnd.toLocaleString('vi-VN')}đ/lượt
                </span>
                <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl border border-slate-700 font-semibold">
                  {currentFutaRoute.operatingHours}
                </span>
              </div>
            </div>

            {/* List of upcoming real-time departures */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Điểm đón mục tiêu của bạn: <strong className="text-white font-semibold">{userStop.name}</strong></span>
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Thời gian thực
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {realtimeDepartures.map((trip, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border transition-all ${
                      idx === 0
                        ? 'bg-gradient-to-r from-orange-500/10 via-slate-800 to-slate-800 border-orange-500/40 shadow-lg'
                        : 'bg-slate-800/70 border-slate-700/70 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          idx === 0 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Xe {trip.plateNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Tài xế: {trip.driverName}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        trip.status === 'approaching'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                          : trip.status === 'departing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {trip.status === 'approaching'
                          ? 'Sắp đến trạm'
                          : trip.status === 'departing'
                          ? 'Đang trên đường'
                          : 'Đúng giờ'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Xuất bến đầu</span>
                        <span className="font-mono font-bold text-slate-200">{trip.departureTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Dự kiến đến trạm đón</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {trip.estimatedArrivalAtUserStop}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-300 font-medium">
                        Ước tính: còn <strong className="text-orange-400 font-mono font-bold">{trip.minutesRemaining} phút</strong>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Độ lấp đầy: {trip.occupancyPercent}%
                      </span>
                    </div>

                    {/* Progress occupancy bar */}
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          trip.occupancyPercent > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${trip.occupancyPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Support hotline bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-400" />
                <span>Tổng đài giải đáp thắc mắc xe buýt FUTA: <strong>1900 6067</strong> (Bấm phím 1)</span>
              </div>
              <a
                href="https://futabus.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
              >
                <span>Xem trên futabus.vn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 3 OFFICIAL DA NANG BUS STATIONS */}
      {activeTrackingSubTab === 'futa_stations' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/10 via-slate-900 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Hệ thống 3 Bến xe chính thức TP Đà Nẵng & Nhà xe Phương Trang
                </h3>
                <p className="text-xs text-slate-300">
                  Thông tin chuẩn xác về địa chỉ, hotline điều hành, và mạng lưới kết nối đến ĐH VKU
                </p>
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/30">
              Đà Nẵng • 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {futaStations.map((station) => (
              <div
                key={station.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-slate-700 p-5 shadow-xl flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      Bến xe Đà Nẵng
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Cách VKU {station.distanceToVkuKm} km
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {station.name}
                  </h4>

                  <div className="text-xs text-slate-300 space-y-1.5">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{station.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Hotline: <strong className="text-white">{station.phone}</strong> (FUTA: {station.hotlineFuta})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Giờ hoạt động: {station.operatingHours}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
                    {station.futaRole}
                  </p>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      Tuyến kết nối nổi bật
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {station.connectingRoutes.slice(0, 2).map((routeStr, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                          <span className="truncate">{routeStr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`tel:${station.hotlineFuta}`}
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Gọi FUTA</span>
                  </a>
                  <a
                    href={station.officialWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Trang chủ FUTA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

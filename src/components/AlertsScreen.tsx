import React from 'react';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  ArrowRight,
  Bus,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  CornerDownRight,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { BusAnomaly } from '../types';

export const AlertsScreen: React.FC = () => {
  const {
    allAnomalies,
    route6Telemetry,
    route13Telemetry,
    setSelectedTrackingRoute,
    setActiveTab,
    simulateRoute13Delayed,
    simulateRoute6Delayed,
    simulateBusPassedStop,
  } = useSimulation();

  const handleAction = (anomaly: BusAnomaly) => {
    if (anomaly.actionType === 'switch_route') {
      if (anomaly.targetRouteId) {
        setSelectedTrackingRoute(anomaly.targetRouteId);
        setActiveTab('track');
      } else {
        setActiveTab('compare');
      }
    } else if (anomaly.actionType === 'take_motorbike') {
      setActiveTab('compare');
    } else if (anomaly.actionType === 'walk_to_stop') {
      setActiveTab('track');
    } else {
      setActiveTab('track');
    }
  };

  const getSeverityStyle = (severity: BusAnomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-rose-950/20 border-rose-500/40',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: AlertOctagon,
          iconColor: 'text-rose-400',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-950/20 border-amber-500/40',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
        };
      case 'info':
      default:
        return {
          cardBg: 'bg-blue-950/20 border-blue-500/40',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: Info,
          iconColor: 'text-blue-400',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Trung tâm Cảnh báo Thông minh AI</h2>
            {allAnomalies.length > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {allAnomalies.length} cảnh báo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chủ động phát hiện trễ chuyến, xe dừng quá lâu, tọa độ GPS cũ và đề xuất đổi tuyến ngay lập tức.
          </p>
        </div>

        {/* Quick simulation buttons for testing alert states */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => simulateRoute13Delayed(route13Telemetry.delayMinutes === 0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
          >
            {route13Telemetry.delayMinutes > 0 ? 'Tắt trễ Tuyến 13' : 'Tạo trễ Tuyến 13 (+12ph)'}
          </button>
          <button
            onClick={() => simulateRoute6Delayed(route6Telemetry.delayMinutes === 0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
          >
            {route6Telemetry.delayMinutes > 0 ? 'Tắt trễ Tuyến 6' : 'Tạo trễ Tuyến 6 (+10ph)'}
          </button>
        </div>
      </div>

      {/* Cross-Route Smart Suggestion (Highlight prompt example) */}
      {(route13Telemetry.delayMinutes >= 8 || route6Telemetry.delayMinutes >= 8) && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/50 p-5 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Gợi ý hành động từ AI
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  Ưu tiên cao
                </span>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">
                {route13Telemetry.delayMinutes >= 8 ? (
                  <>
                    Xe <strong className="text-amber-400">Tuyến 13</strong> đang trễ khoảng {route13Telemetry.delayMinutes} phút.{' '}
                    <strong className="text-emerald-400">Tuyến 06</strong> hiện có độ tin cậy và ETA ổn định hơn. Bạn có muốn chuyển sang Tuyến 06 để kịp giờ điểm danh VKU không?
                  </>
                ) : (
                  <>
                    <strong className="text-amber-400">Tuyến 06 bị trễ (Slide 08):</strong> Tuyến 13 hiện là lựa chọn an toàn và ổn định hơn ({route13Telemetry.estimatedArrivalMinMinutes}–{route13Telemetry.estimatedArrivalMaxMinutes} phút, độ tin cậy {route13Telemetry.confidencePercent}%).{' '}
                    <strong className="text-emerald-300">Hành động tiếp theo:</strong> Hãy tiếp tục ngồi chờ Tuyến 13 tại trạm hiện tại!
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    const target = route13Telemetry.delayMinutes >= 8 ? 'route_6' : 'route_13';
                    setSelectedTrackingRoute(target);
                    setActiveTab('track');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
                >
                  <span>{route13Telemetry.delayMinutes >= 8 ? 'Chuyển sang Tuyến 06 ngay' : 'Tiếp tục chờ Tuyến 13 (Đề xuất)'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab('compare')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  Xem bảng so sánh 3 phương án
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List of active anomalies */}
      <div className="space-y-3">
        {allAnomalies.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Hành trình đang diễn ra an toàn & ổn định</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Cả Tuyến 06 và Tuyến 13 đều hoạt động bình thường, không ghi nhận tình trạng trễ chuyến, dừng bất thường hay mất kết nối cảm biến.
            </p>
          </div>
        ) : (
          allAnomalies.map((anomaly) => {
            const style = getSeverityStyle(anomaly.severity);
            const Icon = style.icon;

            return (
              <div
                key={anomaly.id}
                className={`rounded-3xl border p-4 md:p-5 transition-all ${style.cardBg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 shrink-0 ${style.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg}`}>
                          {anomaly.severity === 'critical' ? 'Nghiêm trọng' : anomaly.severity === 'warning' ? 'Cảnh báo rủi ro' : 'Thông báo'}
                        </span>
                        <h4 className="text-sm font-bold text-white">{anomaly.title}</h4>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                        {anomaly.message}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                        <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                        <span>Đề xuất: <strong>{anomaly.suggestedAction}</strong></span>
                      </div>
                    </div>
                  </div>

                  {anomaly.actionType && (
                    <button
                      onClick={() => handleAction(anomaly)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors"
                    >
                      <span>Thực hiện</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

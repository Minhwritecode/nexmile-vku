import React from 'react';
import {
  Bus,
  AlertTriangle,
  Radio,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  CloudRain,
  Navigation as NavIcon,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { ToastNotification } from '../types';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, setSelectedTrackingRoute, setActiveTab } = useSimulation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => {
        const getStyles = () => {
          switch (toast.severity) {
            case 'danger':
              return {
                bg: 'bg-slate-900/95 border-rose-500/60 shadow-rose-950/40',
                icon: AlertTriangle,
                iconColor: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
                accent: 'bg-rose-500',
              };
            case 'warning':
              return {
                bg: 'bg-slate-900/95 border-amber-500/60 shadow-amber-950/40',
                icon: AlertTriangle,
                iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
                accent: 'bg-amber-500',
              };
            case 'success':
              return {
                bg: 'bg-slate-900/95 border-emerald-500/60 shadow-emerald-950/40',
                icon: CheckCircle2,
                iconColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
                accent: 'bg-emerald-500',
              };
            case 'info':
            default:
              return {
                bg: 'bg-slate-900/95 border-blue-500/60 shadow-blue-950/40',
                icon: Bus,
                iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
                accent: 'bg-blue-500',
              };
          }
        };

        const style = getStyles();
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto rounded-2xl border p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${style.bg}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${style.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    {toast.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {toast.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>

                {/* Optional Action Button */}
                {toast.actionLabel && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (toast.onAction) {
                          toast.onAction();
                        } else if (toast.routeId) {
                          setSelectedTrackingRoute(toast.routeId);
                          setActiveTab('track');
                        } else {
                          setActiveTab('alerts');
                        }
                        dismissToast(toast.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <span>{toast.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 -mr-1 -mt-1"
                title="Đóng thông báo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-full bg-slate-800 h-0.5 mt-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${style.accent} animate-[pulse_2s_infinite]`}
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

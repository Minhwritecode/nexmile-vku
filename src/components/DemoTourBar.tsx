import React from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, X, Sparkles, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const DemoTourBar: React.FC = () => {
  const {
    isDemoModeActive,
    setIsDemoModeActive,
    currentDemoStep,
    demoSteps,
    nextDemoStep,
    prevDemoStep,
  } = useSimulation();

  if (!isDemoModeActive) return null;

  const currentStepObj = demoSteps.find((s) => s.step === currentDemoStep) || demoSteps[0];
  const progressPercent = Math.round((currentDemoStep / demoSteps.length) * 100);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border-y border-emerald-500/40 px-4 py-3 shadow-xl relative animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step details */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
            {currentDemoStep}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Kịch bản Demo cuộc thi (Bước {currentDemoStep}/{demoSteps.length})
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.2 rounded-full font-mono">
                {progressPercent}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">{currentStepObj.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{currentStepObj.description}</p>
          </div>
        </div>

        {/* Step action & Navigation buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {currentStepObj.actionButtonLabel && (
            <button
              onClick={() => {
                if (currentStepObj.actionFn) currentStepObj.actionFn();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-900/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentStepObj.actionButtonLabel}</span>
            </button>
          )}

          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              disabled={currentDemoStep === 1}
              onClick={prevDemoStep}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs transition-colors"
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={currentDemoStep === demoSteps.length}
              onClick={nextDemoStep}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Bước tiếp theo"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDemoModeActive(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Tắt chế độ Demo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

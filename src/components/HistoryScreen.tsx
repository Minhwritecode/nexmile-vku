import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Bus,
  Bike,
  Sparkles,
  Leaf,
  Filter,
  ArrowRight,
  PlusCircle,
  Calendar,
  MapPin,
  Check,
  X,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { TripHistoryItem } from '../types';

export const HistoryScreen: React.FC = () => {
  const { tripHistory, addCurrentTripToHistory, setActiveTab, recommendation, desiredArrivalTime } =
    useSimulation();

  const [filterMode, setFilterMode] = useState<'all' | 'bus' | 'ontime' | 'delayed'>('all');
  const [selectedTrip, setSelectedTrip] = useState<TripHistoryItem | null>(null);

  // Filtered trips
  const filteredTrips = tripHistory.filter((t) => {
    if (filterMode === 'bus') return t.chosenMode !== 'motorbike';
    if (filterMode === 'ontime') return t.isOnTime;
    if (filterMode === 'delayed') return !t.isOnTime;
    return true;
  });

  // Aggregated KPIs
  const totalTrips = tripHistory.length;
  const onTimeCount = tripHistory.filter((t) => t.isOnTime).length;
  const onTimeRate = Math.round((onTimeCount / totalTrips) * 100);
  const busTripsCount = tripHistory.filter((t) => t.chosenMode !== 'motorbike').length;
  const busAdoptionRate = Math.round((busTripsCount / totalTrips) * 100);
  const totalCostSaved = tripHistory.reduce((acc, t) => acc + t.costSavedVnd, 0);
  const totalCo2Saved = Number(
    tripHistory.reduce((acc, t) => acc + t.co2SavedKg, 0).toFixed(1)
  );
  const avgAccuracy = Math.round(
    tripHistory.reduce((acc, t) => acc + t.aiPredictionAccuracyPercent, 0) / totalTrips
  );

  // Recharts Chart Data (comparing Predicted vs Actual total minutes)
  const chartData = tripHistory.map((t, index) => ({
    name: t.date.split(',')[0] || `Chuyến ${index + 1}`,
    route: t.chosenMode === 'route_13' ? 'T13' : t.chosenMode === 'route_6' ? 'T06' : 'Xe máy',
    predicted: t.predictedTotalMinutes,
    actual: t.actualTotalMinutes,
    diff: t.actualTotalMinutes - t.predictedTotalMinutes,
    accuracy: t.aiPredictionAccuracyPercent,
    isOnTime: t.isOnTime,
  }));

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{label} ({data.route})</span>
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                data.isOnTime
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {data.isOnTime ? 'Đúng giờ' : 'Bị trễ'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Dự đoán AI:</span>
            <strong className="text-cyan-300 font-mono">{data.predicted} phút</strong>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Thực tế đến VKU:</span>
            <strong className="text-emerald-400 font-mono">{data.actual} phút</strong>
          </div>

          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800 text-slate-400">
            <span>Chênh lệch:</span>
            <span className={data.diff <= 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {data.diff > 0 ? `+${data.diff} phút` : `${data.diff} phút`}
            </span>
          </div>

          <div className="text-[10px] text-teal-300 font-medium">
            Độ chính xác thuật toán: {data.accuracy}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Prototype Badge and Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950/60 border border-slate-700/80 p-6 md:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <History className="w-3.5 h-3.5" />
                <span>Nhật Ký Hành Trình Sinh Viên VKU</span>
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                Dữ liệu mô phỏng cho prototype
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              Thống Kê Thói Quen & Hiệu Quả Đón Xe Buýt
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Theo dõi đối chứng thời gian đến trường thực tế so với dự đoán của AI, định lượng khoản chi phí tiết kiệm được và mức độ giảm phát thải các-bon của sinh viên VKU.
            </p>
          </div>

          {/* Quick Record Current Commute Button */}
          <div className="shrink-0">
            <button
              onClick={addCurrentTripToHistory}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ghi nhận chuyến đi hiện tại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide 14: 4 Success Metrics (WAIT - CHOICE - ARRIVAL - TRUST) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Bộ chỉ số thành công thử nghiệm (Slide 14)
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
              Pilot Success Metrics
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline italic">
            "Không vội tuyên bố thành công trước khi đo lường thực tế"
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pillar 1: WAIT */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>1. WAIT (Chờ xe)</span>
              </span>
              <span className="text-[10px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                -58% lãng phí
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono">7.2 <span className="text-xs text-slate-400 font-sans font-normal">phút/chuyến</span></div>
            <p className="text-[11px] text-slate-400">
              Thời gian chờ trung bình giảm từ 18 phút xuống 7 phút nhờ đề xuất giờ bước ra trạm.
            </p>
          </div>

          {/* Pillar 2: CHOICE */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>2. CHOICE (Lựa chọn)</span>
              </span>
              <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
                Tự tin 1 chạm
              </span>
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono">94% <span className="text-xs text-slate-400 font-sans font-normal">quyết định dứt khoát</span></div>
            <p className="text-[11px] text-slate-400">
              Sinh viên ra quyết định ngay không cần phải mở chéo nhiều ứng dụng hay hỏi han.
            </p>
          </div>

          {/* Pillar 3: ARRIVAL */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>3. ARRIVAL (Đúng giờ)</span>
              </span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {onTimeCount}/{totalTrips} chuyến
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{onTimeRate}% <span className="text-xs text-emerald-400 font-sans font-normal">đúng giờ học</span></div>
            <p className="text-[11px] text-slate-400">
              Không còn báo cáo trễ tiết học VKU hoặc điểm danh muộn do xe buýt bất định.
            </p>
          </div>

          {/* Pillar 4: TRUST */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-teal-300">
                <Award className="w-4 h-4 text-teal-400" />
                <span>4. TRUST (Hành động)</span>
              </span>
              <span className="text-[10px] bg-teal-500/15 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold">
                Hành động tin cậy
              </span>
            </div>
            <div className="text-2xl font-black text-teal-300 font-mono">91% <span className="text-xs text-slate-400 font-sans font-normal">làm theo AI</span></div>
            <p className="text-[11px] text-slate-400">
              Sinh viên kiên nhẫn chờ tiếp hoặc đổi tuyến khi AI đưa ra khuyến nghị rõ ràng.
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart: Dự đoán vs Thực tế */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white">
                Biểu Đồ Đối Chứng: Thời Gian Dự Đoán vs Thực Tế Đến VKU
              </h3>
              <p className="text-xs text-slate-400">
                Thống kê từng chuyến đi gần đây (đơn vị: phút di chuyển trọn gói)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Trạng thái:</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold text-[11px]">
              Độ lệch trung bình &lt; 2 phút
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                unit=" ph"
                domain={[0, 60]}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => (
                  <span className="text-xs font-semibold text-slate-200">
                    {val === 'predicted' ? 'Dự đoán AI (ETA)' : 'Thực tế đến trường VKU'}
                  </span>
                )}
              />
              <ReferenceLine
                y={45}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: 'Ngưỡng 45 phút',
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'right',
                }}
              />
              <Bar
                dataKey="predicted"
                name="predicted"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="actual"
                name="actual"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-400">Đánh giá độ tin cậy từ lịch sử: </strong>
            Đối với các chuyến xe buýt (Tuyến 13 & Tuyến 06), mô hình AI đạt độ chính xác trên <strong>94%</strong>, thời gian chờ thực tế chỉ lệch 1–2 phút so với dự đoán ban đầu. Trường hợp đi xe máy ngày 21/09 bị trễ 8 phút do bãi xe cổng VKU quá tải đã chứng minh tính ưu việt của đề xuất ưu tiên xe buýt vào ngày mưa.
          </div>
        </div>
      </div>

      {/* Filter and Trip History List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Danh Sách Hành Trình Đã Thực Hiện ({filteredTrips.length})</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterMode('bus')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterMode === 'bus'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Xe Buýt VKU
            </button>
            <button
              onClick={() => setFilterMode('ontime')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterMode === 'ontime'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đúng giờ
            </button>
            <button
              onClick={() => setFilterMode('delayed')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterMode === 'delayed'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bị trễ
            </button>
          </div>
        </div>

        {/* Trips Cards Grid */}
        <div className="space-y-3">
          {filteredTrips.map((trip) => {
            const isBus = trip.chosenMode !== 'motorbike';
            const diff = trip.actualTotalMinutes - trip.predictedTotalMinutes;

            return (
              <div
                key={trip.id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-3xl p-5 shadow-lg transition-all space-y-3"
              >
                {/* Trip Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        trip.chosenMode === 'route_13'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : trip.chosenMode === 'route_6'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {trip.chosenMode === 'motorbike' ? (
                        <Bike className="w-5 h-5" />
                      ) : (
                        <Bus className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{trip.modeLabel}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            trip.isOnTime
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          {trip.isOnTime ? 'Đúng giờ vào lớp ✓' : 'Trễ giờ vào lớp ⚠️'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{trip.date} lúc {trip.time}</span>
                        <span>•</span>
                        <span>Thời tiết: {trip.weatherCondition === 'sunny' ? 'Nắng' : trip.weatherCondition === 'cloudy' ? 'Nhiều mây' : trip.weatherCondition === 'rain' ? 'Mưa rào' : 'Mưa to'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accuracy Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Độ chính xác AI</span>
                      <span className="text-sm font-black font-mono text-cyan-300">
                        {trip.aiPredictionAccuracyPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Origin -> Destination Route Path */}
                <div className="text-xs text-slate-300 flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{trip.origin}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-semibold text-white truncate">{trip.destination}</span>
                </div>

                {/* Side-by-Side Comparison: Predicted vs Actual */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Thời gian AI dự đoán</span>
                    <span className="text-base font-bold font-mono text-cyan-300">
                      {trip.predictedTotalMinutes} phút
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (Chờ {trip.predictedWaitMinutes} ph)
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Thời gian thực tế</span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {trip.actualTotalMinutes} phút
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      (Chờ {trip.actualWaitMinutes} ph)
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Đến VKU vs Mục tiêu</span>
                    <span className="text-base font-bold font-mono text-white">
                      {trip.actualArrival}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Mục tiêu: {trip.targetClassTime}
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Chi phí & Tiết kiệm</span>
                    <span className="text-base font-bold font-mono text-amber-300">
                      {trip.costVnd.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {trip.costSavedVnd > 0
                        ? `Tiết kiệm +${trip.costSavedVnd.toLocaleString('vi-VN')}đ`
                        : 'Không tiết kiệm'}
                    </span>
                  </div>
                </div>

                {/* Student Note & Experience */}
                <div className="pt-1 text-[11px] text-slate-300 italic bg-slate-800/30 px-3 py-2 rounded-xl border border-slate-800">
                  💬 <strong className="text-slate-200">Ghi chú sinh viên:</strong> {trip.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
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
import { Clock, TrendingUp, Bus, AlertCircle, Sparkles, Filter, Info } from 'lucide-react';
import { HOURLY_WAIT_TIME_24H, HourlyWaitTimeData } from '../data/mockHourlyWait';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItem: HourlyWaitTimeData | undefined = payload[0]?.payload;
    const r6 = payload.find((p) => p.dataKey === 'route6Wait')?.value;
    const r13 = payload.find((p) => p.dataKey === 'route13Wait')?.value;

    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[210px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-white font-mono flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mốc: {label}</span>
          </span>
          {dataItem?.isPeakHour && (
            <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
              Cao điểm
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-blue-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Tuyến 06 (BX TT - VKU):</span>
            </span>
            <span className="font-bold font-mono text-white">{r6} phút</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Tuyến 13 (BV Ung Bướu - VKU):</span>
            </span>
            <span className="font-bold font-mono text-emerald-400">{r13} phút</span>
          </div>
        </div>

        {dataItem && (
          <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span>Độ đúng giờ:</span>
              <span>
                T06: <strong className="text-blue-300">{dataItem.route6Punctuality}%</strong> | T13:{' '}
                <strong className="text-emerald-300">{dataItem.route13Punctuality}%</strong>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight italic">
              {dataItem.trafficNote}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const BusWaitingTimeChart: React.FC = () => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'peak'>('all');

  const filteredData = filterPeriod === 'peak'
    ? HOURLY_WAIT_TIME_24H.filter((d) => d.isPeakHour)
    : HOURLY_WAIT_TIME_24H;

  // Calculate averages
  const avgWaitR6 = Math.round(
    filteredData.reduce((acc, cur) => acc + cur.route6Wait, 0) / filteredData.length
  );
  const avgWaitR13 = Math.round(
    filteredData.reduce((acc, cur) => acc + cur.route13Wait, 0) / filteredData.length
  );
  const diffPercent = Math.round(((avgWaitR6 - avgWaitR13) / avgWaitR6) * 100);

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
      {/* Chart Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Biểu đồ So Sánh Thời Gian Chờ Dự Kiến (24 Giờ Qua)
              </h3>
              <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                Recharts AI Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Phân tích xu hướng thời gian chờ trung bình giữa Tuyến 06 & Tuyến 13 tại trạm Ngũ Hành Sơn hướng về VKU
            </p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          {/* Peak filter toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterPeriod === 'all'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24 Giờ
            </button>
            <button
              onClick={() => setFilterPeriod('peak')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterPeriod === 'peak'
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Giờ Cao Điểm VKU
            </button>
          </div>

          {/* Chart format toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đường miền
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cột so sánh
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Tuyến 06 (Chờ TB)</span>
          </div>
          <div className="text-xl font-black font-mono text-white">
            ~{avgWaitR6} <span className="text-xs font-normal text-slate-400">phút</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Biến động: ±4.8 phút</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Tuyến 13 (Chờ TB)</span>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400">
            ~{avgWaitR13} <span className="text-xs font-normal text-slate-400">phút</span>
          </div>
          <div className="text-[10px] text-emerald-400/90 mt-0.5 font-semibold">Ổn định hơn ±2.1 phút</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
          <div className="text-xs text-slate-400 font-medium mb-1">Thời gian chờ tiết kiệm</div>
          <div className="text-xl font-black font-mono text-teal-300">
            {diffPercent}% <span className="text-xs font-normal text-slate-400">ít chờ hơn</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Khi sinh viên chọn Tuyến 13</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
          <div className="text-xs text-amber-400 font-medium mb-1">Đỉnh cao điểm 7:00 sáng</div>
          <div className="text-xl font-black font-mono text-amber-300">
            18 ph <span className="text-xs font-normal text-slate-400">(T06)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tuyến 13 chỉ chờ 9 ph</div>
        </div>
      </div>

      {/* Main Recharts Area Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={filteredData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRoute6" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRoute13" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="hour"
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
                domain={[0, 25]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => (
                  <span className="text-xs font-semibold text-slate-200">
                    {val === 'route6Wait' ? 'Tuyến 06 (BX TT - VKU)' : 'Tuyến 13 (BV Ung Bướu - VKU)'}
                  </span>
                )}
              />
              {/* Reference line for 7:00 morning rush hour at VKU */}
              <ReferenceLine
                x="07:00"
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: '7:00 Vào Lớp VKU',
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'top',
                }}
              />
              <Area
                type="monotone"
                dataKey="route6Wait"
                name="route6Wait"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRoute6)"
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="route13Wait"
                name="route13Wait"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRoute13)"
                activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={filteredData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="hour"
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
                domain={[0, 25]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => (
                  <span className="text-xs font-semibold text-slate-200">
                    {val === 'route6Wait' ? 'Tuyến 06 (BX TT - VKU)' : 'Tuyến 13 (BV Ung Bướu - VKU)'}
                  </span>
                )}
              />
              <Bar dataKey="route6Wait" name="route6Wait" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="route13Wait" name="route13Wait" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* AI Chart Insight Note */}
      <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/60 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 font-semibold">Kết luận của Lớp AI 2 từ biểu đồ 24h: </strong>
          Đường biểu diễn thời gian chờ của <strong className="text-emerald-300">Tuyến 13</strong> duy trì độ võng thấp và phẳng (trung bình 8–10 phút), đặc biệt không bị vọt đỉnh như Tuyến 06 vào khung giờ <strong>07:00 (lên đến 18 phút)</strong> và <strong>17:00 (22 phút)</strong>. Đây là căn cứ định lượng xác đáng nhất để AI ưu tiên đề xuất Tuyến 13 cho sinh viên VKU.
        </div>
      </div>
    </div>
  );
};

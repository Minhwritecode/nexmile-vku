import React from 'react';
import {
  BrainCircuit,
  Cpu,
  Activity,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Navigation,
  Radio,
  Clock,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { BusWaitingTimeChart } from './BusWaitingTimeChart';

export const AIDetailsScreen: React.FC = () => {
  const {
    recommendation,
    route6Telemetry,
    route13Telemetry,
    traffic,
    weather,
    vkuWeather,
    sensors,
    desiredArrivalTime,
    priority,
  } = useSimulation();

  const r13Sensor = sensors['SN-13-06'];
  const r6Sensor = sensors['SN-06-06'];

  const trafficScore = {
    clear: 95,
    normal: 82,
    dense: 60,
    jammed: 35,
  }[traffic];

  const weatherScore = {
    sunny: 95,
    cloudy: 90,
    rain: 65,
    heavy_rain: 45,
  }[weather];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header explanation banner */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Kiến trúc AI 2 Lớp của NexMile</h2>
                <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  Dữ liệu mô phỏng cho prototype
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Minh bạch hóa các thuật toán tính toán, trọng số quyết định và cơ chế dự báo ETA cho sinh viên VKU.
              </p>
            </div>
          </div>
        </div>

        {/* 2 AI Layers Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {/* Layer 1 Box */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center border border-emerald-500/30">
                L1
              </span>
              <h3 className="text-sm font-bold text-emerald-300">Lớp 1: Lựa chọn phương án di chuyển</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tổng hợp đa tiêu chí: so sánh Tuyến 6, Tuyến 13 và Xe máy cá nhân dựa trên chi phí, thời gian đi bộ, thời tiết và đặc thù bãi giữ xe VKU để đề xuất thời điểm rời nhà tối ưu.
            </p>
          </div>

          {/* Layer 2 Box */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 text-xs font-mono font-bold flex items-center justify-center border border-teal-500/30">
                L2
              </span>
              <h3 className="text-sm font-bold text-teal-300">Lớp 2: Dự đoán thời gian chờ xe buýt</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dự báo ETA dạng khoảng (8–12 phút), tính toán độ tin cậy từ GPS + cảm biến trạm thực tế, đồng thời phát hiện sớm các dị thường (dừng quá lâu, trễ giờ, xe đã qua trạm).
            </p>
          </div>
        </div>
      </div>

      {/* Factors Analyzed Breakdown */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Các yếu tố AI đã phân tích theo thời gian thực</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Trọng số động</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Factor 1: ETA & Distance */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Khoảng thời gian ETA hiện tại</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {route13Telemetry.estimatedArrivalMinMinutes}–{route13Telemetry.estimatedArrivalMaxMinutes} phút
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Khoảng cách còn lại: ~4.2 km • {route13Telemetry.currentStopIndex} trạm trung gian. AI cộng thêm thời gian dừng đỗ đón/trả khách ~0.9 phút/trạm.
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Factor 2: Historical Variance */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Lịch sử thời gian đến (Độ ổn định)</span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400">Độ lệch chuẩn ±2.1 phút</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dựa trên lịch sử 30 ngày các chuyến 7h00–7h30 sáng tại trạm Ngũ Hành Sơn, Tuyến 13 có tính ổn định cao hơn Tuyến 6 (±4.8 phút).
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Factor 3: Traffic Congestion */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Mức độ thông thoáng giao thông</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                {traffic === 'clear' ? 'Rất thông thoáng' : traffic === 'normal' ? 'Bình thường' : traffic === 'dense' ? 'Đông đúc' : 'Kẹt xe nặng'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ảnh hưởng trực tiếp đến tốc độ di chuyển trên trục đường Lê Văn Hiến - Trần Đại Nghĩa tiếp cận cổng trường VKU.
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${trafficScore}%` }}></div>
            </div>
          </div>

          {/* Factor 4: Weather Impact at VKU Campus */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                {weather === 'sunny' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : weather === 'cloudy' ? (
                  <Cloud className="w-4 h-4 text-slate-300" />
                ) : weather === 'rain' ? (
                  <CloudRain className="w-4 h-4 text-blue-400" />
                ) : (
                  <CloudLightning className="w-4 h-4 text-cyan-400 animate-bounce" />
                )}
                <span>Khí tượng khuôn viên VKU</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {vkuWeather.temperatureC}°C • {vkuWeather.conditionLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {vkuWeather.aiCommuteAdvice}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Mưa: <strong className="text-cyan-300 font-mono">{vkuWeather.rainProbabilityPercent}%</strong> • Gió: {vkuWeather.windSpeedKmh}km/h</span>
              <span className="text-emerald-400 font-bold font-mono">
                {vkuWeather.aiModeWeightImpact.busBonusPercent >= 20 ? `+${vkuWeather.aiModeWeightImpact.busBonusPercent}% Ưu tiên Bus` : 'Trọng số chuẩn'}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${weatherScore}%` }}></div>
            </div>
          </div>

          {/* Factor 5: Sensor Health & Verification */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Radio className="w-4 h-4 text-teal-400" />
                <span>Tình trạng cảm biến trạm ({r13Sensor?.sensorId})</span>
              </div>
              <span className="text-xs font-mono font-bold text-teal-300">
                {r13Sensor?.status === 'scanned' ? 'Đã quét (Xác thực 100%)' : r13Sensor?.status === 'unstable' ? 'Tín hiệu yếu (-92 dBm)' : 'Sẵn sàng'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cảm biến xác thực vật lý giúp triệt tiêu hiện tượng GPS giả lập hoặc sai lệch vệ tinh khi qua các tòa nhà cao tầng.
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-400 h-full rounded-full"
                style={{ width: r13Sensor?.status === 'scanned' ? '98%' : r13Sensor?.status === 'unstable' ? '30%' : '85%' }}
              ></div>
            </div>
          </div>

          {/* Factor 6: VKU Parking Hassle */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Rủi ro gửi xe tại cổng VKU</span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-300">Tiết kiệm 7 phút chờ</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Vào lúc 7h15–7h30, bãi xe sinh viên VKU thường xuyên ùn ứ xếp hàng nhận vé. Đi xe buýt giúp sinh viên bước thẳng vào giảng đường K hoặc V mà không mất thời gian gửi xe.
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 24-Hour Recharts Bus Waiting Time Comparison */}
      <BusWaitingTimeChart />

      {/* AI Confidence Formula Breakdown */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Công thức xác định độ tin cậy (Confidence Score Formula)</span>
        </h3>
        <div className="p-3 bg-slate-800/70 rounded-xl font-mono text-xs text-slate-300 border border-slate-700/80 leading-relaxed overflow-x-auto">
          <code>
            Confidence = Base(92%) - DelayPenalty - GpsStalenessPenalty - TrafficPenalty + SensorVerificationBonus
          </code>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Độ tin cậy phản ánh xác suất thực tế xe buýt đến trạm trong khoảng thời gian đã dự báo. Khi cảm biến trạm xác nhận quét thành công, độ tin cậy được cộng thêm 12%, mang lại sự an tâm tuyệt đối cho sinh viên trước giờ học.
        </p>
      </div>

      {/* Slide 4 & Slide 12: Existing Alternatives Comparison Matrix */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Đối chiếu giải pháp hiện hữu (Slide 04 & Slide 12)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
                Existing Alternatives
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              "Công cụ hiện có hiển thị dữ liệu. Sinh viên cần một quyết định."
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Chúng tôi không thay thế DanaBus. Chúng tôi bổ sung lớp quyết định cá nhân hóa dựa trên dữ liệu giao thông.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-800/40">
                <th className="py-3 px-3 rounded-l-xl">Phương án</th>
                <th className="py-3 px-3">Thông tin cung cấp</th>
                <th className="py-3 px-3">Khoảng trống còn lại</th>
                <th className="py-3 px-3 rounded-r-xl text-emerald-400 font-bold">NexMile bổ sung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-normal">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>DanaBus</span>
                </td>
                <td className="py-3 px-3 text-slate-300">Lộ trình và vị trí xe thời gian thực</td>
                <td className="py-3 px-3 text-slate-400">Người dùng vẫn phải tự suy diễn xem nên chờ hay đổi tuyến</td>
                <td className="py-3 px-3 text-emerald-300 font-medium">Hành động dứt khoát: Tiếp tục chờ, đổi tuyến hoặc dùng backup</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  <span>Lịch trình tĩnh</span>
                </td>
                <td className="py-3 px-3 text-slate-300">Khung giờ xuất bến theo kế hoạch</td>
                <td className="py-3 px-3 text-slate-400">Không thể giải thích kẹt xe, đèn đỏ hay xe bị trễ</td>
                <td className="py-3 px-3 text-emerald-300 font-medium">Dự báo ETA động theo khoảng (8–12 ph) kèm độ tin cậy</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span>Xe máy cá nhân</span>
                </td>
                <td className="py-3 px-3 text-slate-300">Tính linh hoạt cao khi sẵn có phương tiện</td>
                <td className="py-3 px-3 text-slate-400">Chi phí xăng xe, thời tiết nắng mưa, 7–10 phút xếp hàng gửi xe bãi VKU</td>
                <td className="py-3 px-3 text-emerald-300 font-medium">So sánh đa chiều: Chỉ khuyên đi xe máy khi xe buýt thực sự rủi ro</td>
              </tr>
              <tr className="bg-emerald-950/20 border-t-2 border-emerald-500/40">
                <td className="py-3 px-3 font-bold text-emerald-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span>NexMile (Dự án)</span>
                </td>
                <td className="py-3 px-3 text-emerald-200 font-semibold">Dự báo khoảng ETA + Độ tin cậy + Đề xuất hành động</td>
                <td className="py-3 px-3 text-emerald-300">Giải quyết trọn vẹn sự bất định trước khi rời nhà & tại trạm</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">Lớp ra quyết định cá nhân hóa cho sinh viên VKU</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide 6 & 13: End-to-End AI Architecture */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Kiến trúc thuật toán (Slide 06 & Slide 13)
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
              AI Decision Flow
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            Mô hình biến các tín hiệu giao thông thành quyết định cá nhân
          </h3>
          <p className="text-xs text-slate-400">
            Dữ liệu mô phỏng trong prototype và giữ nguyên toàn bộ logic khi tích hợp dữ liệu vận hành thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Box 1: Inputs */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>1. Tín hiệu đầu vào (Inputs)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>GPS viễn thám từng xe buýt</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>Sự kiện cảm biến trạm dừng IoT</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>Lịch sử thời gian đến (Route history)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>Tình trạng giao thông & thời tiết trạm VKU</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>Hạn chót có mặt tại trường (Deadline)</span>
              </li>
            </ul>
          </div>

          {/* Box 2: AI Core */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>2. Lõi xử lý AI (Predict · Compare · Detect)</span>
            </div>
            <ul className="text-xs text-slate-200 space-y-1.5 pt-1">
              <li className="flex items-start gap-2">
                <strong className="text-cyan-300 shrink-0">Dự đoán ETA:</strong>
                <span>Tuyến nào đến trước và sau bao lâu?</span>
              </li>
              <li className="flex items-start gap-2">
                <strong className="text-cyan-300 shrink-0">So sánh:</strong>
                <span>Đối chiếu Tuyến 6, Tuyến 13 và Xe máy cá nhân</span>
              </li>
              <li className="flex items-start gap-2">
                <strong className="text-cyan-300 shrink-0">Phát hiện dị thường:</strong>
                <span>Nhận biết GPS cũ, xe đứng yên, xe đã qua trạm</span>
              </li>
            </ul>
          </div>

          {/* Box 3: Decision Output */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>3. Kết quả & Hành động (Decision)</span>
            </div>
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tuyến đề xuất</span>
                <span className="text-sm font-bold text-white">Tuyến 13 · 8–12 phút</span>
                <span className="text-[11px] text-emerald-400 block font-mono font-bold">Độ tin cậy 84%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hành động tiếp theo</span>
                <span className="text-sm font-bold text-amber-300">Tiếp tục ngồi chờ tại trạm</span>
                <span className="text-[10px] text-slate-400 block">Cửa sổ thời gian ổn định, không lo trễ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 9: Feasibility & Sensor Role */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Tính khả thi & Lộ trình triển khai (Slide 09 & Slide 15)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
                PILOTABLE
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              "Bắt đầu với hai tuyến, chứng minh niềm tin, sau đó nhân rộng"
            </h3>
          </div>
        </div>

        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-400">Sensor = Lớp xác thực dữ liệu viễn thám, không phải là sự phụ thuộc toàn thành phố:</strong> Trong phiên bản thi và thử nghiệm (Pilot), chúng tôi chỉ gắn cảm biến tại 3–5 trạm có lưu lượng sinh viên VKU cao nhất (như trạm Hồ Xuân Hương, Lê Văn Hiến, cổng trường VKU). GPS xe buýt vẫn là nguồn dữ liệu phủ rộng, cảm biến đóng vai trò "chốt kiểm chứng" triệt tiêu sai số.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <span className="text-xs font-bold text-white block">01. Prototype (Hiện tại)</span>
            <span className="text-[11px] text-slate-400">Dữ liệu mô phỏng GPS, cảm biến và lịch trình tuyến buýt cho sinh viên VKU.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <span className="text-xs font-bold text-emerald-300 block">02. Thử nghiệm Pilot</span>
            <span className="text-[11px] text-slate-400">Tuyến 6 và Tuyến 13 với 3–5 trạm xung quanh giảng đường VKU.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <span className="text-xs font-bold text-cyan-300 block">03. Hợp tác nhân rộng</span>
            <span className="text-[11px] text-slate-400">Kết nối trực tiếp dữ liệu từ đơn vị vận hành và hoàn thiện mô hình ETA thực tế.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

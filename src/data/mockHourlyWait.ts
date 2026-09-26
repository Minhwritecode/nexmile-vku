export interface HourlyWaitTimeData {
  hour: string; // e.g., '05:00', '06:00', '07:00'
  label: string; // e.g., '07:00 (Cao điểm sáng)'
  route6Wait: number; // minutes
  route13Wait: number; // minutes
  route6Punctuality: number; // percent (0-100)
  route13Punctuality: number; // percent (0-100)
  trafficNote: string;
  isPeakHour?: boolean;
}

export const HOURLY_WAIT_TIME_24H: HourlyWaitTimeData[] = [
  { hour: '05:00', label: '05:00', route6Wait: 15, route13Wait: 14, route6Punctuality: 96, route13Punctuality: 98, trafficNote: 'Đầu ngày, vắng xe' },
  { hour: '06:00', label: '06:00', route6Wait: 12, route13Wait: 10, route6Punctuality: 94, route13Punctuality: 95, trafficNote: 'Bắt đầu đông nhẹ' },
  { hour: '07:00', label: '07:00 (VKU Vào Lớp)', route6Wait: 18, route13Wait: 9, route6Punctuality: 62, route13Punctuality: 86, trafficNote: 'Cao điểm sinh viên đến trường, Cầu Rồng ùn ứ', isPeakHour: true },
  { hour: '08:00', label: '08:00', route6Wait: 14, route13Wait: 8, route6Punctuality: 74, route13Punctuality: 90, trafficNote: 'Giao thông giảm nhiệt dần', isPeakHour: true },
  { hour: '09:00', label: '09:00 (Ca 2)', route6Wait: 11, route13Wait: 7, route6Punctuality: 88, route13Punctuality: 92, trafficNote: 'Lưu thông ổn định' },
  { hour: '10:00', label: '10:00', route6Wait: 10, route13Wait: 8, route6Punctuality: 90, route13Punctuality: 94, trafficNote: 'Thông thoáng' },
  { hour: '11:00', label: '11:00 (Tan Ca Sáng)', route6Wait: 16, route13Wait: 11, route6Punctuality: 68, route13Punctuality: 84, trafficNote: 'Sinh viên VKU tan ca sáng, lượng khách tăng', isPeakHour: true },
  { hour: '12:00', label: '12:00', route6Wait: 12, route13Wait: 9, route6Punctuality: 82, route13Punctuality: 89, trafficNote: 'Trưa nắng, đường thoáng' },
  { hour: '13:00', label: '13:00 (Ca Chiều)', route6Wait: 14, route13Wait: 8, route6Punctuality: 76, route13Punctuality: 91, trafficNote: 'Sinh viên vào ca thực hành chiều' },
  { hour: '14:00', label: '14:00', route6Wait: 11, route13Wait: 8, route6Punctuality: 86, route13Punctuality: 93, trafficNote: 'Lưu thông bình thường' },
  { hour: '15:00', label: '15:00', route6Wait: 12, route13Wait: 9, route6Punctuality: 85, route13Punctuality: 92, trafficNote: 'Tốc độ đều' },
  { hour: '16:00', label: '16:00', route6Wait: 15, route13Wait: 10, route6Punctuality: 78, route13Punctuality: 88, trafficNote: 'Học sinh, sinh viên bắt đầu tan học' },
  { hour: '17:00', label: '17:00 (Tan Tầm)', route6Wait: 22, route13Wait: 13, route6Punctuality: 55, route13Punctuality: 81, trafficNote: 'Cao điểm tan tầm, trục Ngũ Hành Sơn kẹt nhẹ', isPeakHour: true },
  { hour: '18:00', label: '18:00 (Tan Tầm)', route6Wait: 20, route13Wait: 12, route6Punctuality: 60, route13Punctuality: 83, trafficNote: 'Mật độ xe cao tại các nút đèn', isPeakHour: true },
  { hour: '19:00', label: '19:00', route6Wait: 14, route13Wait: 9, route6Punctuality: 82, route13Punctuality: 91, trafficNote: 'Giao thông thông thoáng trở lại' },
  { hour: '20:00', label: '20:00', route6Wait: 13, route13Wait: 10, route6Punctuality: 89, route13Punctuality: 94, trafficNote: 'Xe chạy êm ái' },
  { hour: '21:00', label: '21:00 (Chuyến Cuối)', route6Wait: 16, route13Wait: 14, route6Punctuality: 92, route13Punctuality: 95, trafficNote: 'Chuyến cuối trong ngày về KTX' },
];

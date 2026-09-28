import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  BusTelemetry,
  BusSensorData,
  PriorityMode,
  TrafficCondition,
  WeatherCondition,
  AIRecommendationResult,
  BusAnomaly,
  ToastNotification,
  VKUWeatherData,
  TripHistoryItem,
} from '../types';
import { ROUTE_6_STOPS, ROUTE_13_STOPS, INITIAL_SENSORS } from '../data/mockRoutes';
import { VKU_WEATHER_PRESETS } from '../data/mockWeather';
import { MOCK_TRIP_HISTORY } from '../data/mockHistory';
import { fetchRealtimeVkuWeather } from '../services/realtimeWeather';
import {
  DA_NANG_3_BUS_STATIONS,
  FUTA_VKU_ROUTES,
  getRealtimeFutaDepartures,
  FutaBusStation,
  FutaRouteDetails,
  RealtimeTripDeparture,
} from '../services/futaService';
import {
  predictBusArrival,
  detectBusAnomaly,
  calculateCommuteRecommendation,
} from '../utils/aiEngine';

interface DemoStep {
  step: number;
  title: string;
  description: string;
  expectedScreen: 'home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history';
  actionButtonLabel?: string;
  actionFn?: () => void;
}

interface SimulationContextType {
  // Navigation & User Inputs
  activeTab: 'home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history';
  setActiveTab: (tab: 'home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history') => void;
  originName: string;
  setOriginName: (val: string) => void;
  destinationName: string;
  desiredArrivalTime: string;
  setDesiredArrivalTime: (val: string) => void;
  priority: PriorityMode;
  setPriority: (val: PriorityMode) => void;
  selectedTrackingRoute: 'route_6' | 'route_13';
  setSelectedTrackingRoute: (val: 'route_6' | 'route_13') => void;

  // Trip History & Analytics
  tripHistory: TripHistoryItem[];
  addCurrentTripToHistory: () => void;

  // Toast Notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;

  // Telemetry & Sensors
  route6Telemetry: BusTelemetry;
  route13Telemetry: BusTelemetry;
  sensors: Record<string, BusSensorData>;
  traffic: TrafficCondition;
  setTraffic: (val: TrafficCondition) => void;
  weather: WeatherCondition;
  setWeather: (val: WeatherCondition) => void;
  vkuWeather: VKUWeatherData;
  changeWeather: (val: WeatherCondition) => void;
  isRealtimeWeatherActive: boolean;
  isWeatherLoading: boolean;
  syncRealtimeWeather: () => Promise<void>;

  // Official FUTA Bus Lines (Phương Trang) & 3 Da Nang Stations
  futaStations: FutaBusStation[];
  futaRoutes: Record<'route_13' | 'route_6', FutaRouteDetails>;
  getRealtimeFutaDepartures: (routeId: 'route_13' | 'route_6') => RealtimeTripDeparture[];

  // AI Computed Output
  recommendation: AIRecommendationResult;
  isAnalyzing: boolean;
  analyzeCommute: () => void;
  allAnomalies: BusAnomaly[];

  // Simulation Triggers
  simulateRoute6Delayed: (delayed?: boolean) => void;
  simulateRoute13Delayed: (delayed?: boolean) => void;
  simulateRoute13Approaching: () => void;
  simulateBusPassedStop: (passed?: boolean) => void;
  simulateGpsSignalLost: (lost?: boolean) => void;
  simulateSensorScanned: () => void;
  simulateSensorUnstable: (unstable?: boolean) => void;
  simulateHeavyRain: (rain?: boolean) => void;
  simulateTrafficCongested: (congested?: boolean) => void;
  simulateFounderIncident: () => void;
  simulateHonestAiMotorbike: () => void;
  resetSimulation: () => void;

  // Guided Demo Mode
  isDemoModeActive: boolean;
  setIsDemoModeActive: (val: boolean) => void;
  currentDemoStep: number;
  demoSteps: DemoStep[];
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  jumpToDemoStep: (step: number) => void;

  // One-handed Mobile Accessibility & Gestures
  isGesturesModalOpen: boolean;
  setIsGesturesModalOpen: (val: boolean) => void;
  handMode: 'right' | 'left';
  setHandMode: (val: 'right' | 'left') => void;
  toggleHandMode: () => void;
  goToNextTab: () => void;
  goToPrevTab: () => void;

  // 3D Three.js Splash Screen Animation
  showSplash: boolean;
  setShowSplash: (val: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history'>('home');
  const [selectedTrackingRoute, setSelectedTrackingRoute] = useState<'route_6' | 'route_13'>('route_13');

  // Trip History state
  const [tripHistory, setTripHistory] = useState<TripHistoryItem[]>(MOCK_TRIP_HISTORY);

  // Commute inputs
  const [originName, setOriginName] = useState('Khu vực Ngũ Hành Sơn - Hồ Xuân Hương');
  const destinationName = 'ĐH CNTT & TT Việt - Hàn (VKU)';
  const [desiredArrivalTime, setDesiredArrivalTime] = useState('07:30');
  const [priority, setPriority] = useState<PriorityMode>('min_wait');
  const [traffic, setTraffic] = useState<TrafficCondition>('normal');
  const [weather, setWeather] = useState<WeatherCondition>('sunny');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 3D Three.js Splash Animation State
  const [showSplash, setShowSplash] = useState(true);

  // Guided Demo State
  const [isDemoModeActive, setIsDemoModeActive] = useState(false);
  const [currentDemoStep, setCurrentDemoStep] = useState(1);

  // One-handed Mobile Accessibility & Gestures
  const [isGesturesModalOpen, setIsGesturesModalOpen] = useState(false);
  const [handMode, setHandMode] = useState<'right' | 'left'>('right');

  const TAB_ORDER: ('home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history')[] = [
    'home',
    'compare',
    'track',
    'alerts',
    'ai_details',
    'history',
  ];

  const TAB_NAMES: Record<'home' | 'compare' | 'track' | 'alerts' | 'ai_details' | 'history', string> = {
    home: 'Trang chủ',
    compare: 'So sánh lộ trình',
    track: 'Theo dõi trực tiếp xe buýt',
    alerts: 'Cảnh báo bất thường',
    ai_details: 'Chi tiết phân tích AI',
    history: 'Lịch sử di chuyển',
  };

  const addCurrentTripToHistory = () => {
    const isBus = recommendation.recommendedOptionId !== 'motorbike';
    const chosen = recommendation.recommendedOptionId;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTrip: TripHistoryItem = {
      id: `trip_${Date.now()}`,
      date: 'Hôm nay, ' + now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      time: timeStr,
      origin: originName,
      destination: destinationName,
      chosenMode: chosen,
      modeLabel:
        chosen === 'route_13'
          ? 'Tuyến 13 (BV Ung Bướu - VKU)'
          : chosen === 'route_6'
          ? 'Tuyến 06 (BX Trung Tâm - VKU)'
          : 'Xe máy cá nhân',
      predictedTotalMinutes: recommendation.comparisonOptions.find((o) => o.id === chosen)?.totalTimeMinutes || 38,
      actualTotalMinutes: (recommendation.comparisonOptions.find((o) => o.id === chosen)?.totalTimeMinutes || 38) - 1,
      predictedWaitMinutes: recommendation.comparisonOptions.find((o) => o.id === chosen)?.waitingTimeMinutesRange[0] || 8,
      actualWaitMinutes: Math.max(2, (recommendation.comparisonOptions.find((o) => o.id === chosen)?.waitingTimeMinutesRange[0] || 8) - 1),
      predictedArrival: recommendation.expectedArrivalTime,
      actualArrival: recommendation.expectedArrivalTime,
      targetClassTime: desiredArrivalTime,
      costVnd: isBus ? 8000 : 18000,
      costSavedVnd: isBus ? 10000 : 0,
      co2SavedKg: isBus ? 1.4 : 0,
      aiPredictionAccuracyPercent: 96,
      isOnTime: true,
      weatherCondition: weather,
      note: isBus
        ? 'Ghi nhận chuyến xe buýt thành công. Sinh viên đã đến giảng đường VKU đúng giờ.'
        : 'Chuyến xe máy cá nhân. Cần lưu ý gửi xe tại bãi giữ xe cổng trường.',
    };

    setTripHistory((prev) => [newTrip, ...prev]);
    addToast({
      type: 'general',
      title: 'Đã lưu vào Lịch sử di chuyển ✓',
      message: `Hành trình "${newTrip.modeLabel}" đã được ghi nhận vào bảng thống kê thói quen.`,
      severity: 'success',
      durationMs: 3500,
    });
    setActiveTab('history');
  };

  const goToNextTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    const nextTab = TAB_ORDER[nextIndex];
    setActiveTab(nextTab);
    // User requested: Tắt hẳn popup khi quẹt trái/phải, chỉ giữ lại thông báo việc quan trọng
  };

  const goToPrevTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const prevIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    const prevTab = TAB_ORDER[prevIndex];
    setActiveTab(prevTab);
    // User requested: Tắt hẳn popup khi quẹt trái/phải, chỉ giữ lại thông báo việc quan trọng
  };

  const toggleHandMode = () => {
    const nextMode = handMode === 'right' ? 'left' : 'right';
    setHandMode(nextMode);
  };

  // Toast Notifications State (Empty by default so user is not spammed on open)
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toastData: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newToast: ToastNotification = {
      ...toastData,
      id,
      timestamp,
      durationMs: toastData.durationMs || 5000,
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 visible toasts

    // Auto dismiss after duration
    if (newToast.durationMs && newToast.durationMs > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.durationMs);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  // Initial Sensors
  const [sensors, setSensors] = useState<Record<string, BusSensorData>>(INITIAL_SENSORS);

  // Route 6 Telemetry
  const [route6Telemetry, setRoute6Telemetry] = useState<BusTelemetry>({
    routeId: 'route_6',
    routeName: 'Tuyến 06',
    routeColor: '#2563eb', // blue-600
    currentStopIndex: 4, // Cầu Tiên Sơn
    progressToNextStop: 0.35,
    speedKmh: 23,
    delayMinutes: 0,
    isStalled: false,
    stalledMinutes: 0,
    gpsLastUpdatedSecondsAgo: 28,
    isGpsStale: false,
    hasPassedUserStop: false,
    estimatedArrivalMinMinutes: 14,
    estimatedArrivalMaxMinutes: 18,
    confidencePercent: 64,
    activeAnomalies: [],
  });

  // Route 13 Telemetry
  const [route13Telemetry, setRoute13Telemetry] = useState<BusTelemetry>({
    routeId: 'route_13',
    routeName: 'Tuyến 13',
    routeColor: '#059669', // emerald-600
    currentStopIndex: 4, // Cầu Trần Thị Lý
    progressToNextStop: 0.65,
    speedKmh: 28,
    delayMinutes: 0,
    isStalled: false,
    stalledMinutes: 0,
    gpsLastUpdatedSecondsAgo: 35,
    isGpsStale: false,
    hasPassedUserStop: false,
    estimatedArrivalMinMinutes: 8,
    estimatedArrivalMaxMinutes: 12,
    confidencePercent: 84,
    activeAnomalies: [],
  });

  // Re-predict ETA and anomalies whenever telemetry, traffic, or sensors change
  useEffect(() => {
    // Route 6 updates
    const r6Sensor = sensors['SN-06-06'];
    const r6Pred = predictBusArrival(route6Telemetry, ROUTE_6_STOPS, 'stop_6_6', traffic, r6Sensor);
    const r6Anom = detectBusAnomaly(
      route6Telemetry,
      r6Pred.minMinutes,
      r6Pred.hasPassed,
      route13Telemetry.estimatedArrivalMinMinutes,
      r6Sensor
    );

    setRoute6Telemetry((prev) => ({
      ...prev,
      estimatedArrivalMinMinutes: r6Pred.minMinutes,
      estimatedArrivalMaxMinutes: r6Pred.maxMinutes,
      confidencePercent: r6Pred.confidencePercent,
      hasPassedUserStop: r6Pred.hasPassed,
      activeAnomalies: r6Anom,
    }));

    // Route 13 updates
    const r13Sensor = sensors['SN-13-06'];
    const r13Pred = predictBusArrival(route13Telemetry, ROUTE_13_STOPS, 'stop_13_6', traffic, r13Sensor);
    const r13Anom = detectBusAnomaly(
      route13Telemetry,
      r13Pred.minMinutes,
      r13Pred.hasPassed,
      route6Telemetry.estimatedArrivalMinMinutes,
      r13Sensor
    );

    setRoute13Telemetry((prev) => ({
      ...prev,
      estimatedArrivalMinMinutes: r13Pred.minMinutes,
      estimatedArrivalMaxMinutes: r13Pred.maxMinutes,
      confidencePercent: r13Pred.confidencePercent,
      hasPassedUserStop: r13Pred.hasPassed,
      activeAnomalies: r13Anom,
    }));
  }, [
    route6Telemetry.currentStopIndex,
    route6Telemetry.progressToNextStop,
    route6Telemetry.delayMinutes,
    route6Telemetry.isStalled,
    route6Telemetry.isGpsStale,
    route13Telemetry.currentStopIndex,
    route13Telemetry.progressToNextStop,
    route13Telemetry.delayMinutes,
    route13Telemetry.isStalled,
    route13Telemetry.isGpsStale,
    traffic,
    weather,
    sensors,
  ]);

  // Periodic GPS pulse simulator (ticks every 5 seconds to advance seconds ago)
  useEffect(() => {
    const timer = setInterval(() => {
      setRoute6Telemetry((prev) => ({
        ...prev,
        gpsLastUpdatedSecondsAgo: prev.isGpsStale ? prev.gpsLastUpdatedSecondsAgo + 5 : (prev.gpsLastUpdatedSecondsAgo + 5) % 45,
      }));
      setRoute13Telemetry((prev) => ({
        ...prev,
        gpsLastUpdatedSecondsAgo: prev.isGpsStale ? prev.gpsLastUpdatedSecondsAgo + 5 : (prev.gpsLastUpdatedSecondsAgo + 5) % 45,
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute recommendation
  const recommendation = useMemo(() => {
    return calculateCommuteRecommendation(
      route6Telemetry,
      route13Telemetry,
      desiredArrivalTime,
      priority,
      traffic,
      weather,
      sensors['SN-06-06'],
      sensors['SN-13-06']
    );
  }, [route6Telemetry, route13Telemetry, desiredArrivalTime, priority, traffic, weather, sensors]);

  // Combined anomalies
  const allAnomalies = useMemo(() => {
    return [...route6Telemetry.activeAnomalies, ...route13Telemetry.activeAnomalies];
  }, [route6Telemetry.activeAnomalies, route13Telemetry.activeAnomalies]);

  // Trigger AI Analysis animation
  const analyzeCommute = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveTab('compare');
    }, 650);
  };

  // --- Simulation Triggers ---

  const simulateRoute6Delayed = (delayed: boolean = true) => {
    const willDelay = delayed ? (route6Telemetry.delayMinutes === 10 ? 0 : 10) : 0;
    setRoute6Telemetry((prev) => ({
      ...prev,
      delayMinutes: willDelay,
      confidencePercent: willDelay ? 52 : 64,
    }));

    if (willDelay > 0) {
      addToast({
        type: 'delay',
        title: 'Cảnh báo: Tuyến 06 bị trễ 10 phút',
        message: 'Ùn ứ phương tiện tại nút giao Ngã Ba Huế. AI khuyến nghị ưu tiên đón Tuyến 13.',
        severity: 'warning',
        routeId: 'route_6',
        actionLabel: 'Xem tuyến thay thế',
      });
    } else {
      addToast({
        type: 'general',
        title: 'Tuyến 06 trở lại bình thường',
        message: 'Lưu thông thông suốt, độ tin cậy hồi phục 64%.',
        severity: 'info',
        routeId: 'route_6',
      });
    }
  };

  const simulateRoute13Delayed = (delayed: boolean = true) => {
    const willDelay = delayed ? (route13Telemetry.delayMinutes === 12 ? 0 : 12) : 0;
    setRoute13Telemetry((prev) => {
      return {
        ...prev,
        delayMinutes: willDelay,
        estimatedArrivalMinMinutes: willDelay ? 20 : 8,
        estimatedArrivalMaxMinutes: willDelay ? 26 : 12,
        confidencePercent: willDelay ? 54 : 84,
      };
    });

    if (willDelay > 0) {
      addToast({
        type: 'delay',
        title: 'Cảnh báo: Tuyến 13 bị trễ khoảng 12 phút',
        message: 'Tuyến 13 bị ùn ứ trên đường Lê Văn Hiến. AI đề xuất chuyển sang Tuyến 06 để kịp giờ vào lớp.',
        severity: 'danger',
        routeId: 'route_6',
        actionLabel: 'Chuyển sang Tuyến 06',
        onAction: () => {
          setSelectedTrackingRoute('route_6');
          setActiveTab('track');
        },
      });
    } else {
      addToast({
        type: 'general',
        title: 'Tuyến 13 khôi phục đúng giờ',
        message: 'Thời gian chờ trở về 8–12 phút, độ tin cậy đạt 84%.',
        severity: 'success',
        routeId: 'route_13',
      });
    }
  };

  const simulateRoute13Approaching = () => {
    setRoute13Telemetry((prev) => ({
      ...prev,
      currentStopIndex: 5,
      progressToNextStop: 0.9,
      delayMinutes: 0,
      estimatedArrivalMinMinutes: 2,
      estimatedArrivalMaxMinutes: 4,
      confidencePercent: 95,
      hasPassedUserStop: false,
    }));

    addToast({
      type: 'arrival',
      title: 'Xe Tuyến 13 đã đến gần trạm!',
      message: 'Xe 43B-013.88 còn cách trạm Ngũ Hành Sơn 250m (~2 phút). Hãy sẵn sàng di chuyển ra điểm đón!',
      severity: 'success',
      routeId: 'route_13',
      actionLabel: 'Mở bản đồ đón xe',
      onAction: () => {
        setSelectedTrackingRoute('route_13');
        setActiveTab('track');
      },
    });
  };

  const simulateBusPassedStop = (passed: boolean = true) => {
    const isPassed = passed !== undefined ? passed : !route13Telemetry.hasPassedUserStop;
    setRoute13Telemetry((prev) => ({
      ...prev,
      currentStopIndex: isPassed ? 6 : 4,
      progressToNextStop: isPassed ? 0.3 : 0.65,
      hasPassedUserStop: isPassed,
    }));

    if (isPassed) {
      addToast({
        type: 'arrival',
        title: 'Xe Tuyến 13 đã đi qua trạm',
        message: 'Xe vừa rời trạm bạn chờ. AI gợi ý chuyển sang Tuyến 06 kế tiếp hoặc đón xe máy để không trễ học.',
        severity: 'danger',
        routeId: 'route_13',
        actionLabel: 'Xem phương án thay thế',
        onAction: () => setActiveTab('compare'),
      });
    } else {
      addToast({
        type: 'general',
        title: 'Đã hoàn lại vị trí xe trước trạm',
        message: 'Xe đang tiếp cận trạm bạn đang chờ.',
        severity: 'info',
        routeId: 'route_13',
      });
    }
  };

  const simulateGpsSignalLost = (lost: boolean = true) => {
    const willLose = lost !== undefined ? (lost ? !route13Telemetry.isGpsStale : false) : !route13Telemetry.isGpsStale;
    setRoute13Telemetry((prev) => ({
      ...prev,
      isGpsStale: willLose,
      gpsLastUpdatedSecondsAgo: willLose ? 185 : 20,
    }));

    if (willLose) {
      addToast({
        type: 'general',
        title: 'Cảnh báo: Dữ liệu GPS xe đã cũ (>3 phút)',
        message: 'Mất tín hiệu định vị vệ tinh. Hệ thống chuyển sang đối chiếu cảm biến trạm kế tiếp.',
        severity: 'warning',
        routeId: 'route_13',
      });
    } else {
      addToast({
        type: 'general',
        title: 'Tín hiệu GPS đã được đồng bộ lại',
        message: 'Định vị vệ tinh hoạt động bình thường, sai số < 10m.',
        severity: 'info',
        routeId: 'route_13',
      });
    }
  };

  const simulateSensorScanned = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setSensors((prev) => ({
      ...prev,
      'SN-13-06': {
        ...prev['SN-13-06'],
        status: 'scanned',
        lastScannedTimestamp: timeStr,
        verifiedVehicleId: '43B-013.88',
        gpsDiscrepancyMeters: 12,
      },
    }));

    addToast({
      type: 'sensor',
      title: 'Cảm biến trạm: Xe Tuyến 13 đã đến trạm!',
      message: `Cảm biến SN-13-06 quét xác nhận xe 43B-013.88 tại trạm lúc ${timeStr}. Sai lệch GPS chỉ 12m (+12% tin cậy).`,
      severity: 'success',
      routeId: 'route_13',
      actionLabel: 'Xem trạng thái cảm biến',
      onAction: () => {
        setSelectedTrackingRoute('route_13');
        setActiveTab('track');
      },
    });
  };

  const simulateSensorUnstable = (unstable: boolean = true) => {
    const willUnstable = unstable !== undefined ? (sensors['SN-13-06'].status === 'unstable' ? false : true) : true;
    setSensors((prev) => ({
      ...prev,
      'SN-13-06': {
        ...prev['SN-13-06'],
        status: willUnstable ? 'unstable' : 'ready',
        signalStrengthRssi: willUnstable ? -92 : -62,
      },
    }));

    if (willUnstable) {
      addToast({
        type: 'sensor',
        title: 'Cảm biến trạm SN-13-06 chập chờn',
        message: 'Tín hiệu sóng yếu (-92 dBm). AI tạm thời chỉ sử dụng GPS viễn thám.',
        severity: 'warning',
      });
    }
  };

  const simulateHeavyRain = (rain: boolean = true) => {
    const nextWeather = rain ? (weather === 'heavy_rain' ? 'sunny' : 'heavy_rain') : 'sunny';
    changeWeather(nextWeather);
  };

  // Real-time Open-Meteo Weather State
  const [realtimeWeather, setRealtimeWeather] = useState<VKUWeatherData | null>(null);
  const [isRealtimeWeatherActive, setIsRealtimeWeatherActive] = useState<boolean>(true);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  const syncRealtimeWeather = async () => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchRealtimeVkuWeather();
      setRealtimeWeather(data);
      setWeather(data.condition);
      setIsRealtimeWeatherActive(true);
    } catch (err) {
      console.warn('Realtime weather fallback to preset:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    syncRealtimeWeather();
    // Auto-sync real-time weather every 10 minutes
    const interval = setInterval(syncRealtimeWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const vkuWeather = useMemo(() => {
    if (isRealtimeWeatherActive && realtimeWeather) {
      return realtimeWeather;
    }
    return VKU_WEATHER_PRESETS[weather] || VKU_WEATHER_PRESETS.sunny;
  }, [weather, isRealtimeWeatherActive, realtimeWeather]);

  const changeWeather = (newWeather: WeatherCondition) => {
    setIsRealtimeWeatherActive(false);
    setWeather(newWeather);
    const data = VKU_WEATHER_PRESETS[newWeather];
    addToast({
      type: 'weather',
      title: `Trạm Khí tượng VKU (Mô phỏng): ${data.conditionLabel}`,
      message: `${data.temperatureC}°C, mưa ${data.rainProbabilityPercent}%. ${
        data.aiModeWeightImpact.busBonusPercent >= 20
          ? `AI kích hoạt ưu tiên xe buýt (+${data.aiModeWeightImpact.busBonusPercent}%) để bảo vệ sinh viên khỏi ngập/trượt!`
          : 'AI cập nhật lại trọng số thời tiết tối ưu.'
      }`,
      severity: newWeather === 'heavy_rain' ? 'danger' : newWeather === 'rain' ? 'warning' : 'info',
      actionLabel: 'Xem tác động AI',
      onAction: () => setActiveTab('compare'),
    });
  };

  const simulateTrafficCongested = (congested: boolean = true) => {
    const nextTraffic = congested ? (traffic === 'jammed' ? 'normal' : 'jammed') : 'normal';
    setTraffic(nextTraffic);

    if (nextTraffic === 'jammed') {
      addToast({
        type: 'traffic',
        title: 'Cảnh báo kẹt xe bất ngờ!',
        message: 'Ùn tắc nghiêm trọng trục đường Lê Văn Hiến - Trần Đại Nghĩa. Thời gian di chuyển đến VKU tăng +15 phút.',
        severity: 'danger',
        actionLabel: 'Kiểm tra giờ rời nhà mới',
        onAction: () => setActiveTab('compare'),
      });
    } else {
      addToast({
        type: 'traffic',
        title: 'Giao thông đã hạ nhiệt',
        message: 'Trục đường chính đến VKU thông thoáng trở lại.',
        severity: 'info',
      });
    }
  };

  // Slide 2 & Section 11: Real-life Founder Observation Incident (12:2x expected, 12:55 arrival)
  const simulateFounderIncident = () => {
    setDesiredArrivalTime('13:00');
    setRoute13Telemetry((prev) => ({
      ...prev,
      delayMinutes: 28,
      estimatedArrivalMinMinutes: 22,
      estimatedArrivalMaxMinutes: 28,
      confidencePercent: 78,
      hasPassedUserStop: false,
    }));
    setSelectedTrackingRoute('route_13');
    setActiveTab('track');

    addToast({
      type: 'delay',
      title: 'Sự cố thực tế Slide 2: Dự kiến 12:2x, xe đến lúc 12:55',
      message: 'AI xác nhận: Xe Tuyến 13 CHƯA ĐI QUA TRẠM (còn 22–28 phút). Hãy ngồi chờ thoải mái tại trạm có mái che, không cần tốn tiền gọi xe ôm!',
      severity: 'warning',
      routeId: 'route_13',
      actionLabel: 'Xem chi tiết cảnh báo',
      onAction: () => setActiveTab('alerts'),
      durationMs: 7000,
    });
  };

  // Slide 5, 10 & Section 20: Honest AI test (Recommends motorbike when buses are heavily delayed)
  const simulateHonestAiMotorbike = () => {
    setRoute6Telemetry((prev) => ({
      ...prev,
      delayMinutes: 22,
      confidencePercent: 42,
    }));
    setRoute13Telemetry((prev) => ({
      ...prev,
      delayMinutes: 26,
      confidencePercent: 45,
    }));
    setDesiredArrivalTime('07:30');
    setActiveTab('compare');

    addToast({
      type: 'general',
      title: 'AI trung thực: Đề xuất Xe máy cá nhân',
      message: 'Cả 2 tuyến xe buýt đều trễ >20 phút. Nếu tiếp tục chờ sẽ trễ giờ vào lớp 7:30! AI khuyên đi xe máy để kịp giờ.',
      severity: 'info',
      durationMs: 6000,
    });
  };

  const resetSimulation = () => {
    setSensors(INITIAL_SENSORS);
    setWeather('sunny');
    setTraffic('normal');
    setPriority('min_wait');
    setDesiredArrivalTime('07:30');
    setRoute6Telemetry({
      routeId: 'route_6',
      routeName: 'Tuyến 06',
      routeColor: '#2563eb',
      currentStopIndex: 4,
      progressToNextStop: 0.35,
      speedKmh: 23,
      delayMinutes: 0,
      isStalled: false,
      stalledMinutes: 0,
      gpsLastUpdatedSecondsAgo: 28,
      isGpsStale: false,
      hasPassedUserStop: false,
      estimatedArrivalMinMinutes: 14,
      estimatedArrivalMaxMinutes: 18,
      confidencePercent: 64,
      activeAnomalies: [],
    });
    setRoute13Telemetry({
      routeId: 'route_13',
      routeName: 'Tuyến 13',
      routeColor: '#059669',
      currentStopIndex: 4,
      progressToNextStop: 0.65,
      speedKmh: 28,
      delayMinutes: 0,
      isStalled: false,
      stalledMinutes: 0,
      gpsLastUpdatedSecondsAgo: 35,
      isGpsStale: false,
      hasPassedUserStop: false,
      estimatedArrivalMinMinutes: 8,
      estimatedArrivalMaxMinutes: 12,
      confidencePercent: 84,
      activeAnomalies: [],
    });
    setCurrentDemoStep(1);
    setIsDemoModeActive(false);

    addToast({
      type: 'general',
      title: 'Đã đặt lại dữ liệu ban đầu',
      message: 'Tất cả các thông số GPS, cảm biến và trạng thái đã trở về mặc định.',
      severity: 'info',
    });
  };

  // --- Guided Demo Steps (11 Steps from prompt) ---
  const demoSteps: DemoStep[] = [
    {
      step: 1,
      title: 'Bước 1: Chọn điểm đến VKU',
      description: 'Người dùng mở ứng dụng và xác nhận điểm đến là Trường ĐH CNTT & TT Việt - Hàn (VKU).',
      expectedScreen: 'home',
      actionButtonLabel: 'Xem điểm đến VKU',
      actionFn: () => setActiveTab('home'),
    },
    {
      step: 2,
      title: 'Bước 2: Chọn giờ có mặt 7:30',
      description: 'Người dùng chọn cần có mặt tại VKU lúc 7:30 sáng để kịp giờ vào lớp.',
      expectedScreen: 'home',
      actionButtonLabel: 'Đặt 7:30 & Phân tích',
      actionFn: () => {
        setDesiredArrivalTime('07:30');
        analyzeCommute();
      },
    },
    {
      step: 3,
      title: 'Bước 3: AI so sánh 3 phương án',
      description: 'Lớp AI thứ nhất so sánh Tuyến 6, Tuyến 13 và Xe máy cá nhân dựa trên chi phí, thời gian và rủi ro.',
      expectedScreen: 'compare',
      actionButtonLabel: 'Xem bảng so sánh',
      actionFn: () => setActiveTab('compare'),
    },
    {
      step: 4,
      title: 'Bước 4: AI đề xuất Tuyến 13 (Slide 08)',
      description: 'Why Bus 13? Cửa sổ thời gian đến ổn định hơn (8–12 phút), độ tin cậy 84%, tránh khoảng dao động rộng của Tuyến 6 (5–18 phút).',
      expectedScreen: 'compare',
      actionButtonLabel: 'Xem chi tiết đề xuất',
      actionFn: () => setActiveTab('compare'),
    },
    {
      step: 5,
      title: 'Bước 5: Rời nhà đúng giờ & Mở theo dõi xe',
      description: 'Người dùng bước ra trạm đón đúng giờ đã đề xuất và theo dõi trực tiếp vị trí xe buýt trên sơ đồ tuyến.',
      expectedScreen: 'track',
      actionButtonLabel: 'Mở theo dõi Tuyến 13',
      actionFn: () => {
        setSelectedTrackingRoute('route_13');
        setActiveTab('track');
      },
    },
    {
      step: 6,
      title: 'Bước 6: Hiển thị Tuyến 13 còn 8–12 phút (Slide 06)',
      description: 'Hệ thống hiển thị khoảng thời gian chờ dự đoán (8–12 phút), độ tin cậy 84% và trạng thái cảm biến trạm sẵn sàng.',
      expectedScreen: 'track',
      actionButtonLabel: 'Xác nhận hiển thị ETA',
      actionFn: () => setActiveTab('track'),
    },
    {
      step: 7,
      title: 'Bước 7: Sự cố thực tế Slide 02 (12:2x trễ 12:55)',
      description: 'Mô phỏng chuyến xe bị chậm 30 phút. AI xác nhận qua GPS & trạm dừng: Xe chưa qua trạm, khuyên an tâm chờ.',
      expectedScreen: 'track',
      actionButtonLabel: 'Kích hoạt sự cố Slide 2',
      actionFn: () => {
        simulateFounderIncident();
      },
    },
    {
      step: 8,
      title: 'Bước 8: Cảnh báo thông minh & Đề xuất đổi tuyến',
      description: 'AI phát hiện trễ, tự động điều chỉnh khoảng chờ và chủ động đề xuất chuyển sang Tuyến 6 để kịp giờ học.',
      expectedScreen: 'alerts',
      actionButtonLabel: 'Xem cảnh báo đổi tuyến',
      actionFn: () => {
        setSelectedTrackingRoute('route_6');
        setActiveTab('alerts');
      },
    },
    {
      step: 9,
      title: 'Bước 9: Cảm biến trạm quét xác thực (Slide 09)',
      description: 'Sensor = Lớp kiểm chứng dữ liệu viễn thám. Cảm biến trạm quét khớp xe, triệt tiêu sai số GPS, tăng +12% độ tin cậy.',
      expectedScreen: 'track',
      actionButtonLabel: 'Mô phỏng Cảm biến đã quét',
      actionFn: () => {
        simulateSensorScanned();
        setActiveTab('track');
      },
    },
    {
      step: 10,
      title: 'Bước 10: Kiểm chứng AI Trung Thực (Slide 05 & 10)',
      description: 'Khi cả hai tuyến buýt đều trễ giờ học/thi, AI thẳng thắn khuyên đi xe máy cá nhân, không quảng cáo mù quáng!',
      expectedScreen: 'compare',
      actionButtonLabel: 'Kiểm chứng AI Trung Thực',
      actionFn: () => {
        simulateHonestAiMotorbike();
      },
    },
    {
      step: 11,
      title: 'Bước 11: Thành công & Khẩu hiệu NexMile',
      description: '“Choose smarter. Wait less. Arrive on time.” — Đinh Trần Tiến Minh & Nguyễn Thị Yến Nhi (AI for Everyday Life Hackathon 2026).',
      expectedScreen: 'home',
      actionButtonLabel: 'Về Trang chủ & Hoàn tất Demo',
      actionFn: () => setActiveTab('home'),
    },
  ];

  const nextDemoStep = () => {
    if (currentDemoStep < demoSteps.length) {
      const nextStepNum = currentDemoStep + 1;
      setCurrentDemoStep(nextStepNum);
      const stepObj = demoSteps.find((s) => s.step === nextStepNum);
      if (stepObj?.actionFn) {
        stepObj.actionFn();
      }
    }
  };

  const prevDemoStep = () => {
    if (currentDemoStep > 1) {
      const prevStepNum = currentDemoStep - 1;
      setCurrentDemoStep(prevStepNum);
      const stepObj = demoSteps.find((s) => s.step === prevStepNum);
      if (stepObj?.actionFn) {
        stepObj.actionFn();
      }
    }
  };

  const jumpToDemoStep = (step: number) => {
    setCurrentDemoStep(step);
    const stepObj = demoSteps.find((s) => s.step === step);
    if (stepObj?.actionFn) {
      stepObj.actionFn();
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        originName,
        setOriginName,
        destinationName,
        desiredArrivalTime,
        setDesiredArrivalTime,
        priority,
        setPriority,
        selectedTrackingRoute,
        setSelectedTrackingRoute,
        tripHistory,
        addCurrentTripToHistory,
        toasts,
        addToast,
        dismissToast,
        clearToasts,
        route6Telemetry,
        route13Telemetry,
        sensors,
        traffic,
        setTraffic,
        weather,
        setWeather,
        vkuWeather,
        changeWeather,
        isRealtimeWeatherActive,
        isWeatherLoading,
        syncRealtimeWeather,
        futaStations: DA_NANG_3_BUS_STATIONS,
        futaRoutes: FUTA_VKU_ROUTES,
        getRealtimeFutaDepartures,
        recommendation,
        isAnalyzing,
        analyzeCommute,
        allAnomalies,
        simulateRoute6Delayed,
        simulateRoute13Delayed,
        simulateRoute13Approaching,
        simulateBusPassedStop,
        simulateGpsSignalLost,
        simulateSensorScanned,
        simulateSensorUnstable,
        simulateHeavyRain,
        simulateTrafficCongested,
        simulateFounderIncident,
        simulateHonestAiMotorbike,
        resetSimulation,
        isDemoModeActive,
        setIsDemoModeActive,
        currentDemoStep,
        demoSteps,
        nextDemoStep,
        prevDemoStep,
        jumpToDemoStep,
        isGesturesModalOpen,
        setIsGesturesModalOpen,
        handMode,
        setHandMode,
        toggleHandMode,
        goToNextTab,
        goToPrevTab,
        showSplash,
        setShowSplash,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

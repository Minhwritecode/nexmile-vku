export type PriorityMode = 'fastest' | 'cheapest' | 'min_wait' | 'safest';

export type TrafficCondition = 'clear' | 'normal' | 'dense' | 'jammed';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rain' | 'heavy_rain';

export type SensorStatus = 'ready' | 'scanned' | 'unstable';

export interface BusStop {
  id: string;
  name: string;
  shortName: string;
  sensorId: string;
  distanceFromStartKm: number;
  isUserStop?: boolean;
  isDestination?: boolean;
  lat: number;
  lng: number;
}

export interface BusTelemetry {
  routeId: 'route_6' | 'route_13';
  routeName: string;
  routeColor: string;
  currentStopIndex: number; // index of stop bus is currently at or between
  progressToNextStop: number; // 0 to 1
  speedKmh: number;
  delayMinutes: number;
  isStalled: boolean;
  stalledMinutes: number;
  gpsLastUpdatedSecondsAgo: number;
  isGpsStale: boolean;
  hasPassedUserStop: boolean;
  estimatedArrivalMinMinutes: number;
  estimatedArrivalMaxMinutes: number;
  confidencePercent: number;
  activeAnomalies: BusAnomaly[];
}

export interface BusSensorData {
  sensorId: string;
  stopId: string;
  stopName: string;
  routeId: 'route_6' | 'route_13';
  status: SensorStatus;
  lastScannedTimestamp?: string;
  batteryLevel: number;
  signalStrengthRssi: number; // -40 to -95 dBm
  verifiedVehicleId?: string;
  gpsDiscrepancyMeters?: number;
}

export interface BusAnomaly {
  id: string;
  type: 'approaching' | 'passed_stop' | 'delayed' | 'stalled' | 'stale_gps' | 'sensor_offline' | 'better_alternative';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  suggestedAction: string;
  actionType?: 'switch_route' | 'take_motorbike' | 'wait_patiently' | 'walk_to_stop';
  targetRouteId?: 'route_6' | 'route_13';
}

export interface CommuteOption {
  id: 'route_6' | 'route_13' | 'motorbike';
  name: string;
  category: 'bus' | 'personal';
  badge: 'Đề xuất tốt nhất' | 'Có rủi ro trễ' | 'Nhanh hơn nhưng chi phí cao hơn' | 'Dự phòng ổn định';
  badgeColor: 'emerald' | 'amber' | 'blue' | 'rose';
  isRecommended: boolean;
  totalTimeMinutes: number;
  waitingTimeMinutesRange: [number, number];
  transitTimeMinutes: number;
  walkingTimeMinutes: number;
  estimatedCostVnd: number;
  onTimeProbabilityPercent: number;
  confidencePercent: number;
  leaveHomeTime: string;
  arrivalTime: string;
  parkingTimeMinutes: number;
  pros: string[];
  cons: string[];
  weatherResilience: string;
}

export interface AIRecommendationResult {
  recommendedOptionId: 'route_6' | 'route_13' | 'motorbike';
  recommendedRouteName: string;
  leaveHomeTime: string;
  expectedArrivalTime: string;
  overallConfidencePercent: number;
  primaryRationale: string;
  detailedExplanation: string;
  comparisonOptions: CommuteOption[];
  factorWeights: {
    punctuality: number;
    waitingTime: number;
    weatherRisk: number;
    costSaving: number;
    comfortAndParking: number;
  };
}

export interface UserCommuteSettings {
  originName: string;
  originCoords: { lat: number; lng: number };
  destinationName: string;
  desiredArrivalTime: string; // e.g. "07:30"
  priority: PriorityMode;
  userStopId: string;
}

export interface ToastNotification {
  id: string;
  type: 'arrival' | 'traffic' | 'delay' | 'sensor' | 'weather' | 'route_switch' | 'general';
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success' | 'danger';
  routeId?: 'route_6' | 'route_13';
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface TripHistoryItem {
  id: string;
  date: string; // e.g. "Hôm nay, 25/09", "Hôm qua, 24/09"
  time: string; // e.g. "07:15"
  origin: string; // e.g. "Ký túc xá DMC - 08 Hà Văn Tính"
  destination: string; // e.g. "Đại học VKU"
  chosenMode: 'route_13' | 'route_6' | 'motorbike';
  modeLabel: string; // e.g. "Tuyến 13 (BV Ung Bướu - VKU)"
  predictedTotalMinutes: number; // e.g. 42
  actualTotalMinutes: number; // e.g. 40
  predictedWaitMinutes: number; // e.g. 8
  actualWaitMinutes: number; // e.g. 7
  predictedArrival: string; // e.g. "07:42"
  actualArrival: string; // e.g. "07:40"
  targetClassTime: string; // e.g. "07:45"
  costVnd: number; // 5000 or 20000
  costSavedVnd: number; // e.g. 15000 vs motorbike
  co2SavedKg: number; // e.g. 1.2 kg
  aiPredictionAccuracyPercent: number; // e.g. 96%
  isOnTime: boolean;
  weatherCondition: WeatherCondition;
  note: string;
}

export interface VKUWeatherData {
  locationName: string;
  condition: WeatherCondition;
  conditionLabel: string;
  temperatureC: number;
  feelsLikeC: number;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  airQualityAqi: number;
  roadConditionText: string;
  floodRisk: 'none' | 'low' | 'moderate' | 'high';
  aiCommuteAdvice: string;
  aiModeWeightImpact: {
    busBonusPercent: number;
    motorbikePenaltyPercent: number;
    estimatedExtraDelayMinutes: number;
  };
  hourlyForecast: {
    time: string;
    condition: WeatherCondition;
    tempC: number;
    rainProb: number;
  }[];
}

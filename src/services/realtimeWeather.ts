import { VKUWeatherData, WeatherCondition } from '../types';

// Coordinates for VKU (Vietnam - Korea University of Information and Communication Technology, Da Nang)
const VKU_COORDS = {
  lat: 15.9752,
  lng: 108.2534,
};

/**
 * Maps WMO Weather Interpretation Codes to NexMile WeatherCondition
 * 0: Clear sky -> sunny
 * 1, 2, 3: Mainly clear, partly cloudy, and overcast -> cloudy
 * 45, 48: Fog -> cloudy
 * 51, 53, 55, 61, 63, 80, 81: Rain -> rain
 * 65, 82, 95, 96, 99: Heavy rain / Thunderstorm -> heavy_rain
 */
function mapWmoCodeToCondition(code: number): { condition: WeatherCondition; label: string } {
  if (code === 0) {
    return { condition: 'sunny', label: 'Trời quang • Nắng ráo' };
  }
  if (code >= 1 && code <= 3) {
    return { condition: code === 1 ? 'sunny' : 'cloudy', label: code === 1 ? 'Nắng nhẹ • Ít mây' : 'Nhiều mây • Dịu mát' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'cloudy', label: 'Sương mù nhẹ • Trời âm u' };
  }
  if (code >= 51 && code <= 63) {
    return { condition: 'rain', label: 'Mưa rào nhẹ rải rác' };
  }
  if (code >= 80 && code <= 81) {
    return { condition: 'rain', label: 'Mưa rào Đà Nẵng' };
  }
  if (code === 65 || code === 82 || (code >= 95 && code <= 99)) {
    return { condition: 'heavy_rain', label: 'Mưa to • Dông lốc • Nguy cơ ngập' };
  }
  return { condition: 'cloudy', label: 'Nhiều mây' };
}

function getWindDirectionText(deg: number): string {
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export async function fetchRealtimeVkuWeather(): Promise<VKUWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${VKU_COORDS.lat}&longitude=${VKU_COORDS.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Asia%2FBangkok&forecast_days=1`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo API HTTP error: ${response.status}`);
  }

  const data = await response.json();
  const current = data.current;
  const currentCode = current.weather_code ?? 0;
  const { condition, label } = mapWmoCodeToCondition(currentCode);

  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const humidity = Math.round(current.relative_humidity_2m);
  const windSpeed = Math.round(current.wind_speed_10m);
  const windDir = getWindDirectionText(current.wind_direction_10m ?? 90);
  const rainProb = Math.min(100, Math.round((current.precipitation || 0) > 0 ? 85 : condition === 'rain' ? 70 : condition === 'heavy_rain' ? 95 : condition === 'cloudy' ? 25 : 5));

  // Determine flood risk and AI impacts
  let floodRisk: 'none' | 'low' | 'moderate' | 'high' = 'none';
  let roadConditionText = 'Mặt đường khô ráo, phương tiện di chuyển thuận lợi trên trục Trần Đại Nghĩa & Nam Kỳ Khởi Nghĩa.';
  let aiCommuteAdvice = `Nhiệt độ thực tế ${temp}°C tại khuôn viên VKU. Điều kiện giao thông thuận lợi, AI khuyến nghị xe buýt để tiết kiệm chi phí học đường.`;
  let busBonus = 5;
  let motorbikePenalty = 0;
  let delayMin = 0;

  if (condition === 'heavy_rain') {
    floodRisk = 'high';
    roadConditionText = 'Nước ngập cục bộ 15–25cm đoạn trũng Nam Kỳ Khởi Nghĩa & trước sảnh gửi xe VKU.';
    aiCommuteAdvice = `CẢNH BÁO THỜI TIẾT VKU REALTIME: Mưa to & gió giật! AI hạ mạnh điểm số xe máy (-40%), xe buýt có mái che là lựa chọn tối ưu an toàn tuyệt đối.`;
    busBonus = 45;
    motorbikePenalty = 40;
    delayMin = 12;
  } else if (condition === 'rain') {
    floodRisk = 'low';
    roadConditionText = 'Mặt đường trơn ướt, đọng nước nhẹ một số đoạn gần KĐT FPT & Làng ĐH Đà Nẵng.';
    aiCommuteAdvice = `Thời tiết mưa rào tại Đà Nẵng. AI tăng +25% ưu tiên xe buýt có máy lạnh để sinh viên đến giảng đường khô ráo.`;
    busBonus = 25;
    motorbikePenalty = 20;
    delayMin = 5;
  } else if (temp >= 33) {
    roadConditionText = 'Nắng gắt nhiệt độ cao, mặt đường hấp nhiệt rát trên tuyến đường 14km.';
    aiCommuteAdvice = `Nhiệt độ ngoài trời ${temp}°C (cảm giác ${feelsLike}°C). Xe buýt trợ giá có điều hòa mát 24°C, bảo vệ sinh viên khỏi say nắng.`;
    busBonus = 15;
    motorbikePenalty = 8;
  }

  // Build next 4 intervals of hourly forecast
  const hourly = data.hourly;
  const currentHour = new Date().getHours();
  const hourlyForecast: { time: string; condition: WeatherCondition; tempC: number; rainProb: number }[] = [];

  if (hourly && hourly.time) {
    for (let i = 0; i < hourly.time.length; i++) {
      const forecastHour = new Date(hourly.time[i]).getHours();
      if (forecastHour >= currentHour && hourlyForecast.length < 4) {
        const hCode = hourly.weather_code[i] ?? 0;
        const hCond = mapWmoCodeToCondition(hCode).condition;
        hourlyForecast.push({
          time: `${String(forecastHour).padStart(2, '0')}:00`,
          condition: hCond,
          tempC: Math.round(hourly.temperature_2m[i]),
          rainProb: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[i] : 10),
        });
      }
    }
  }

  // Fallback hourly if needed
  if (hourlyForecast.length === 0) {
    hourlyForecast.push(
      { time: '07:00', condition, tempC: temp, rainProb },
      { time: '09:00', condition, tempC: temp + 1, rainProb },
      { time: '11:30', condition, tempC: temp + 2, rainProb },
      { time: '14:00', condition, tempC: temp + 1, rainProb }
    );
  }

  return {
    locationName: 'Trạm Khí tượng ĐH VKU • Real-time Open-Meteo',
    condition,
    conditionLabel: label,
    temperatureC: temp,
    feelsLikeC: feelsLike,
    humidityPercent: humidity,
    rainProbabilityPercent: rainProb,
    windSpeedKmh: windSpeed,
    windDirection: windDir,
    uvIndex: condition === 'sunny' ? (temp > 32 ? 9 : 7) : condition === 'cloudy' ? 4 : 2,
    airQualityAqi: 32, // Da Nang coastal air is typically clean
    roadConditionText,
    floodRisk,
    aiCommuteAdvice,
    aiModeWeightImpact: {
      busBonusPercent: busBonus,
      motorbikePenaltyPercent: motorbikePenalty,
      estimatedExtraDelayMinutes: delayMin,
    },
    hourlyForecast,
  };
}

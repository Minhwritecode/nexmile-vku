/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DemoTourBar } from './components/DemoTourBar';
import { SimulationModal } from './components/SimulationModal';
import { ToastContainer } from './components/ToastContainer';
import { OneHandedQuickDial } from './components/OneHandedQuickDial';
import { OneHandedShortcutsModal } from './components/OneHandedShortcutsModal';
import { useTouchSwipe } from './hooks/useTouchSwipe';
import { Sliders, Sparkles, Heart, School, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';

// Keep the first paint small: the login flow does not need the dashboard,
// charts, or the 3D splash screen yet.
const AuthScreen = lazy(() =>
  import('./components/AuthScreen').then(({ AuthScreen }) => ({ default: AuthScreen })),
);
const ThreeSplashAnimation = lazy(() =>
  import('./components/ThreeSplashAnimation').then(({ ThreeSplashAnimation }) => ({ default: ThreeSplashAnimation })),
);
const HomeScreen = lazy(() =>
  import('./components/HomeScreen').then(({ HomeScreen }) => ({ default: HomeScreen })),
);
const ComparisonScreen = lazy(() =>
  import('./components/ComparisonScreen').then(({ ComparisonScreen }) => ({ default: ComparisonScreen })),
);
const TrackingScreen = lazy(() =>
  import('./components/TrackingScreen').then(({ TrackingScreen }) => ({ default: TrackingScreen })),
);
const AlertsScreen = lazy(() =>
  import('./components/AlertsScreen').then(({ AlertsScreen }) => ({ default: AlertsScreen })),
);
const AIDetailsScreen = lazy(() =>
  import('./components/AIDetailsScreen').then(({ AIDetailsScreen }) => ({ default: AIDetailsScreen })),
);
const HistoryScreen = lazy(() =>
  import('./components/HistoryScreen').then(({ HistoryScreen }) => ({ default: HistoryScreen })),
);

const AuthFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300 font-sans">
    <div className="animate-pulse text-sm">Đang mở màn hình đăng nhập…</div>
  </div>
);

const ScreenFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-slate-400 text-sm">
    Đang tải màn hình…
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [hasSkippedAuth, setHasSkippedAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    activeTab,
    setActiveTab,
    goToNextTab,
    goToPrevTab,
    isGesturesModalOpen,
    setIsGesturesModalOpen,
    handMode,
    toggleHandMode,
    selectedTrackingRoute,
    setSelectedTrackingRoute,
    vkuWeather,
    changeWeather,
    traffic,
    simulateTrafficCongested,
    simulateSensorScanned,
    showSplash,
    setShowSplash,
  } = useSimulation();

  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  // Enable mobile touch swipe gestures across screens
  useTouchSwipe({
    onSwipeLeft: goToNextTab,
    onSwipeRight: goToPrevTab,
    threshold: 55,
    maxPerpendicularDistance: 75,
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when user is typing in form inputs
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case '1':
        case 'h':
          e.preventDefault();
          setActiveTab('home');
          break;
        case '2':
        case 'c':
          e.preventDefault();
          setActiveTab('compare');
          break;
        case '3':
        case 't':
          e.preventDefault();
          setActiveTab('track');
          break;
        case '4':
        case 'a':
          e.preventDefault();
          setActiveTab('alerts');
          break;
        case '5':
        case 'd':
          e.preventDefault();
          setActiveTab('ai_details');
          break;
        case '6':
        case 'l':
          e.preventDefault();
          setActiveTab('history');
          break;
        case 'r':
          e.preventDefault();
          setSelectedTrackingRoute(selectedTrackingRoute === 'route_13' ? 'route_6' : 'route_13');
          break;
        case 'w':
          e.preventDefault();
          const nextWeather =
            vkuWeather.condition === 'sunny'
              ? 'cloudy'
              : vkuWeather.condition === 'cloudy'
              ? 'rain'
              : vkuWeather.condition === 'rain'
              ? 'heavy_rain'
              : 'sunny';
          changeWeather(nextWeather);
          break;
        case 'j':
          e.preventDefault();
          simulateTrafficCongested(traffic !== 'jammed');
          break;
        case 's':
          e.preventDefault();
          simulateSensorScanned();
          break;
        case 'm':
          e.preventDefault();
          setIsSimModalOpen((prev) => !prev);
          break;
        case '?':
        case 'g':
          e.preventDefault();
          setIsGesturesModalOpen(!isGesturesModalOpen);
          break;
        case 'escape':
          setIsSimModalOpen(false);
          setIsGesturesModalOpen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    selectedTrackingRoute,
    vkuWeather.condition,
    traffic,
    isGesturesModalOpen,
  ]);

  // If not authenticated and user hasn't explicitly chosen guest mode, show the 3D AuthScreen
  if (!isAuthLoading && !isAuthenticated && !hasSkippedAuth) {
    return (
      <Suspense fallback={<AuthFallback />}>
        <AuthScreen
          onAuthenticated={() => {
            setHasSkippedAuth(true);
            setShowSplash(true);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-36 md:pb-24 select-text max-w-full overflow-x-hidden">
      {/* 3D Three.js Interactive Splash Animation */}
      {showSplash && (
        <Suspense fallback={null}>
          <ThreeSplashAnimation onComplete={() => setShowSplash(false)} />
        </Suspense>
      )}

      {/* Modal AuthScreen if guest user clicks 'Đăng nhập' from Header */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Suspense fallback={<AuthFallback />}>
            <AuthScreen
              onAuthenticated={() => {
                setShowAuthModal(false);
              }}
            />
          </Suspense>
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-5 right-5 z-50 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold backdrop-blur-md"
          >
            Đóng [ESC]
          </button>
        </div>
      )}

      {/* Toast Notification Stream (Floating Top-Right) */}
      <ToastContainer />

      {/* Top Header */}
      <Header onOpenAuth={() => setShowAuthModal(true)} />

      {/* Guided Demo Tour Bar (Visible when demo mode is active) */}
      <DemoTourBar />

      {/* Desktop Navigation */}
      <Navigation onOpenSimulationModal={() => setIsSimModalOpen(true)} />

      {/* Main Screen Container with Touch Gestures Enabled */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 min-w-0 overflow-x-hidden">
        <Suspense fallback={<ScreenFallback />}>
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'compare' && <ComparisonScreen />}
          {activeTab === 'track' && <TrackingScreen />}
          {activeTab === 'alerts' && <AlertsScreen />}
          {activeTab === 'ai_details' && <AIDetailsScreen />}
          {activeTab === 'history' && <HistoryScreen />}
        </Suspense>

        {/* Mobile Swipe Gesture Helper Bar */}
        <div className="mt-8 md:hidden flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vuốt ngang 1 tay để chuyển tab</span>
          </div>
          <button
            onClick={() => setIsGesturesModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 underline"
          >
            <span>Xem cử chỉ</span>
          </button>
        </div>
      </main>

      {/* One-Handed Ergonomic Quick Dial Floating Widget (Mobile & Desktop) */}
      <OneHandedQuickDial />

      {/* Floating Simulation Controls Pill (Placed opposite to the thumb dial on mobile) */}
      <div
        className={`fixed bottom-20 md:bottom-6 z-30 ${
          handMode === 'right' ? 'left-4' : 'right-4'
        }`}
      >
        <button
          onClick={() => setIsSimModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-xl border border-amber-500/30 active:scale-95 transition-all backdrop-blur-md"
          title="Mở bảng mô phỏng dữ liệu (Nhấn M)"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Mô phỏng dữ liệu</span>
          <span className="sm:hidden">Mô phỏng</span>
        </button>
      </div>

      {/* Simulation Control Modal */}
      <SimulationModal isOpen={isSimModalOpen} onClose={() => setIsSimModalOpen(false)} />

      {/* One-Handed Shortcuts and Gestures Modal */}
      <OneHandedShortcutsModal
        isOpen={isGesturesModalOpen}
        onClose={() => setIsGesturesModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold">
            <School className="w-4 h-4 text-emerald-400" />
            <span>NexMile • AI for Everyday Life Hackathon 2026</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium">
            Tác giả: <strong>Đinh Trần Tiến Minh</strong> (23IT162) & <strong>Nguyễn Thị Yến Nhi</strong> (24DM078) • ĐH CNTT & TT Việt - Hàn (VKU)
          </div>
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed">
            Khẩu hiệu: <em className="text-slate-300">"Choose smarter. Wait less. Arrive on time."</em> — Ứng dụng trợ lý AI đón xe buýt Tuyến 06 & 13, tích hợp viễn thám GPS và xác thực cảm biến trạm thử nghiệm.
          </p>
          <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <span>Dành riêng cho cộng đồng sinh viên VKU</span>
            <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
            <span>• Phiên bản Trình diễn & Bảo vệ Cuộc thi 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SimulationProvider>
          <AppContent />
        </SimulationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

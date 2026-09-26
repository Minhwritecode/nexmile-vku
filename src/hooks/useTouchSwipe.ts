import { useEffect, useRef } from 'react';

interface UseTouchSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance in px to register a swipe
  maxPerpendicularDistance?: number; // Maximum vertical deviation allowed
  enabled?: boolean;
}

export function useTouchSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  maxPerpendicularDistance = 80,
  enabled = true,
}: UseTouchSwipeOptions) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Don't trigger if user touched an interactive input, slider, or map canvas
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('input, textarea, select, button, [data-prevent-swipe], .leaflet-container')
      ) {
        return;
      }

      if (e.touches.length === 1) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      touchStartX.current = null;
      touchStartY.current = null;

      // Ensure predominantly horizontal movement
      if (Math.abs(deltaY) > maxPerpendicularDistance) {
        return;
      }

      if (Math.abs(deltaX) >= threshold) {
        if (deltaX < 0 && onSwipeLeft) {
          // Swiped Left (move forward)
          if ('vibrate' in navigator) {
            try {
              navigator.vibrate(20);
            } catch (_) {}
          }
          onSwipeLeft();
        } else if (deltaX > 0 && onSwipeRight) {
          // Swiped Right (move back)
          if ('vibrate' in navigator) {
            try {
              navigator.vibrate(20);
            } catch (_) {}
          }
          onSwipeRight();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, maxPerpendicularDistance, enabled]);
}

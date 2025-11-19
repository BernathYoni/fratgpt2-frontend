/**
 * Device detection utilities for determining if user is on mobile or desktop
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false; // Server-side rendering
  }

  // Check User-Agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);

  // Check screen size as secondary confirmation
  const isSmallScreen = window.innerWidth <= 768;

  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Consider it mobile if:
  // 1. User-Agent indicates mobile, OR
  // 2. Small screen AND touch capability
  return isMobileUA || (isSmallScreen && hasTouch);
}

export function isDesktopDevice(): boolean {
  return !isMobileDevice();
}

export function getDeviceType(): 'mobile' | 'desktop' {
  return isMobileDevice() ? 'mobile' : 'desktop';
}

export function getScreenSize(): 'small' | 'medium' | 'large' {
  if (typeof window === 'undefined') {
    return 'large'; // Default for SSR
  }

  const width = window.innerWidth;

  if (width < 768) {
    return 'small'; // Mobile
  } else if (width < 1024) {
    return 'medium'; // Tablet
  } else {
    return 'large'; // Desktop
  }
}

export function canInstallExtension(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if browser is Chrome, Edge, Brave, or other Chromium-based browsers
  const userAgent = navigator.userAgent.toLowerCase();
  const isChromiumBased =
    userAgent.includes('chrome') ||
    userAgent.includes('chromium') ||
    userAgent.includes('edg') || // Edge
    userAgent.includes('brave');

  // Must be desktop and Chromium-based
  return isDesktopDevice() && isChromiumBased;
}

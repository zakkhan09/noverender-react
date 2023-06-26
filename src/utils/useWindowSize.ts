import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

export const smallThreshold = 425;
export const mobileThreshold = 768;
export const largeThreshold = 1024;
export const xLargeThreshold = 1440;
export const xxLargeThreshold = 1600;
export const xxxLargeThreshold = 1920;
export function useWindowSize(initial?: {
  isSmall?: boolean;
  isDesktop?: boolean;
  isMobile?: boolean;
}) {
  const [windowSize, setWindowSize] = useState<{
    width: undefined | number;
    height: undefined | number;
    isSmall: undefined | boolean;
    isDesktop: undefined | boolean;
    isMobile: undefined | boolean;
    isLarge: undefined | boolean;
    isXLarge: undefined | boolean;
    isLandscape: undefined | boolean;
    isTablet: undefined | boolean;
    isXXXLarge: undefined | boolean;
  }>({
    width: undefined,
    height: undefined,
    isSmall: initial?.isSmall ?? undefined,
    isDesktop: initial?.isDesktop ?? undefined,
    isMobile: initial?.isMobile ?? undefined,
    isLarge: undefined,
    isXLarge: undefined,
    isLandscape: undefined,
    isTablet: undefined,
    isXXXLarge: undefined,
  });

  useEffect(() => {
    function handleResize() {
      const isSmall = window.innerWidth > smallThreshold;
      const isLarge = window.innerWidth > largeThreshold;
      const isDesktop = window.innerWidth > mobileThreshold;
      const isMobile = !isDesktop;

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isSmall,
        isDesktop,
        isMobile,
        isLarge,
        isXLarge: window.innerWidth > xLargeThreshold,
        isLandscape: window.innerWidth > window.innerHeight,
        isTablet: !isLarge && isDesktop,
        isXXXLarge: window.innerWidth > xxxLargeThreshold,
      });
    }
    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedResize);
    handleResize();
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return windowSize;
}

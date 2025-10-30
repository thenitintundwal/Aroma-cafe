import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

export function useLenis() {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Create Lenis once
  useEffect(() => {
    if (lenisRef.current) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      infinite: false,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    const onVisibility = () => {
      if (!lenisRef.current) return;
      if (document.hidden) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on route changes without re-creating Lenis
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [location.pathname]);
}

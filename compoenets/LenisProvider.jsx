'use client'
import { useEffect,useRef} from "react";
export function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const initLenis = async () => {
      try {
        const Lenis = (await import("@studio-freight/lenis")).default;
        
        lenisRef.current = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
          autoResize: true,
        });

        function raf(time) {
          lenisRef.current?.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Optional: Add to window for debugging
        if (typeof window !== "undefined") {
          window.lenis = lenisRef.current;
        }

      } catch (error) {
        console.error("Failed to initialize Lenis:", error);
      }
    };

    initLenis();

    return () => {
      lenisRef.current?.destroy();
      if (typeof window !== "undefined") {
        delete window.lenis;
      }
    };
  }, []);

  // Add CSS to ensure proper scrolling
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        overflow-x: hidden;
      }
      
      body {
        overflow-x: hidden;
      }
      
      .lenis.lenis-smooth {
        scroll-behavior: auto !important;
      }
      
      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <>{children}</>;
}
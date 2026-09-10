import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

interface GlobeProps {
  className?: string;
}

/* Maritime shipping routes: [origin, destination] coordinates */
const ARCS: { from: [number, number]; to: [number, number] }[] = [
  { from: [-32.9, 151.8], to: [20.3, 86.6] },     // Newcastle → Paradip
  { from: [-28.8, 32.1], to: [17.7, 83.3] },       // Richards Bay → Visakhapatnam
  { from: [-25.97, 32.57], to: [13.1, 80.3] },     // Maputo → Chennai
  { from: [-6.2, 106.8], to: [22.0, 88.1] },       // Jakarta → Haldia
  { from: [29.7, -95.4], to: [20.3, 86.6] },       // Houston → Paradip
];

const MARKERS = [
  // Origins (smaller)
  { location: [-32.9, 151.8] as [number, number], size: 0.04 },
  { location: [-28.8, 32.1] as [number, number], size: 0.04 },
  { location: [-25.97, 32.57] as [number, number], size: 0.04 },
  { location: [-6.2, 106.8] as [number, number], size: 0.04 },
  { location: [29.7, -95.4] as [number, number], size: 0.04 },
  // Destinations — India East Coast (larger, emphasized)
  { location: [20.3, 86.6] as [number, number], size: 0.1 },
  { location: [17.7, 83.3] as [number, number], size: 0.08 },
  { location: [13.1, 80.3] as [number, number], size: 0.08 },
  { location: [22.0, 88.1] as [number, number], size: 0.08 },
];

function Globe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLOk, setWebGLOk] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl") && !c.getContext("experimental-webgl")) {
        setWebGLOk(false);
      }
    } catch {
      setWebGLOk(false);
    }
  }, []);

  useEffect(() => {
    if (!webGLOk || !canvasRef.current || !containerRef.current) return;

    let phi = -1.5; // center on India initially
    let width = containerRef.current.offsetWidth;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.15,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 20000,
      mapBrightness: 4,
      baseColor: [0.08, 0.1, 0.18],
      markerColor: [0.4, 0.85, 1],
      glowColor: [0.06, 0.12, 0.25],
      markers: MARKERS,
      arcs: ARCS,
      arcColor: [0.3, 0.7, 1],
      arcWidth: 1,
      arcHeight: 0.4,
    });

    // Animation loop
    let raf: number;
    const animate = () => {
      phi += 0.003;
      globe.update({ phi, width: width * 2, height: width * 2 });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Resize observer
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
    });
    observer.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      observer.disconnect();
    };
  }, [webGLOk]);

  if (!webGLOk) {
    return (
      <div
        className={`aspect-square w-full max-w-[520px] mx-auto rounded-full bg-[radial-gradient(circle_at_40%_40%,oklch(0.25_0.04_250),oklch(0.12_0.02_255)_70%,oklch(0.08_0.02_260))] border border-primary/10 shadow-[0_0_60px_oklch(0.3_0.1_220/0.15)] ${className ?? ""}`}
      />
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className ?? ""}`}
    >
      {/* Glow behind globe */}
      <div className="pointer-events-none absolute inset-[10%] rounded-full bg-primary/8 blur-3xl" />

      <div ref={containerRef} className="aspect-square w-full max-w-[520px]">
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            contain: "layout paint size",
          }}
        />
      </div>
    </div>
  );
}

export default Globe;

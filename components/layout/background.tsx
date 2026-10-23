"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // mouse spotlight (spring-smoothed)
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(38,139,255,0.13), transparent 70%)`;

  // aurora moves at different speeds when scrolling
  const { scrollYProgress } = useScroll();
  const yA = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 220]);

  // particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: Particle[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduceMotion) {
          // gentle push away from the cursor
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 140 && d > 0) {
            p.vx += (dx / d) * 0.02;
            p.vy += (dy / d) * 0.02;
          }
          // keep speeds calm
          p.vx *= 0.995;
          p.vy *= 0.995;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        // dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(140, 210, 255, 0.55)";
        ctx!.fill();

        // links to nearby dots
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx!.strokeStyle = `rgba(56, 160, 255, ${0.16 * (1 - dist / 120)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }

        // link to the cursor
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 170) {
          ctx!.strokeStyle = `rgba(0, 217, 245, ${0.35 * (1 - md / 170)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mx.set(e.clientX);
      my.set(e.clientY);
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    // pause when the tab is hidden (saves battery)
    function onVisibility() {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mx, my]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#06060C]"
    >
      {/* aurora blobs */}
      <motion.div style={{ y: yA }} className="absolute inset-0">
        <motion.div
          className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-[#268BFF]/25 blur-[130px]"
          animate={{ x: [0, 160, -40, 0], y: [0, 120, 60, 0], scale: [1, 1.2, 0.95, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-48 top-1/4 h-[560px] w-[560px] rounded-full bg-[#00D9F5]/15 blur-[130px]"
          animate={{ x: [0, -140, 40, 0], y: [0, 100, -60, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div style={{ y: yB }} className="absolute inset-0">
        <motion.div
          className="absolute -bottom-52 left-1/3 h-[640px] w-[640px] rounded-full bg-[#5B4DFF]/20 blur-[140px]"
          animate={{ x: [0, 120, -100, 0], y: [0, -80, 40, 0], scale: [1, 1.15, 1, 1] }}
          transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* dot grid, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* mouse spotlight */}
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,6,12,0.85)_100%)]" />
    </div>
  );
}
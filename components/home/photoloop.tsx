"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// add more photos here (10-20 looks best). Files go in public/events/hero/
const IMAGES = [
  "/events/hero/1.jpeg",
  "/events/hero/2.jpeg",
  "/events/hero/3.jpeg",
  "/events/hero/4.jpeg",
  "/events/hero/5.jpeg",
  "/events/hero/6.jpeg",
  "/events/hero/7.jpeg",
    "/events/hero/8.jpeg",
    "/events/hero/9.jpeg",
    "/events/hero/10.jpeg",
    "/events/hero/11.jpeg",
    "/events/hero/12.jpeg",
    "/events/hero/13.jpeg",
    "/events/hero/14.jpeg",
  "/events/hero/15.jpeg",
    "/events/hero/16.jpeg",
    "/events/hero/17.jpeg",
    "/events/hero/18.jpeg",
    "/events/hero/19.jpeg",
    "/events/hero/20.jpeg",
  "/events/hero/21.jpeg",
  
];

const DRIFT = { x: 28, y: 6 }; // idle drift, px/second
const KEY_SPEED = 520; // px/second while a key is held
const BOOST = 1.9; // Shift multiplier

// 4 depth layers, far -> near. cols x rows = tiles in that layer.
const LAYERS = [
  { scale: 0.7, speed: 0.55, opacity: 0.5, blur: 1.5, cols: 4, rows: 2 },
  { scale: 0.9, speed: 0.8, opacity: 0.75, blur: 0, cols: 3, rows: 2 },
  { scale: 1.1, speed: 1, opacity: 0.95, blur: 0, cols: 2, rows: 2 },
  { scale: 1.35, speed: 1.3, opacity: 1, blur: 0, cols: 2, rows: 2 },
];

const KEYS = ["w", "a", "s", "d"] as const;
type Key = (typeof KEYS)[number];
const isKey = (k: string): k is Key => (KEYS as readonly string[]).includes(k);

const frac = (n: number) => n - Math.floor(n);
const wrap = (v: number, size: number) => ((v % size) + size) % size;

// Each layer is an evenly spaced, staggered grid with a little jitter,
// so photos stay spread out instead of clumping.
const TILES = (() => {
  let n = 0;
  return LAYERS.flatMap((layer, li) =>
    Array.from({ length: layer.cols * layer.rows }, (_, k) => {
      const c = k % layer.cols;
      const r = Math.floor(k / layer.cols);
      const jx = (frac(n * 0.7548776662 + 0.3) - 0.5) * 0.4;
      const jy = (frac(n * 0.569840291 + 0.7) - 0.5) * 0.4;
      const tile = {
        src: IMAGES[(n * 3) % IMAGES.length], // neighbours get different photos
        fx: frac((c + 0.5 + (r % 2) * 0.5 + jx) / layer.cols + li * 0.13),
        fy: frac((r + 0.5 + jy) / layer.rows + li * 0.21),
        layer,
        phase: n * 1.7,
      };
      n++;
      return tile;
    })
  );
})();

const ringMask =
  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))";

function isTyping(t: EventTarget | null) {
  return (
    t instanceof HTMLElement &&
    (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))
  );
}

export default function PhotoLoop({
  reduceMotion,
  exploring,
  onExit,
}: {
  reduceMotion: boolean;
  exploring: boolean;
  onExit: () => void;
}) {
  const wallRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const keys = useRef<Record<Key, boolean>>({ w: false, a: false, s: false, d: false });
  const boost = useRef(false);
  const focus = useRef(0); // 0 = hero mode, 1 = explore mode (smoothed)
  const exploringRef = useRef(exploring);
  const onExitRef = useRef(onExit);
  const [pressed, setPressed] = useState<Record<Key, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    exploringRef.current = exploring;
    onExitRef.current = onExit;
  });

  const press = useCallback((k: Key, down: boolean) => {
    if (keys.current[k] === down) return;
    keys.current[k] = down;
    setPressed({ ...keys.current });
  }, []);

  // cursor + touch behaviour only while exploring
  useEffect(() => {
    const host = wallRef.current?.parentElement;
    if (!host) return;
    host.style.cursor = exploring ? "grab" : "";
    host.style.touchAction = exploring ? "none" : "";
    if (!exploring) {
      KEYS.forEach((k) => press(k, false));
      boost.current = false;
    }
  }, [exploring, press]);

  // keyboard (only active in explore mode)
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (!exploringRef.current) return;
      if (e.key === "Escape") {
        onExitRef.current();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      boost.current = e.shiftKey;
      const k = e.key.toLowerCase();
      if (isKey(k)) press(k, true);
    };
    const onUp = (e: KeyboardEvent) => {
      boost.current = e.shiftKey;
      const k = e.key.toLowerCase();
      if (isKey(k)) press(k, false);
    };
    const releaseAll = () => {
      KEYS.forEach((k) => press(k, false));
      boost.current = false;
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", releaseAll);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, [press]);

  // animation loop + drag
  useEffect(() => {
    const wall = wallRef.current;
    const host = wall?.parentElement;
    if (!wall || !host) return;

    const cam = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    let vw = 0;
    let vh = 0;
    let base = 200;
    let visible = true;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      vw = host.clientWidth;
      vh = host.clientHeight;
      base = Math.min(Math.max(vw * 0.17, 150), 270);
      TILES.forEach((t, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const w = base * t.layer.scale;
        el.style.width = `${w}px`;
        el.style.height = `${w * 0.75}px`;
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      focus.current +=
        ((exploringRef.current ? 1 : 0) - focus.current) * (1 - Math.exp(-dt * 4));

      if (!dragging) {
        const k = keys.current;
        const sp = KEY_SPEED * (boost.current ? BOOST : 1);
        const tx = ((k.d ? 1 : 0) - (k.a ? 1 : 0)) * sp + (reduceMotion ? 0 : DRIFT.x);
        const ty = ((k.s ? 1 : 0) - (k.w ? 1 : 0)) * sp + (reduceMotion ? 0 : DRIFT.y);
        const f = 1 - Math.exp(-dt * 3.5);
        vel.x += (tx - vel.x) * f;
        vel.y += (ty - vel.y) * f;
        cam.x += vel.x * dt;
        cam.y += vel.y * dt;
      }

      // live joystick HUD
      const speed = Math.hypot(vel.x, vel.y);
      if (orbRef.current) {
        const len = Math.min(24, (speed / KEY_SPEED) * 22);
        const ox = speed > 1 ? (vel.x / speed) * len : 0;
        const oy = speed > 1 ? (vel.y / speed) * len : 0;
        orbRef.current.style.transform = `translate(${ox}px, ${oy}px)`;
      }
      if (arcRef.current) {
        const heading = (Math.atan2(vel.x, -vel.y) * 180) / Math.PI;
        arcRef.current.style.transform = `rotate(${heading}deg)`;
        arcRef.current.style.opacity = String(
          Math.min(1, (speed / (KEY_SPEED * BOOST)) * 2.2)
        );
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(
          1,
          speed / (KEY_SPEED * BOOST)
        )})`;
      }

      // tiles
      TILES.forEach((t, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const w = base * t.layer.scale;
        const h = w * 0.75;
        const pad = w + 40; // wrap area hugs the tile size
        const W = vw + pad * 2;
        const H = vh + pad * 2;
        const bob = reduceMotion ? 0 : Math.sin(now / 1000 + t.phase) * 6;
        const x = wrap(t.fx * W - cam.x * t.layer.speed, W) - pad;
        const y = wrap(t.fy * H - cam.y * t.layer.speed, H) - pad + bob;

        // hero mode: fade near the centre so the title stays readable
        const cx = (x + w / 2 - vw / 2) / vw;
        const cy = (y + h / 2 - vh / 2) / vh;
        const centerFade = Math.min(1, 0.2 + Math.hypot(cx, cy * 1.3) * 1.6);
        const fade = centerFade + (1 - centerFade) * focus.current;
        const o = t.layer.opacity + (1 - t.layer.opacity) * 0.5 * focus.current;

        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = String(o * fade);
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!exploringRef.current) return;
      if ((e.target as HTMLElement).closest("a, button")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      host.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 0.001);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      cam.x -= dx;
      cam.y -= dy;
      vel.x += (-dx / dt - vel.x) * 0.5;
      vel.y += (-dy / dt - vel.y) * 0.5;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      vel.x = Math.max(-1500, Math.min(1500, vel.x));
      vel.y = Math.max(-1500, Math.min(1500, vel.y));
      host.style.cursor = exploringRef.current ? "grab" : "";
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);
    const ro = new ResizeObserver(layout);
    ro.observe(host);

    layout();
    raf = requestAnimationFrame(frame);
    host.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [reduceMotion]);

  const cap = (k: Key, pos: string) => (
    <div className={`absolute ${pos}`}>
      <button
        type="button"
        aria-label={`Move ${k.toUpperCase()}`}
        onPointerDown={() => press(k, true)}
        onPointerUp={() => press(k, false)}
        onPointerLeave={() => press(k, false)}
        onPointerCancel={() => press(k, false)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs uppercase transition-all duration-100 ${
          pressed[k]
            ? "translate-y-0.5 scale-95 border-[#00D9F5] bg-[#268BFF]/40 text-white shadow-[0_0_18px_rgba(0,217,245,0.65)]"
            : "border-white/20 bg-[#0D0D14]/90 text-loop-muted hover:border-[#268BFF]/60 hover:text-white"
        }`}
      >
        {k}
      </button>
    </div>
  );

  const kbd =
    "rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] text-loop-text";

  return (
    <>
      <div
        ref={wallRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {TILES.map((t, i) => (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 will-change-transform"
            style={{
              opacity: 0,
              zIndex: Math.round(t.layer.scale * 10),
              filter: t.layer.blur ? `blur(${t.layer.blur}px)` : undefined,
            }}
          >
            <Image
              src={t.src}
              alt=""
              fill
              sizes="300px"
              draggable={false}
              className="select-none object-cover"
            />
          </div>
        ))}
      </div>

      {/* control panel (desktop) */}
      <AnimatePresence>
        {exploring && (
          <motion.div
            key="hud"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute bottom-8 left-8 z-20 flex items-center gap-6 rounded-3xl border border-white/10 bg-[#0D0D14]/70 p-5 pr-7 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl max-md:hidden"
          >
            {/* joystick */}
            <div className="relative h-[116px] w-[116px] shrink-0">
              <div className="absolute inset-0 rounded-full border border-white/15 bg-[radial-gradient(circle,rgba(38,139,255,0.16),transparent_70%)]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-white/10" />
              {/* arc pointing where you're heading */}
              <div
                ref={arcRef}
                className="absolute inset-0 rounded-full"
                style={{
                  opacity: 0,
                  background:
                    "conic-gradient(from -40deg, transparent 0deg, #00D9F5 40deg, transparent 80deg)",
                  WebkitMask: ringMask,
                  mask: ringMask,
                }}
              />
              {/* orb follows your velocity */}
              <div className="absolute left-1/2 top-1/2 h-0 w-0">
                <div
                  ref={orbRef}
                  className="-ml-2 -mt-2 h-4 w-4 rounded-full bg-[#00D9F5] shadow-[0_0_18px_5px_rgba(0,217,245,0.6)]"
                />
              </div>
              {cap("w", "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2")}
              {cap("s", "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2")}
              {cap("a", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2")}
              {cap("d", "right-0 top-1/2 translate-x-1/2 -translate-y-1/2")}
            </div>

            {/* readout */}
            <div className="w-44">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00D9F5]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00D9F5]" />
                Explore mode
              </p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  ref={barRef}
                  className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#268BFF] to-[#00D9F5]"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-loop-muted">
                speed
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[10px] text-loop-muted">
                <span className={kbd}>WASD</span> move
                <span className={kbd}>Shift</span> boost
                <span className={kbd}>Esc</span> exit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* hint (phones) */}
      <AnimatePresence>
        {exploring && (
          <motion.div
            key="chip"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center md:hidden"
          >
            <span className="rounded-full border border-white/10 bg-[#0D0D14]/80 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00D9F5] backdrop-blur-xl">
              drag to explore
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
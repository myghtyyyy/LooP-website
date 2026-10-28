"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
// Add more photos here. Files go in public/events/hero/
const IMAGES = Array.from(
  { length: 34 },
  (_, i) => `/events/hero/${i + 1}.jpeg`
);

const DRIFT = { x: 28, y: 6 };
const KEY_SPEED = 520;
const BOOST = 1.9;
const MAX_SPEED = 1800;

const LAYERS = [
  { scale: 0.7, speed: 0.55, opacity: 0.5, blur: 1.5, cols: 4, rows: 2 },
  { scale: 0.9, speed: 0.8, opacity: 0.75, blur: 0, cols: 3, rows: 2 },
  { scale: 1.1, speed: 1, opacity: 0.95, blur: 0, cols: 2, rows: 2 },
  { scale: 1.35, speed: 1.3, opacity: 1, blur: 0, cols: 2, rows: 2 },
];

const KEYS = ["w", "a", "s", "d"] as const;
type Key = (typeof KEYS)[number];

const isKey = (k: string): k is Key =>
  (KEYS as readonly string[]).includes(k);

const ARROWS: Record<string, Key> = {
  arrowup: "w",
  arrowleft: "a",
  arrowdown: "s",
  arrowright: "d",
};

const frac = (n: number) => n - Math.floor(n);
const wrap = (v: number, size: number) =>
  ((v % size) + size) % size;
const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const TILES = (() => {
  let n = 0;

  return LAYERS.flatMap((layer, li) =>
    Array.from({ length: layer.cols * layer.rows }, (_, k) => {
      const c = k % layer.cols;
      const r = Math.floor(k / layer.cols);

      const jx = (frac(n * 0.7548776662 + 0.3) - 0.5) * 0.4;
      const jy = (frac(n * 0.569840291 + 0.7) - 0.5) * 0.4;

      const tile = {
        src: IMAGES[(n * 3) % IMAGES.length],
        fx: frac(
          (c + 0.5 + (r % 2) * 0.5 + jx) / layer.cols +
            li * 0.13
        ),
        fy: frac(
          (r + 0.5 + jy) / layer.rows + li * 0.21
        ),
        rot: (frac(n * 0.37 + 0.2) - 0.5) * 8,
        layer,
        phase: n * 1.7,
      };

      n++;
      return tile;
    })
  );
})();

const ORDER = TILES.map((_, i) => i).sort(
  (a, b) => TILES[b].layer.scale - TILES[a].layer.scale
);

const ringMask =
  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))";

function isTyping(t: EventTarget | null) {
  return (
    t instanceof HTMLElement &&
    (t.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))
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
  const posRef = useRef<HTMLParagraphElement>(null);
  const warpRef = useRef<HTMLDivElement>(null);

  const keys = useRef<Record<Key, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const boost = useRef(false);
  const focus = useRef(0);
  const exploringRef = useRef(exploring);
  const onExitRef = useRef(onExit);
  const lightRef = useRef<string | null>(null);

  const [light, setLight] = useState<string | null>(null);
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
  const [pressed, setPressed] = useState<Record<Key, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Sync latest props/state into refs before any handler can fire.
  useLayoutEffect(() => {
    exploringRef.current = exploring;
    onExitRef.current = onExit;
    lightRef.current = light;
  }, [exploring, onExit, light]);

  const press = useCallback((k: Key, down: boolean) => {
    if (keys.current[k] === down) return;

    keys.current[k] = down;
    setPressed({ ...keys.current });
  }, []);

  // Cursor and touch behaviour while exploring.
  useEffect(() => {
    const host = wallRef.current?.parentElement;
    if (!host) return;

    host.style.touchAction = exploring ? "none" : "";

    if (!exploring) {
      KEYS.forEach((k) => press(k, false));
      boost.current = false;
      setLight(null);
      host.style.cursor = "";
    }

    return () => {
      host.style.touchAction = "";
    };
  }, [exploring, press]);

  // Keyboard controls.
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (!exploringRef.current) return;

      if (e.key === "Escape") {
        if (lightRef.current !== null) {
          setLight(null);
        } else {
          onExitRef.current();
        }
        return;
      }

      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        isTyping(e.target)
      ) {
        return;
      }

      boost.current = e.shiftKey;

      const raw = e.key.toLowerCase();
      const k = ARROWS[raw] ?? raw;

      if (isKey(k)) {
        if (ARROWS[raw]) e.preventDefault();
        press(k, true);
      }
    };

    const onUp = (e: KeyboardEvent) => {
      boost.current = e.shiftKey;

      const raw = e.key.toLowerCase();
      const k = ARROWS[raw] ?? raw;

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

  // Animation, dragging, hover and photo interaction.
  useEffect(() => {
    const wall = wallRef.current;
    const host = wall?.parentElement;

    if (!wall || !host) return;

    const cam = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const par = { x: 0, y: 0 };

    const mouse = {
      x: -9999,
      y: -9999,
      nx: 0,
      ny: 0,
    };

    const rects = TILES.map(() => ({
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      a: 0,
    }));

    const hv = TILES.map(() => 0);

    let vw = 0;
    let vh = 0;
    let base = 200;
    let visible = true;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let raf = 0;
    let lastCursor = "";
    let lastPos = "";

    const born = performance.now();
    let last = born;

    const lightIsOpen = () => lightRef.current !== null;

    const setCursor = (c: string) => {
      if (c !== lastCursor) {
        host.style.cursor = c;
        lastCursor = c;
      }
    };

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

    const hitTest = () => {
      for (const i of ORDER) {
        const r = rects[i];

        if (
          r.a > 0.25 &&
          mouse.x >= r.x &&
          mouse.x <= r.x + r.w &&
          mouse.y >= r.y &&
          mouse.y <= r.y + r.h
        ) {
          return i;
        }
      }

      return -1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      if (!visible) {
        last = now;
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const f = 1 - Math.exp(-dt * 4);
      const exp = exploringRef.current;

      focus.current +=
        ((exp ? 1 : 0) - focus.current) * f;

      // Cursor parallax in hero mode.
      if (!reduceMotion) {
        const pf = 1 - Math.exp(-dt * 3);

        par.x +=
          (mouse.nx * (1 - focus.current) - par.x) * pf;

        par.y +=
          (mouse.ny * (1 - focus.current) - par.y) * pf;
      }

      if (!dragging) {
        const k = keys.current;
        const sp = KEY_SPEED * (boost.current ? BOOST : 1);

        const tx =
          ((k.d ? 1 : 0) - (k.a ? 1 : 0)) * sp +
          (reduceMotion ? 0 : DRIFT.x);

        const ty =
          ((k.s ? 1 : 0) - (k.w ? 1 : 0)) * sp +
          (reduceMotion ? 0 : DRIFT.y);

        const sf = 1 - Math.exp(-dt * 3.5);

        vel.x += (tx - vel.x) * sf;
        vel.y += (ty - vel.y) * sf;

        cam.x += vel.x * dt;
        cam.y += vel.y * dt;
      }

      // HUD.
      const speed = Math.hypot(vel.x, vel.y);
      const norm = Math.min(1, speed / (KEY_SPEED * BOOST));

      if (orbRef.current) {
        const len = Math.min(24, (speed / KEY_SPEED) * 22);

        const ox = speed > 1 ? (vel.x / speed) * len : 0;
        const oy = speed > 1 ? (vel.y / speed) * len : 0;

        orbRef.current.style.transform =
          `translate(${ox}px, ${oy}px)`;
      }

      if (arcRef.current) {
        const heading =
          (Math.atan2(vel.x, -vel.y) * 180) / Math.PI;

        arcRef.current.style.transform = `rotate(${heading}deg)`;
        arcRef.current.style.opacity = String(
          Math.min(1, norm * 2.2)
        );
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${norm})`;
      }

      if (posRef.current && exp) {
        const s =
          `x ${Math.round(cam.x)} · y ${Math.round(cam.y)}`;

        if (s !== lastPos) {
          posRef.current.textContent = s;
          lastPos = s;
        }
      }

      if (warpRef.current) {
        warpRef.current.style.opacity = String(
          Math.min(1, Math.max(0, norm - 0.35) * 1.8) *
            focus.current
        );
      }

      // Hover only in explore mode.
      const hovered =
        exp && !dragging && !lightIsOpen() ? hitTest() : -1;

      setCursor(
        dragging
          ? "grabbing"
          : hovered >= 0
            ? "pointer"
            : exp
              ? "grab"
              : ""
      );

      const lx = reduceMotion
        ? 0
        : clamp(vel.x / KEY_SPEED, -1.6, 1.6);

      const ly = reduceMotion
        ? 0
        : clamp(vel.y / KEY_SPEED, -1.6, 1.6);

      TILES.forEach((t, i) => {
        const el = tileRefs.current[i];
        if (!el) return;

        const w = base * t.layer.scale;
        const h = w * 0.75;
        const pad = w + 40;

        const W = vw + pad * 2;
        const H = vh + pad * 2;

        // Intro animation.
        const a = reduceMotion
          ? 1
          : easeOut(
              clamp((now - born - 150 - i * 70) / 800, 0, 1)
            );

        const bob = reduceMotion
          ? 0
          : Math.sin(now / 1000 + t.phase) * 6;

        const px = reduceMotion
          ? 0
          : par.x * 70 * t.layer.speed;

        const py = reduceMotion
          ? 0
          : par.y * 50 * t.layer.speed;

        const x =
          wrap(t.fx * W - cam.x * t.layer.speed, W) -
          pad +
          px;

        const y =
          wrap(t.fy * H - cam.y * t.layer.speed, H) -
          pad +
          bob +
          py +
          (1 - a) * 60;

        hv[i] +=
          ((i === hovered ? 1 : 0) - hv[i]) *
          (1 - Math.exp(-dt * 12));

        const h1 = hv[i];

        // Keep the centre clear for the hero title.
        const cx = (x + w / 2 - vw / 2) / vw;
        const cy = (y + h / 2 - vh / 2) / vh;

        const centerFade = Math.min(
          1,
          0.2 + Math.hypot(cx, cy * 1.3) * 1.6
        );

        const fade =
          centerFade + (1 - centerFade) * focus.current;

        const o0 =
          t.layer.opacity +
          (1 - t.layer.opacity) * 0.5 * focus.current;

        const o =
          (o0 * fade + (1 - o0 * fade) * h1) * a;

        const scale =
          (0.6 + 0.4 * a) * (1 + 0.16 * h1);

        const ry = lx * 11 * t.layer.speed;
        const rx = -ly * 11 * t.layer.speed;

        rects[i].x = x;
        rects[i].y = y;
        rects[i].w = w;
        rects[i].h = h;
        rects[i].a = o;

        el.style.transform =
          `translate3d(${x}px, ${y}px, 0) ` +
          `rotateZ(${t.rot}deg) ` +
          `rotateX(${rx}deg) ` +
          `rotateY(${ry}deg) ` +
          `scale(${scale})`;

        el.style.opacity = String(o);

        el.style.zIndex = String(
          h1 > 0.05 ? 40 : Math.round(t.layer.scale * 10)
        );

        el.style.borderColor =
          `rgba(${Math.round(255 - 255 * h1)}, ` +
          `${Math.round(255 - 38 * h1)}, 255, ` +
          `${0.1 + 0.7 * h1})`;

        el.style.boxShadow =
          `0 20px 50px rgba(0,0,0,0.5), ` +
          `0 0 ${44 * h1}px rgba(0,217,245,${0.5 * h1})`;
      });
    };

    const updateMouse = (e: PointerEvent | MouseEvent) => {
      const r = host.getBoundingClientRect();

      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;

      mouse.nx = e.clientX / window.innerWidth - 0.5;
      mouse.ny = e.clientY / window.innerHeight - 0.5;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!exploringRef.current || lightIsOpen()) return;

      const el = e.target as HTMLElement;

      if (el.closest("a, button, [data-hud], [data-lightbox]")) {
        return;
      }

      if (e.pointerType === "mouse" && e.button !== 0) return;

      updateMouse(e);

      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      updateMouse(e);

      if (!dragging) return;

      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 0.001);

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      moved += Math.abs(dx) + Math.abs(dy);

      cam.x -= dx;
      cam.y -= dy;

      vel.x += (-dx / dt - vel.x) * 0.5;
      vel.y += (-dy / dt - vel.y) * 0.5;

      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;

      dragging = false;

      vel.x = clamp(vel.x, -MAX_SPEED, MAX_SPEED);
      vel.y = clamp(vel.y, -MAX_SPEED, MAX_SPEED);

      // Open a photo on a click/tap, not a drag.
      if (e.type === "pointerup" && moved < 6) {
        const i = hitTest();

        if (i >= 0) {
          setLight(TILES[i].src);
        }
      }
    };

    const onLeave = () => {
      if (dragging) return;

      mouse.x = -9999;
      mouse.y = -9999;
      mouse.nx = 0;
      mouse.ny = 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (!exploringRef.current || lightIsOpen()) return;

      vel.x = clamp(
        vel.x + e.deltaX * 2.2,
        -MAX_SPEED,
        MAX_SPEED
      );

      vel.y = clamp(
        vel.y + e.deltaY * 2.2,
        -MAX_SPEED,
        MAX_SPEED
      );
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
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("wheel", onWheel, { passive: true });

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      cancelAnimationFrame(raf);

      io.disconnect();
      ro.disconnect();

      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("wheel", onWheel);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);

      host.style.cursor = "";
    };
  }, [reduceMotion]);

  const cap = (k: Key, pos: string) => (
    <div className={`absolute ${pos}`}>
      <button
        type="button"
        aria-label={`Move ${k.toUpperCase()}`}
        onPointerDown={(e) => {
          e.preventDefault();
          press(k, true);
        }}
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
      {/* Photo wall */}
      <div
        ref={wallRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {TILES.map((t, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => {
              tileRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 overflow-hidden rounded-2xl border will-change-transform"
            style={{
              opacity: 0,
              zIndex: Math.round(t.layer.scale * 10),
              filter: t.layer.blur
                ? `blur(${t.layer.blur}px)`
                : undefined,
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

        {/* Warp glow */}
        <div
          ref={warpRef}
          className="absolute inset-0"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(38,139,255,0.16) 78%, rgba(0,217,245,0.3) 100%)",
          }}
        />
      </div>

      {/* Desktop controls */}
      <AnimatePresence>
        {exploring && (
          <motion.div
            key="hud"
            data-hud
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute bottom-8 left-8 z-20 flex items-center gap-6 rounded-3xl border border-white/10 bg-[#0D0D14]/70 p-5 pr-7 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl max-md:hidden"
          >
            <div className="relative h-[116px] w-[116px] shrink-0">
              <div className="absolute inset-0 rounded-full border border-white/15 bg-[radial-gradient(circle,rgba(38,139,255,0.16),transparent_70%)]" />

              <div className="absolute inset-4 rounded-full border border-dashed border-white/10" />

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

            <div className="w-52">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00D9F5]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00D9F5]" />
                Explore mode
              </p>

              <p
                ref={posRef}
                className="mt-3 font-mono text-[11px] tabular-nums text-loop-muted"
              >
                x 0 · y 0
              </p>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
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
                <span className={kbd}>click</span> open
                <span className={kbd}>Esc</span> exit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile hint */}
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
              drag to explore · tap a photo
            </span>
          </motion.div>
        )}
      </AnimatePresence>

            {/* lightbox (rendered into <body> so no parent can clip it) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {light && (
              <motion.div
                key="lightbox"
                data-lightbox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLight(null)}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06060C]/85 p-5 backdrop-blur-md"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#00D9F5]/30 shadow-[0_0_80px_rgba(38,139,255,0.35)]"
                >
                  <Image
                    src={light}
                    alt=""
                    fill
                    sizes="900px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setLight(null)}
                    aria-label="Close photo"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#06060C]/70 text-white backdrop-blur-md hover:border-[#00D9F5]"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
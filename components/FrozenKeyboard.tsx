"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Text,
  Text3D,
} from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSeason } from "@/components/SeasonProvider";
import { useLanguage } from "@/components/LanguageProvider";
import * as THREE from "three";
import { SKILLS_GRID, type SkillIcon } from "@/lib/skills";
import { projects } from "@/content/projects";

// Per-section keyboard "states" — same idea as Naresh's animated-background-
// config.ts, but for our R3F keyboard. Values are tweened toward via lerp
// inside useFrame; the active section is detected via IntersectionObserver
// on elements carrying data-kb-section.
type KeyboardState = {
  yaw: number; // rotation.y
  pitch: number; // rotation.x
  roll: number; // rotation.z
  posX: number;
  posY: number;
  posZ: number;
  scale: number;
};

const SECTION_STATES: Record<string, KeyboardState> = {
  hero: {
    yaw: Math.PI * 0.15,
    pitch: Math.PI * 0.18,
    roll: Math.PI * 0.025,
    posX: 1.5,
    posY: 0,
    posZ: 0,
    scale: 1,
  },
  stack: {
    // Naresh's reference: keyboard lives in the lower-right, moderate
    // isometric tilt — enough yaw to show the left face but not so much
    // pitch that the base wall takes over the silhouette.
    yaw: Math.PI * 0.40,
    pitch: Math.PI * 0.14,
    roll: -Math.PI * -0.13,
    posX: 0,
    posY: -0.6,
    posZ: 0,
    scale: 1.3,
  },
  // Project 1 — text is left-aligned, so the keyboard slides to the RIGHT,
  // near the giant "01" watermark.
  project1: {
    yaw: 0,
    pitch: 0.7,
    roll: 0.2,
    posX: 1.5,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  // Project 2 — text is right-aligned, keyboard moves to the LEFT near "02".
  project2: {
    yaw: 0.5,
    pitch: 0.8,
    roll: -0.3,
    posX: -1.9,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  // Project 3 — left-aligned again, keyboard right.
  project3: {
    yaw: 0,
    pitch: 0.7,
    roll: 0.2,
    posX: 1.5,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  // Project 4 — right-aligned, keyboard left.
  project4: {
    yaw: 0.5,
    pitch: 0.8,
    roll: -0.3,
    posX: -1.9,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  experience: {
    yaw: Math.PI * 0.3,
    pitch: Math.PI * 0.08,
    roll: 0,
    posX: 0,
    posY: 0.05,
    posZ: 0,
    scale: 0.95,
  },
  // Contact — mirrors the hero pose (same yaw/pitch/roll and scale) but
  // pushed to the right so the "¿Hablamos?" copy can sit on the left. The
  // Keyboard component also reuses the hero-style cinematic idle swing
  // while this section is active.
  contact: {
    yaw: Math.PI * 0.15,
    pitch: Math.PI * 0.18,
    roll: Math.PI * 0.025,
    posX: 1.4,
    posY: 0,
    posZ: 0,
    scale: 1,
  },
};

// Reuse the original left/right poses for every configured project. New
// project sections therefore need no hand-written entry in SECTION_STATES.
const PROJECT_SECTION_STATES: Record<string, KeyboardState> = Object.fromEntries(
  projects.map((project) => [
    project.section,
    SECTION_STATES[project.align === "left" ? "project1" : "project2"],
  ])
);

// Education inherits the original experience pose without changing the scene.
SECTION_STATES.education = SECTION_STATES.experience;

// Mobile lives in the hero only (the canvas scrolls away with it), so there is
// no per-section choreography — the keyboard sits centered with a permanent
// cinematic idle swing and reacts to taps instead of hover.
const MOBILE_STATE: KeyboardState = {
  yaw: Math.PI * 0.16,
  pitch: Math.PI * 0.2,
  roll: 0.02,
  posX: 0,
  posY: 0,
  posZ: 0,
  scale: 1.55,
};

// Track which data-kb-section element is currently most prominent on-screen.
// Returns the section id (React state, for conditional overlay rendering) +
// a mutable Set of "highlighted" keyboard slugs read off the same element's
// data-kb-highlights attribute. The Set is a ref so per-frame reads inside
// useFrame don't trigger re-renders — Keycap mutates position/emissive
// based on `highlightsRef.current.has(slug)`.
function useActiveSection(): [
  string,
  React.RefObject<string>,
  React.RefObject<Set<string>>
] {
  const [section, setSection] = useState<string>("hero");
  const ref = useRef<string>("hero");
  const highlightsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (typeof window === "undefined") return;
    const visibility = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.intersectionRatio);
        }
        let bestRatio = 0;
        let bestEl: HTMLElement | null = null;
        let bestSection = ref.current;
        for (const [el, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = el as HTMLElement;
            bestSection = bestEl.dataset.kbSection ?? bestSection;
          }
        }
        // Always refresh highlights from the most-visible element, even if
        // the section id didn't change — lets page tweak highlights by
        // updating just the data attribute.
        const raw = bestEl?.dataset.kbHighlights ?? "";
        highlightsRef.current = new Set(
          raw.split(",").map((s) => s.trim()).filter(Boolean)
        );
        if (bestSection !== ref.current) {
          ref.current = bestSection;
          setSection(bestSection);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    const targets = document.querySelectorAll<HTMLElement>("[data-kb-section]");
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return [section, ref, highlightsRef];
}

// Taglines are now resolved via the i18n dictionary (keyboard.taglines.<slug>),
// keyed by the simple-icons slug on each key. See lib/i18n.ts.

function makeRoundedRectShape(
  width: number,
  depth: number,
  cornerRadius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(cornerRadius, w, d);
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);
  return shape;
}

function createExtrudedBox(
  width: number,
  depth: number,
  height: number,
  cornerRadius: number,
  bevelSize: number,
  topScale = 1
): THREE.BufferGeometry {
  const shape = makeRoundedRectShape(width, depth, cornerRadius);
  const extrudeDepth = Math.max(0.001, height - 2 * bevelSize);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: bevelSize > 0,
    bevelThickness: bevelSize,
    bevelSize: bevelSize,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 12,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2 + bevelSize, 0);

  if (topScale !== 1) {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + height / 2) / height;
      const factor = THREE.MathUtils.lerp(1, topScale, t);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  return geometry;
}

// Render a simple-icons SVG path into a square CanvasTexture.
function makeIconTexture(
  svgPath: string,
  color: string,
  size = 256
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const iconTargetSize = Math.round(size * 0.62);
  const scale = iconTargetSize / 24;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(svgPath));
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

const SKILLS = SKILLS_GRID;

const COLS = 5;
const ROWS = 3;
const KEYCAP_SIZE = 0.4;
const KEYCAP_HEIGHT = 0.28;
const KEYCAP_TOP_SCALE = 0.78;
const COL_SPACING = 0.42;
const ROW_SPACING = 0.42;
const BASE_WIDTH = 2.4;
const BASE_DEPTH = 1.4;
const BASE_HEIGHT = 0.26;
const ICON_PLANE_SIZE = KEYCAP_SIZE * KEYCAP_TOP_SCALE * 0.78;
const PRESS_DEPTH = 0.15;
const HOVER_CORE_INSET = 0.025;
const HOVER_CONFIRM_MS = 90;
const HOVER_REENTRY_MS = 100;

// One AudioContext per tab, lazily created on the first valid key entry.
// Browsers block audio until a real user gesture (click/keydown) — pointerover
// does not count in Chrome. A one-shot unlock listener resumes the context on
// the first real interaction so every subsequent hover plays immediately.
let audioCtx: AudioContext | null = null;
let audioUnlockInstalled = false;
function installAudioUnlock() {
  if (audioUnlockInstalled || typeof window === "undefined") return;
  audioUnlockInstalled = true;
  // Touch gains browser user activation on release, unlike mouse down. Keep
  // listening until resume actually succeeds, including the first mobile tap.
  const events = ["pointerdown", "pointerup", "keydown", "touchend"] as const;
  const removeListeners = () => {
    events.forEach((event) => window.removeEventListener(event, unlock));
  };
  const unlock = () => {
    if (!audioCtx) return;
    if (audioCtx.state === "running") removeListeners();
    else audioCtx.resume().then(removeListeners).catch(() => {});
  };
  events.forEach((event) => window.addEventListener(event, unlock));
}
// A key entry plays the press sample. Keep release as a fallback only; playing
// it randomly on entry (or again on exit) sounds like an accidental double click.
const KEY_SOUND_URLS = [
  "/sounds/switch_press.mp3",
  "/sounds/switch_release.mp3",
] as const;
const keySoundBuffers: (AudioBuffer | null)[] = [null, null];
let keySoundsLoading: Promise<void> | null = null;
let activeKeySound: {
  source: AudioBufferSourceNode;
  gain: GainNode;
} | null = null;
function loadKeySounds(ctx: AudioContext): Promise<void> {
  if (keySoundsLoading) return keySoundsLoading;
  keySoundsLoading = Promise.all(
    KEY_SOUND_URLS.map((url, i) =>
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`Keyboard sound: ${r.status}`);
          return r.arrayBuffer();
        })
        .then((buf) => ctx.decodeAudioData(buf))
        .then((decoded) => {
          keySoundBuffers[i] = decoded;
        })
        .catch(() => {
          /* keep null; the other sample remains available as a fallback */
        })
    )
  ).then(() => undefined);
  return keySoundsLoading;
}

function playKeyClick(seed: number, isCurrentEntry: () => boolean) {
  if (typeof window === "undefined" || !isCurrentEntry()) return;
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      audioCtx = new Ctor();
      installAudioUnlock();
    }
    const ctx = audioCtx;
    const trigger = () => {
      // Loading/resuming may finish after the pointer left or selected another
      // key. Never flush those obsolete requests as a burst of clicks.
      if (!isCurrentEntry() || ctx.state !== "running") return;
      const buffer = keySoundBuffers[0] ?? keySoundBuffers[1];
      if (!buffer) return;
      // Per-key playback rate detune (±4%) keeps repeated presses lively.
      const detune =
        1 + (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.08;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = detune;
      const gain = ctx.createGain();
      gain.gain.value = 0.7;
      src.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      let startAt = now;
      if (activeKeySound) {
        // A 5 ms fade avoids truncation clicks. The next sample starts when
        // the previous one stops, without imposing a cooldown between keys.
        startAt += 0.005;
        activeKeySound.gain.gain.cancelScheduledValues(now);
        activeKeySound.gain.gain.setValueAtTime(
          activeKeySound.gain.gain.value,
          now
        );
        activeKeySound.gain.gain.linearRampToValueAtTime(0, startAt);
        activeKeySound.source.stop(startAt);
      }
      activeKeySound = { source: src, gain };
      src.onended = () => {
        src.disconnect();
        gain.disconnect();
        if (activeKeySound?.source === src) activeKeySound = null;
      };
      src.start(startAt);
    };
    if (ctx.state === "running" && keySoundsLoading && keySoundBuffers[0]) {
      trigger();
    } else {
      Promise.all([
        ctx.state === "suspended" ? ctx.resume() : Promise.resolve(),
        loadKeySounds(ctx),
      ]).then(trigger).catch(() => {});
    }
  } catch {
    // Audio failure must never break the 3D scene.
  }
}

function Keycap({
  geometry,
  hitGeometry,
  position,
  isMobile,
  icon,
  onHoverChange,
  hovered,
  highlightsRef,
  activeSectionRef,
  wavePhase,
  accent,
}: {
  geometry: THREE.BufferGeometry;
  hitGeometry: THREE.BufferGeometry;
  position: [number, number, number];
  isMobile: boolean;
  icon: SkillIcon;
  onHoverChange: (hovered: boolean, touch?: boolean, enteredAt?: number) => void;
  hovered: boolean;
  // Reactive set of slugs to animate; read every frame so we don't force
  // re-renders when the active project changes.
  highlightsRef: React.RefObject<Set<string>>;
  // Current section id (ref so we don't re-render when it flips). Used by
  // the contact section to trigger idle random bobs.
  activeSectionRef: React.RefObject<string>;
  // Per-key phase so neighbouring highlighted keys bob out of sync and
  // look like a wave rather than a synchronised jump.
  wavePhase: number;
  // Season accent colour — highlighted keys glow in this colour, so the
  // bouncing keys feel "part of" the current theme.
  accent: string;
}) {
  const pressRef = useRef<THREE.Group>(null);
  const pressY = useRef(0);
  const liftAmp = useRef(0); // smoothed 0..1 gate for the bounce + glow
  const contactAmp = useRef(0); // smoothed 0..1 gate for the random idle bob
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const pendingHover = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverActive = useRef(false);
  const hoverStartedAt = useRef<number | null>(null);
  const releaseTouch = useRef<((event?: PointerEvent) => void) | null>(null);
  const baseEmissive = 0.3;

  // Each key gets its own random frequency + phase, stable across re-renders
  // so every keycap's random bob feels independent (no synchronised wave).
  // Sampled after mount so rendering stays pure, then held across re-renders.
  const randomBob = useRef<{
    freq: number;
    phase: number;
    threshold: number;
  } | null>(null);
  useEffect(() => {
    if (randomBob.current) return;
    randomBob.current = {
      freq: 0.6 + Math.random() * 0.6, // 0.6..1.2 Hz-ish
      phase: Math.random() * Math.PI * 2,
      threshold: 0.45 + Math.random() * 0.2, // 0.45..0.65 — higher = rarer pop
    };
  }, []);

  const iconTexture = useMemo(
    () => makeIconTexture(icon.path, `#${icon.hex}`),
    [icon.path, icon.hex]
  );

  // Stable THREE.Color objects so useFrame can lerp in place (no garbage
  // per-tick). Recomputed whenever the season accent changes.
  const whiteColor = useMemo(() => new THREE.Color("#ffffff"), []);
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);
  // Tinted white for the plastic body — keeps the "white keycap with a
  // hint of the season" look without going cartoonishly saturated.
  const bodyTint = useMemo(() => {
    const c = new THREE.Color(accent);
    c.lerp(whiteColor, 0.25);
    return c;
  }, [accent, whiteColor]);

  useEffect(() => {
    return () => iconTexture.dispose();
  }, [iconTexture]);

  useFrame((state) => {
    const bobConfig = randomBob.current;
    if (!pressRef.current || !bobConfig) return;
    const pressed = hovered ? -PRESS_DEPTH : 0;
    const t = state.clock.elapsedTime;

    // Project wave: 1 while this key's slug is in the active section's
    // highlights, fading out when it leaves. Produces the synchronised
    // travelling bounce on project sections.
    const isHighlighted =
      highlightsRef.current?.has(icon.slug) ?? false;
    liftAmp.current = THREE.MathUtils.lerp(
      liftAmp.current,
      isHighlighted ? 1 : 0,
      0.08
    );
    const bob =
      Math.sin(t * 2.2 + wavePhase) * 0.14 * liftAmp.current;

    // Contact idle: each keycap pops up at its own random cadence. We use
    // a thresholded sine so every key spends most of its time at rest and
    // only jumps briefly when its sine crosses the threshold — creates the
    // Naresh-style "random keys popping" effect without anything global.
    const isContact = activeSectionRef.current === "contact";
    contactAmp.current = THREE.MathUtils.lerp(
      contactAmp.current,
      isContact ? 1 : 0,
      0.06
    );
    const sineRaw = Math.sin(t * bobConfig.freq + bobConfig.phase);
    const popRaw = Math.max(0, sineRaw - bobConfig.threshold);
    // Normalise the pop so keys with higher thresholds don't end up flat.
    const popNorm = popRaw / (1 - bobConfig.threshold);
    const randomPop = popNorm * 0.18 * contactAmp.current;

    const target = pressed + bob + randomPop;
    pressY.current = THREE.MathUtils.lerp(pressY.current, target, 0.22);
    pressRef.current.position.y = pressY.current;

    if (matRef.current) {
      // Emissive intensity pulses with the bob so glow brightens on the
      // upswing of the wave.
      const pulse = (bob / 0.14 + 1) * 0.5; // 0..1 from the sine
      const targetIntensity =
        baseEmissive + liftAmp.current * (0.45 + pulse * 0.55);
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        matRef.current.emissiveIntensity,
        targetIntensity,
        0.15
      );
      // Emissive COLOUR lerps white → season accent so highlighted keys
      // glow in the current theme (blue in winter, green in spring, …).
      matRef.current.emissive
        .copy(whiteColor)
        .lerp(accentColor, liftAmp.current);
      // Body tint pushes clearly toward the accent so the key reads as
      // "tinted white" (e.g. an icy blue-white in winter) rather than pure
      // plastic when lifted.
      matRef.current.color
        .copy(whiteColor)
        .lerp(bodyTint, liftAmp.current);
    }
  });

  const cancelPendingHover = useCallback(() => {
    if (pendingHover.current !== null) {
      clearTimeout(pendingHover.current);
      pendingHover.current = null;
    }
  }, []);

  useEffect(() => () => {
    cancelPendingHover();
    releaseTouch.current?.();
  }, [cancelPendingHover]);

  const handleHover = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (e.pointerType === "touch") return;
      // R3F sends pointerout to occluded objects synchronously here, before
      // this key becomes active. Stop both bubbling and hits behind this key.
      e.stopPropagation();
      if (hoverActive.current) return;
      hoverStartedAt.current ??= performance.now();
      const point = e.object.worldToLocal(e.point.clone());
      const core = KEYCAP_SIZE * KEYCAP_TOP_SCALE / 2 - HOVER_CORE_INSET;
      const activate = () => {
        pendingHover.current = null;
        hoverActive.current = true;
        onHoverChange(true, false, hoverStartedAt.current ?? performance.now());
      };
      if (Math.abs(point.x) <= core && Math.abs(point.y) <= core) {
        cancelPendingHover();
        activate();
      } else if (pendingHover.current === null) {
        pendingHover.current = setTimeout(activate, HOVER_CONFIRM_MS);
      }
    },
    [cancelPendingHover, onHoverChange]
  );
  const handleOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (e.pointerType === "touch") return;
    cancelPendingHover();
    hoverActive.current = false;
    hoverStartedAt.current = null;
    onHoverChange(false);
  }, [cancelPendingHover, onHoverChange]);

  // Touch devices never fire hover, so on mobile we drive the same press +
  // SFX path from pointer down/up — a momentary tap-to-bounce.
  const handleDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isMobile && e.pointerType === "mouse") return;
      e.stopPropagation();
      cancelPendingHover();
      releaseTouch.current?.();
      // Keep the release on this key even while the keyboard/keycap moves.
      const target = e.target as Element;
      const nativeTarget = e.nativeEvent.target as HTMLElement;
      target.setPointerCapture(e.pointerId);
      const release = (event?: PointerEvent) => {
        if (event && event.pointerId !== e.pointerId) return;
        releaseTouch.current = null;
        nativeTarget.removeEventListener("pointercancel", release);
        nativeTarget.removeEventListener("lostpointercapture", release);
        if (target.hasPointerCapture(e.pointerId)) {
          target.releasePointerCapture(e.pointerId);
        }
        onHoverChange(false, true);
      };
      // R3F 9 clears its hit map on cancel/lost capture but does not dispatch
      // these handlers to meshes. Listen on the native target during the tap.
      nativeTarget.addEventListener("pointercancel", release);
      nativeTarget.addEventListener("lostpointercapture", release);
      releaseTouch.current = release;
      onHoverChange(true, true);
    },
    [cancelPendingHover, isMobile, onHoverChange]
  );
  const handleUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!releaseTouch.current) return;
    e.stopPropagation();
    releaseTouch.current(e.nativeEvent);
  }, []);

  const iconY = KEYCAP_HEIGHT / 2 + 0.0015;

  return (
    <group position={position}>
      {/* The rounded top is the only hit surface. It stays at rest height so
          pressing/bobbing cannot move the hit away from the same pointer.
          Invisible meshes still raycast; nothing new is drawn. */}
      <mesh
        geometry={hitGeometry}
        position={[0, KEYCAP_HEIGHT / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerOver={isMobile ? undefined : handleHover}
        onPointerMove={isMobile ? undefined : handleHover}
        onPointerOut={isMobile ? undefined : handleOut}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
      />
      <group ref={pressRef}>
        <mesh
          geometry={geometry}
          raycast={() => null}
        >
          <meshPhysicalMaterial
            ref={matRef}
            color="#ffffff"
            transmission={0}
            roughness={0.32}
            clearcoat={isMobile ? 0 : 0.5}
            clearcoatRoughness={0.18}
            metalness={0}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh
          position={[0, iconY, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <planeGeometry args={[ICON_PLANE_SIZE, ICON_PLANE_SIZE]} />
          <meshBasicMaterial
            map={iconTexture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Keyboard({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const isMobile = mobile;
  const { palette } = useSeason();
  const { t } = useLanguage();
  const [activeSection, activeSectionRef, highlightsRef] = useActiveSection();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const activeKey = useRef<string | null>(null);
  const soundEntry = useRef(0);
  const lastHover = useRef<{ key: string; leftAt: number | null } | null>(null);

  const changeActiveKey = useCallback((
    id: string,
    entered: boolean,
    touch = false,
    enteredAt = performance.now()
  ) => {
    if (!entered) {
      // Canceled border confirmations still count as a brief excursion from
      // this key. Keep the same hover episode through repeated edge jitter.
      if (!touch && lastHover.current?.key === id) {
        lastHover.current.leftAt = performance.now();
      }
      // An outgoing/occluded key must never clear the newly selected key.
      if (activeKey.current !== id) return;
      activeKey.current = null;
      setHoveredKey(null);
      if (!touch) {
        soundEntry.current++;
      }
      return;
    }
    if (activeKey.current === id) return;
    activeKey.current = id;
    setHoveredKey(id);
    const previous = lastHover.current;
    const play = touch || previous?.key !== id ||
      (previous.leftAt !== null && enteredAt - previous.leftAt >= HOVER_REENTRY_MS);
    if (!touch) lastHover.current = { key: id, leftAt: null };
    const entry = ++soundEntry.current;
    if (play) {
      const [row, col] = id.split("-").map(Number);
      playKeyClick(row * COLS + col, () => soundEntry.current === entry);
    }
  }, []);

  useEffect(() => () => { soundEntry.current++; }, []);
  // Mutable holders for the smoothed target — kept off React state so
  // useFrame can read them every tick without triggering re-renders.
  const current = useRef<KeyboardState>({ ...SECTION_STATES.hero });
  // Accumulated spin (radians) added on top of the target yaw while it
  // decays to zero — produces a flip between project sections.
  const spinRef = useRef(0);
  const prevSectionId = useRef<string>("hero");

  // When scrolling between two project sections, kick off a spin. Direction
  // alternates per target project so consecutive flips don't look identical.
  useEffect(() => {
    if (mobile) return; // no project→project flips on mobile (hero-only)
    const prev = prevSectionId.current;
    prevSectionId.current = activeSection;
    if (prev === activeSection) return;
    const wasProject = prev.startsWith("project");
    const isProject = activeSection.startsWith("project");
    if (!wasProject || !isProject) return;
    const n = parseInt(activeSection.replace("project", ""), 10) || 0;
    const dir = n % 2 === 0 ? 1 : -1;
    spinRef.current += Math.PI * 2 * dir;
  }, [activeSection, mobile]);

  // Sound is driven by accepted entries, independent of React effect replay.
  useEffect(() => {
    document.body.style.cursor = hoveredKey ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hoveredKey]);

  useEffect(() => {
    if (ref.current) ref.current.rotation.order = "YXZ";
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const target = mobile
      ? MOBILE_STATE
      : PROJECT_SECTION_STATES[activeSectionRef.current] ??
        SECTION_STATES[activeSectionRef.current] ?? SECTION_STATES.hero;
    // Frame-rate-independent lerp: ~0.06 per 16ms tick = a satisfying ease.
    const k = 1 - Math.pow(0.001, delta);
    const c = current.current;
    c.yaw = THREE.MathUtils.lerp(c.yaw, target.yaw, k);
    c.pitch = THREE.MathUtils.lerp(c.pitch, target.pitch, k);
    c.roll = THREE.MathUtils.lerp(c.roll, target.roll, k);
    c.posX = THREE.MathUtils.lerp(c.posX, target.posX, k);
    c.posY = THREE.MathUtils.lerp(c.posY, target.posY, k);
    c.posZ = THREE.MathUtils.lerp(c.posZ, target.posZ, k);
    c.scale = THREE.MathUtils.lerp(c.scale, target.scale, k);

    // Decay the project-transition spin frame-rate independently so the
    // flip settles at roughly the same pace regardless of refresh rate.
    spinRef.current *= Math.exp(-3.2 * delta);
    if (Math.abs(spinRef.current) < 0.003) spinRef.current = 0;
    // Normalised magnitude (0..1) — used for a subtle "pop" on scale & a
    // small hop on Y so the flip reads as a tiny jump-and-turn.
    const spinNorm = Math.min(1, Math.abs(spinRef.current) / (Math.PI * 2));

    // Idle motion layered on top. Hero and Contact share a wide cinematic
    // yoyo so the keyboard "shows itself"; other sections keep a quiet
    // breathing so the copy is easier to read.
    const isShowcase =
      mobile ||
      activeSectionRef.current === "hero" ||
      activeSectionRef.current === "contact";
    const yawSwing = isShowcase ? 0.5 : 0.025;
    const pitchSwing = isShowcase ? 0.07 : 0.0;
    const rollSwing = isShowcase ? 0.05 : 0.0;
    const period = isShowcase ? 9 : 20; // seconds per full cycle
    const w = (Math.PI * 2) / period;
    ref.current.rotation.y =
      c.yaw + Math.sin(t * w) * yawSwing + spinRef.current;
    ref.current.rotation.x = c.pitch + Math.sin(t * w * 0.6) * pitchSwing;
    ref.current.rotation.z = c.roll + Math.sin(t * w * 0.8) * rollSwing;
    ref.current.position.x = c.posX;
    ref.current.position.y =
      c.posY + Math.sin(t * 0.6) * 0.04 + spinNorm * 0.35;
    ref.current.position.z = c.posZ;
    ref.current.scale.setScalar(c.scale * (1 - spinNorm * 0.12));
  });

  const keycapGeom = useMemo(
    () =>
      createExtrudedBox(
        KEYCAP_SIZE,
        KEYCAP_SIZE,
        KEYCAP_HEIGHT,
        0.05,
        0.012,
        KEYCAP_TOP_SCALE
      ),
    []
  );
  const baseGeom = useMemo(
    () => createExtrudedBox(BASE_WIDTH, BASE_DEPTH, BASE_HEIGHT, 0.12, 0.02, 1),
    []
  );
  const hitGeom = useMemo(() => {
    const size = KEYCAP_SIZE * KEYCAP_TOP_SCALE;
    return new THREE.ShapeGeometry(makeRoundedRectShape(size, size, 0.05 * KEYCAP_TOP_SCALE));
  }, []);

  useEffect(() => {
    return () => {
      keycapGeom.dispose();
      baseGeom.dispose();
      hitGeom.dispose();
    };
  }, [keycapGeom, baseGeom, hitGeom]);

  const hoveredIcon = useMemo(() => {
    if (!hoveredKey) return null;
    const [r, c] = hoveredKey.split("-").map(Number);
    return SKILLS[r]?.[c] ?? null;
  }, [hoveredKey]);

  const keycapY = BASE_HEIGHT / 2 + KEYCAP_HEIGHT / 2 + 0.005;
  const keycaps = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = (col - (COLS - 1) / 2) * COL_SPACING;
      const z = (row - (ROWS - 1) / 2) * ROW_SPACING;
      const id = `${row}-${col}`;
      const icon = SKILLS[row][col];
      // Phase staggered by grid position so highlighted keys look like a
      // travelling wave rather than a synchronised pulse. Constants tuned
      // by eye — any non-degenerate combo works, just avoid exact multiples
      // of 2π between neighbours.
      const wavePhase = row * 0.9 + col * 0.55;
      keycaps.push(
        <Keycap
          key={id}
          geometry={keycapGeom}
          hitGeometry={hitGeom}
          position={[x, keycapY, z]}
          isMobile={isMobile}
          icon={icon}
          hovered={hoveredKey === id}
          highlightsRef={highlightsRef}
          activeSectionRef={activeSectionRef}
          wavePhase={wavePhase}
          accent={palette.accent}
          onHoverChange={(entered, touch, enteredAt) =>
            changeActiveKey(id, entered, touch, enteredAt)
          }
        />
      );
    }
  }

  return (
    <>
      <group ref={ref}>
        <mesh geometry={baseGeom}>
          {/* Solid matte plastic — color prop controls the tone directly.
              No transmission/clearcoat so the white environment doesn't
              wash it out to grey. */}
          <meshStandardMaterial
            color={palette.keyboardBase}
            roughness={0.6}
            metalness={0}
          />
        </mesh>
        {keycaps}
      </group>
      {/* Callout lives OUTSIDE the animated keyboard group so the keyboard's
          yaw/pitch/scale don't warp the text. Placed in world space, to the
          left of the tilted keyboard, with its own matching isometric yaw +
          a small roll so the baseline rises left-to-right like Naresh's. */}
      {!mobile && activeSection === "stack" && hoveredIcon && (
        <Suspense fallback={null}>
          <group
            //position={[-2.6, -0.5, 0.9]}
            position={[-1.7,0,1.5]}
            //rotation={[-0.8, Math.PI * -0.1  , Math.PI * 4.33]}
            rotation={[-1,0.2,1.03]}
          >
            {/* No <Center>: Text3D renders with its first letter anchored
                at the group's origin (X=0) and baseline at Y=0. So the first
                letter stays fixed regardless of how long the title is. */}
            <Text3D
              key={hoveredIcon.slug}
              font="/fonts/space_grotesk_bold.typeface.json"
              size={0.25}
              height={0.1}
              curveSegments={12}
              bevelEnabled={false}
            >
              {hoveredIcon.title}
              {/* Naresh-style: pure white, no emissive. All the shading
                  comes from the directional light hitting the faces — the
                  top face catches it, side walls fall into shadow, giving
                  real 3D depth instead of a flat uniform glow. */}
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.55}
                metalness={0}
              />
            </Text3D>
            <Text
              position={[0, -0.05, 0]}
              fontSize={0.12}
              color="#a6c5e4"
              anchorX="left"
              anchorY="top"
              maxWidth={2.2}
              lineHeight={1.25}
              overflowWrap="break-word"
            >
              {t(`keyboard.taglines.${hoveredIcon.slug}`)}
            </Text>
          </group>
        </Suspense>
      )}
    </>
  );
}

export default function FrozenKeyboard({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <Canvas
      // Portrait gets a pulled-back, centered, less top-down camera so the
      // keyboard reads as a front-facing hero centerpiece instead of the
      // off-axis desktop composition.
      camera={
        mobile
          ? { position: [0, 2.0, 9.0], fov: 26 }
          : { position: [1.5, 3.6, 11], fov: 22 }
      }
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      {/* Canvas is transparent so the FrozenBackground (snow + aurora) shows
          through behind/around the keyboard. */}

      {/* Local environment map built from Lightformer quads — no external
          HDR fetch, so the scene works offline. Gives the glass keycaps
          soft icy highlights without relying on drei's CDN. */}
      <Environment resolution={128} environmentIntensity={0.25}>
        <Lightformer
          intensity={1.1}
          color="#ffffff"
          position={[0, 6, -4]}
          rotation={[0, 0, 0]}
          scale={[12, 6, 1]}
        />
        <Lightformer
          intensity={0.7}
          color="#ffffff"
          position={[-6, 2, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          intensity={0.5}
          color="#ffffff"
          position={[6, 3, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          intensity={0.35}
          color="#ffffff"
          position={[0, -4, 3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 8, 1]}
        />
      </Environment>
      {/* Naresh-style lighting: low ambient + strong single directional from
          upper-left gives crisp top-bright / sides-shadowed contrast. The
          hemisphere adds a subtle sky-ground gradient so the darkest faces
          still read as "the lower faces" instead of pitch-black. */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[-5, 8, 3]} intensity={2.2} />
      <hemisphereLight
        intensity={0.25}
        color="#eaf2fb"
        groundColor="#0a1428"
      />

      <Keyboard mobile={mobile} />

    </Canvas>
  );
}

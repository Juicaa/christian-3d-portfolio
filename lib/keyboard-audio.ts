"use client";

export type KeyboardAudioStatus = "locked" | "loading" | "ready" | "muted" | "error" | "unavailable";
type AudioSnapshot = Readonly<{ enabled: boolean; status: KeyboardAudioStatus }>;
type KeyEntry = { seed: number; isCurrentEntry: () => boolean; generation: number };

const STORAGE_KEY = "portfolio-keyboard-sound";
const SOUND_URLS = ["/sounds/switch_press.mp3", "/sounds/switch_release.mp3"] as const;
const SERVER_SNAPSHOT: AudioSnapshot = { enabled: true, status: "locked" };
const listeners = new Set<() => void>();
const buffers: (AudioBuffer | null)[] = [null, null];
let snapshot = SERVER_SNAPSHOT;
let initialized = false;
let enabled = true;
let context: AudioContext | null = null;
let loading: Promise<void> | null = null;
let loaded = false;
let failed = false;
let unavailable = false;
let generation = 0;
let pendingTouch: KeyEntry | null = null;
let removeUnlockListeners: (() => void) | null = null;
let activeSound: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

export const getKeyboardAudioSnapshot = () => snapshot;
export const getKeyboardAudioServerSnapshot = () => SERVER_SNAPSHOT;
export function subscribeKeyboardAudio(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publish() {
  const status: KeyboardAudioStatus = !enabled ? "muted"
    : unavailable ? "unavailable"
    : failed ? "error"
    : context?.state !== "running" ? "locked"
    : !loaded ? "loading" : "ready";
  if (snapshot.enabled === enabled && snapshot.status === status) return;
  snapshot = { enabled, status };
  listeners.forEach((listener) => listener());
}

function savePreference() {
  try { localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off"); }
  catch { /* The in-memory preference still works without storage. */ }
}

function installAudioUnlock(ctx: AudioContext) {
  if (removeUnlockListeners || !enabled || ctx.state === "running") return;
  const events = ["pointerdown", "pointerup", "keydown", "touchend"] as const;
  const unlock = (event: Event) => {
    if (!enabled || !event.isTrusted) return;
    // The control handles its own click. Resuming on its pointerdown would
    // change its action to "mute" before that same click reaches the button.
    if (event.target instanceof Element && event.target.closest("[data-keyboard-audio-control]")) return;
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    const requestGeneration = generation;
    void ctx.resume().then(publish).catch(() => {
      if (enabled && generation === requestGeneration) { failed = true; publish(); }
    });
  };
  events.forEach((event) => window.addEventListener(event, unlock));
  removeUnlockListeners = () => {
    events.forEach((event) => window.removeEventListener(event, unlock));
    removeUnlockListeners = null;
  };
}

function loadSounds(ctx: AudioContext): Promise<void> {
  if (loading) return loading;
  loading = Promise.all(SOUND_URLS.map(async (url, index) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Keyboard sound: ${response.status}`);
      buffers[index] = await ctx.decodeAudioData(await response.arrayBuffer());
    } catch {
      // Release remains a fallback if the press sample cannot be loaded.
      buffers[index] = null;
    }
  })).then(() => {
    loaded = buffers.some((buffer) => buffer !== null);
    failed = !loaded;
    publish();
  });
  return loading;
}

function ensureContext(): AudioContext | null {
  if (context && context.state !== "closed") return context;
  removeUnlockListeners?.();
  activeSound = null;
  try {
    const Ctor = window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) { unavailable = true; publish(); return null; }
    const ctx = new Ctor();
    context = ctx;
    unavailable = false;
    ctx.addEventListener("statechange", () => {
      if (context !== ctx) return;
      if (ctx.state === "running") {
        removeUnlockListeners?.();
        const entry = pendingTouch;
        pendingTouch = null;
        if (entry) playKeyClick(entry.seed, () => entry.generation === generation && entry.isCurrentEntry());
      } else if (ctx.state === "closed") removeUnlockListeners?.();
      else if (enabled) installAudioUnlock(ctx);
      publish();
    });
    installAudioUnlock(ctx);
    return ctx;
  } catch { failed = true; publish(); return null; }
}

export function initializeKeyboardAudio() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try { enabled = localStorage.getItem(STORAGE_KEY) !== "off"; }
  catch { /* Storage is optional, browser authorization is always checked. */ }
  // A canceled touch must not play later when an unrelated gesture unlocks audio.
  window.addEventListener("pointercancel", () => { pendingTouch = null; });
  if (enabled) {
    const ctx = ensureContext();
    if (ctx) void loadSounds(ctx);
  }
  publish();
}

export function enableKeyboardAudio() {
  initializeKeyboardAudio();
  enabled = true;
  if (failed && !loaded) loading = null; // Retry failed downloads, reuse in-flight decoding.
  failed = false;
  generation++;
  pendingTouch = null;
  savePreference();
  const ctx = ensureContext();
  if (!ctx) return;
  // Called directly from the control's click/keyboard/tap, before any await.
  const resume = ctx.state === "running" ? Promise.resolve() : ctx.resume();
  installAudioUnlock(ctx);
  publish();
  const requestGeneration = generation;
  void Promise.all([resume, loadSounds(ctx)]).then(publish).catch(() => {
    if (enabled && generation === requestGeneration) { failed = true; publish(); }
  });
}

export function muteKeyboardAudio() {
  initializeKeyboardAudio();
  enabled = false;
  generation++;
  pendingTouch = null;
  removeUnlockListeners?.();
  savePreference();
  if (activeSound && context) {
    const now = context.currentTime;
    activeSound.gain.gain.cancelScheduledValues(now);
    activeSound.gain.gain.setValueAtTime(activeSound.gain.gain.value, now);
    activeSound.gain.gain.linearRampToValueAtTime(0, now + 0.005);
    activeSound.source.stop(now + 0.005);
    activeSound = null;
  }
  publish();
}

export function playKeyClick(seed: number, isCurrentEntry: () => boolean, touch = false) {
  initializeKeyboardAudio();
  if (!enabled || !isCurrentEntry()) return;
  const ctx = context;
  if (!ctx) return;
  const entryGeneration = generation;
  if (ctx.state !== "running") {
    // Hover neither authorizes audio nor queues a click to play much later.
    // A valid first tap may play once when its release unlocks the context.
    if (touch) pendingTouch = { seed, isCurrentEntry, generation: entryGeneration };
    installAudioUnlock(ctx);
    return;
  }
  const trigger = () => {
    if (!enabled || generation !== entryGeneration || !isCurrentEntry() || ctx.state !== "running") return;
    const buffer = buffers[0] ?? buffers[1];
    if (!buffer) return;
    try {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = 1 + (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.08;
      const gain = ctx.createGain();
      gain.gain.value = 0.7;
      src.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      let startAt = now;
      if (activeSound) {
        // Preserve the 5 ms transition: the previous sample stops before the
        // next starts. Distinct keys never wait for a global cooldown.
        startAt += 0.005;
        activeSound.gain.gain.cancelScheduledValues(now);
        activeSound.gain.gain.setValueAtTime(activeSound.gain.gain.value, now);
        activeSound.gain.gain.linearRampToValueAtTime(0, startAt);
        activeSound.source.stop(startAt);
      }
      activeSound = { source: src, gain };
      src.onended = () => {
        src.disconnect();
        gain.disconnect();
        if (activeSound?.source === src) activeSound = null;
      };
      src.start(startAt);
    } catch { /* Audio failure must never break the 3D scene. */ }
  };
  if (loaded) trigger();
  else void loadSounds(ctx).then(trigger);
}

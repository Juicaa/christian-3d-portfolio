import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../lib/keyboard-audio.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const flush = () => new Promise((resolve) => setImmediate(resolve));

// These checks simulate API states and races. Browser autoplay policy is tested
// separately in Chrome with its normal settings, not by these mocks.
function createAudio({ preference, slowDecode = false, noAudio = false, noStorage = false } = {}) {
  const contexts = [], sounds = [], fetches = [], decoders = [];
  const values = new Map(preference ? [["portfolio-keyboard-sound", preference]] : []);
  const events = new Map();
  const navigator = { userActivation: { isActive: false } };
  let failPress = false, failAll = false;
  class Element {
    constructor(control = false) { this.control = control; }
    closest() { return this.control ? this : null; }
  }
  class AudioContext {
    state = "suspended";
    currentTime = 1;
    destination = {};
    handlers = [];
    resumes = 0;
    constructor() { contexts.push(this); }
    addEventListener(_, handler) { this.handlers.push(handler); }
    change(state) { this.state = state; this.handlers.forEach((handler) => handler()); }
    resume() {
      this.resumes++;
      if (!navigator.userActivation.isActive && this.state !== "running") return Promise.reject(Error("Blocked"));
      this.change("running");
      return Promise.resolve();
    }
    decodeAudioData(bytes) {
      const buffer = { duration: 0.072, url: bytes.url };
      return slowDecode ? new Promise((resolve) => decoders.push(() => resolve(buffer))) : Promise.resolve(buffer);
    }
    createGain() {
      const gain = { value: 0.7, cancelScheduledValues() {}, setValueAtTime(v) { this.value = v; }, linearRampToValueAtTime(v) { this.value = v; } };
      return { gain, connect() {}, disconnect() {} };
    }
    createBufferSource() {
      const source = {
        buffer: null, playbackRate: { value: 1 }, connect() {}, disconnect() {},
        start: (time = this.currentTime) => { sounds.push({ source, time }); },
        stop: (time = this.currentTime) => { source.stopAt = time; },
      };
      return source;
    }
  }
  const window = {
    AudioContext: noAudio ? undefined : AudioContext,
    addEventListener(name, fn) { if (!events.has(name)) events.set(name, new Set()); events.get(name).add(fn); },
    removeEventListener(name, fn) { events.get(name)?.delete(fn); },
  };
  const sandboxModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: sandboxModule, exports: sandboxModule.exports, window, navigator, Element,
    localStorage: {
      getItem(key) { if (noStorage) throw Error("Storage unavailable"); return values.get(key); },
      setItem(key, value) { if (noStorage) throw Error("Storage unavailable"); values.set(key, value); },
    },
    fetch: async (url) => {
      fetches.push(url);
      return { ok: !(failAll || (failPress && url.includes("press"))), status: 404, arrayBuffer: async () => ({ url }) };
    },
  });
  const api = sandboxModule.exports;
  const gesture = (fn) => { navigator.userActivation.isActive = true; try { return fn(); } finally { navigator.userActivation.isActive = false; } };
  return {
    api, contexts, sounds, fetches, values,
    status: () => api.getKeyboardAudioSnapshot().status,
    gesture,
    dispatch: (type, control = false) => gesture(() => [...(events.get(type) ?? [])].forEach((fn) => fn({ type, isTrusted: true, target: new Element(control) }))),
    decode: async () => { decoders.forEach((resolve) => resolve()); await flush(); },
    fail: (all, press = false) => { failAll = all; failPress = press; },
  };
}

const locked = createAudio();
locked.api.initializeKeyboardAudio(); await flush();
assert.equal(locked.status(), "locked");
locked.api.playKeyClick(0, () => true);
assert.equal(locked.contexts[0].resumes, 0, "Blocked hover must not attempt authorization");
assert.equal(locked.sounds.length, 0);
locked.dispatch("pointerdown", true); await flush();
assert.equal(locked.status(), "locked", "Control pointerdown must not flip its click action");
locked.gesture(locked.api.enableKeyboardAudio); await flush();
assert.equal(locked.status(), "ready");
assert.equal(locked.sounds.length, 0, "Authorization must not flush old hover clicks");
for (const seed of [0, 1, 2]) locked.api.playKeyClick(seed, () => true);
assert.equal(locked.sounds.length, 3, "Hover works without further gestures or a global cooldown");
assert(locked.sounds.every((s) => s.source.buffer.url.endsWith("switch_press.mp3")));
for (let i = 1; i < locked.sounds.length; i++) assert(locked.sounds[i].time >= locked.sounds[i - 1].source.stopAt);
locked.api.muteKeyboardAudio();
locked.api.playKeyClick(3, () => true);
assert.equal(locked.sounds.length, 3);
assert.equal(locked.status(), "muted");
assert.equal(locked.values.get("portfolio-keyboard-sound"), "off");
console.log("PASS blocked hover, control authorization, consecutive hover, no overlap and mute");

const slow = createAudio({ slowDecode: true });
slow.api.initializeKeyboardAudio(); await flush();
slow.gesture(slow.api.enableKeyboardAudio);
assert.equal(slow.status(), "loading");
slow.api.playKeyClick(0, () => true);
slow.api.muteKeyboardAudio();
await slow.decode();
assert.equal(slow.sounds.length, 0, "Muting invalidates pending decoded audio");
assert.equal(slow.status(), "muted");
slow.gesture(slow.api.enableKeyboardAudio); await flush();
slow.api.playKeyClick(1, () => true);
assert.equal(slow.sounds.length, 1);
assert.equal(slow.fetches.length, 2, "Enabling must reuse in-flight and decoded samples");
console.log("PASS decode race, mute cancellation, unmute and buffer reuse");

const muted = createAudio({ preference: "off" });
muted.api.initializeKeyboardAudio();
muted.api.playKeyClick(0, () => true, true);
muted.dispatch("pointerup");
assert.equal(muted.contexts.length, 0, "Stored mute prevents audio initialization and touch playback");
const remembered = createAudio({ preference: "on" });
remembered.api.initializeKeyboardAudio(); await flush();
assert.equal(remembered.status(), "locked", "Stored on is not browser authorization");
console.log("PASS stored preferences do not bypass authorization");

const touch = createAudio();
touch.api.initializeKeyboardAudio(); await flush();
touch.api.playKeyClick(2, () => true, true);
touch.dispatch("pointerup"); await flush();
touch.dispatch("touchend"); await flush();
assert.equal(touch.sounds.length, 1, "First valid tap plays only once");
const canceled = createAudio();
canceled.api.initializeKeyboardAudio(); await flush();
canceled.api.playKeyClick(3, () => true, true);
canceled.dispatch("pointercancel");
canceled.dispatch("pointerdown"); await flush();
assert.equal(canceled.sounds.length, 0, "Canceled tap must not sound after an unrelated gesture");
console.log("PASS first touch release and canceled touch do not duplicate audio");

const stale = createAudio({ slowDecode: true });
stale.api.initializeKeyboardAudio(); await flush();
stale.gesture(stale.api.enableKeyboardAudio);
let current = true;
stale.api.playKeyClick(4, () => current);
current = false;
await stale.decode();
assert.equal(stale.sounds.length, 0, "Obsolete entry is silent after delayed decode");
const failed = createAudio();
failed.fail(true);
failed.api.initializeKeyboardAudio(); await flush();
assert.equal(failed.status(), "error");
failed.fail(false);
failed.gesture(failed.api.enableKeyboardAudio); await flush();
assert.equal(failed.status(), "ready");
const fallback = createAudio();
fallback.fail(false, true);
fallback.api.initializeKeyboardAudio(); await flush();
fallback.gesture(fallback.api.enableKeyboardAudio); await flush();
fallback.api.playKeyClick(5, () => true);
assert.equal(fallback.sounds.length, 1);
assert(fallback.sounds[0].source.buffer.url.endsWith("switch_release.mp3"));
console.log("PASS stale entry cancellation, failed-download retry and single-sample fallback");

const privateStorage = createAudio({ noStorage: true });
privateStorage.api.initializeKeyboardAudio(); await flush();
privateStorage.gesture(privateStorage.api.enableKeyboardAudio); await flush();
privateStorage.api.muteKeyboardAudio();
assert.equal(privateStorage.status(), "muted");
const unsupported = createAudio({ noAudio: true });
unsupported.api.initializeKeyboardAudio();
assert.equal(unsupported.status(), "unavailable");
locked.contexts[0].change("closed");
locked.gesture(locked.api.enableKeyboardAudio); await flush();
assert.equal(locked.contexts.length, 2);
assert.equal(locked.status(), "ready");
console.log("PASS unavailable storage/API and closed-context recovery");

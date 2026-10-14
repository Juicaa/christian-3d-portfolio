"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  enableKeyboardAudio,
  getKeyboardAudioServerSnapshot,
  getKeyboardAudioSnapshot,
  initializeKeyboardAudio,
  muteKeyboardAudio,
  subscribeKeyboardAudio,
} from "@/lib/keyboard-audio";

export default function KeyboardAudioControl() {
  const { t } = useLanguage();
  const { status } = useSyncExternalStore(
    subscribeKeyboardAudio,
    getKeyboardAudioSnapshot,
    getKeyboardAudioServerSnapshot
  );
  useEffect(initializeKeyboardAudio, []);
  const active = status === "ready" || status === "loading";
  const label = t(`keyboard.audio.${active ? "mute" : "enable"}`);
  const text = t(`keyboard.audio.${status === "loading" ? "loading" : active ? "on" : "enableShort"}`);

  return (
    <div className="fixed right-4 sm:right-8 z-50 pointer-events-auto" style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        data-keyboard-audio-control
        data-audio-status={status}
        data-cursor="hover"
        aria-label={label}
        aria-pressed={active}
        aria-busy={status === "loading"}
        aria-describedby="keyboard-audio-status"
        disabled={status === "unavailable"}
        title={label}
        onClick={active ? muteKeyboardAudio : enableKeyboardAudio}
        className="frost-btn !min-h-11 !py-2 !px-3 !text-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice-200 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {active ? <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
        <span>{text}</span>
      </button>
      <span id="keyboard-audio-status" className="sr-only" role="status" aria-live="polite">
        {t(`keyboard.audio.${status}`)}
      </span>
    </div>
  );
}

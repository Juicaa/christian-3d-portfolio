"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useCoarsePointer, usePageVisible, useReducedMotion } from "@/lib/browser-preferences";
import { useLanguage } from "@/components/LanguageProvider";
import KeyboardTechnologies from "@/components/KeyboardTechnologies";

const FrozenKeyboard = dynamic(() => import("@/components/FrozenKeyboard"), { ssr: false });

function supportsWebGL() {
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2");
    if (!context) return false;
    // Release the temporary capability check before creating the real Canvas.
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function KeyboardScene({ mobile = false, paused = false }: { mobile?: boolean; paused?: boolean }) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();
  const pageVisible = usePageVisible();
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!mobile);
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [attempt, setAttempt] = useState(0);
  const active = (!mobile || visible) && pageVisible && !paused;
  const onReady = useCallback((element: HTMLCanvasElement) => setCanvas(element), []);

  useEffect(() => {
    if (!mobile || !container.current) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [mobile]);

  useEffect(() => {
    if (!active || requested || failed) return;
    const load = () => {
      if (supportsWebGL()) setRequested(true);
      else setFailed(true);
    };
    if ("requestIdleCallback" in window) {
      const idle = window.requestIdleCallback(load, { timeout: 250 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = setTimeout(load, 32);
    return () => clearTimeout(timer);
  }, [active, requested, failed]);

  useEffect(() => {
    if (!canvas) return;
    const lost = (event: Event) => { event.preventDefault(); setFailed(true); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [canvas]);

  const fallback = (
    <div className={`pointer-events-auto ${mobile ? "h-full overflow-auto" : "absolute right-8 top-1/2 -translate-y-1/2 w-80 max-w-[calc(100%-4rem)]"}`}>
      <p role="status" className="mb-3 text-sm text-ice-200">{t("keyboard.unavailable")}</p>
      <KeyboardTechnologies compact />
      <button type="button" className="frost-btn !py-2 mt-3" onClick={() => {
        setFailed(false); setRequested(false); setCanvas(null); setAttempt((value) => value + 1);
      }}>{t("keyboard.retry")}</button>
    </div>
  );

  return (
    <div ref={container} className="relative h-full w-full" data-keyboard-scene data-keyboard-active={active} aria-busy={active && requested && !canvas && !failed}>
      {failed ? fallback : requested ? (
        <SceneBoundary key={attempt} fallback={fallback}>
          <FrozenKeyboard mobile={mobile} active={active} reducedMotion={reducedMotion} maxDpr={mobile || coarsePointer ? 1.5 : 2} onReady={onReady} />
        </SceneBoundary>
      ) : <span className="sr-only" role="status">{t("keyboard.loading")}</span>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePageVisible, useReducedMotion } from "@/lib/browser-preferences";

type Props = {
  media?: readonly string[];
  // Use an honest neutral state when no own public screenshots exist.
  projectNum: string;
  altPrefix?: string;
};

// Lightweight carousel: prev/next arrows, dot indicators, auto-advance with
// pause on hover. Missing media renders one neutral state, without inventing
// a screenshot gallery; real media retains the existing controls/transition.
export default function Carousel({ media, projectNum, altPrefix }: Props) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const visible = usePageVisible();
  const slides =
    media && media.length > 0
      ? media
        : // No public screenshots; keep one explicitly labeled neutral slide.
        [null];
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);

  // Auto-advance every 5s unless the user is interacting.
  useEffect(() => {
    if (paused || hovering || focused || reducedMotion || !visible || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, hovering, focused, reducedMotion, visible, slides.length]);

  const go = (delta: number) => {
    setIdx((i) => (i + delta + slides.length) % slides.length);
  };

  return (
    <div
      className="carousel"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div
        className="carousel__track"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="carousel__slide" aria-hidden={i !== idx}>
            {src ? (
              // Real screenshot
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${altPrefix ?? t("projects.screenshot")} ${i + 1}`}
                className="carousel__img"
                loading="lazy"
              />
            ) : (
              // Placeholder — each slide uses a different gradient origin so
              // they're visually distinct while the carousel is browsed.
              <div
                className="carousel__placeholder"
                style={{
                  background: `radial-gradient(circle at ${30 + i * 20}% ${
                    35 + i * 15
                  }%, var(--ice-500), transparent 55%),
                     radial-gradient(circle at ${75 - i * 10}% ${
                    65 - i * 10
                  }%, var(--ice-700), transparent 55%),
                     linear-gradient(135deg, var(--ink-2), var(--ink-0))`,
                }}
              >
                <span className="project-modal__media-num">{projectNum}</span>
                <span className="absolute bottom-5 inset-x-4 text-center text-xs uppercase tracking-widest text-ice-200">
                  {t("projects.mediaPending")}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" className="absolute top-3 right-3 z-10 frost-btn !p-2 !text-xs" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {t(paused ? "projects.resume" : "projects.pause")}
          </button>
          <button
            type="button"
            className="carousel__nav carousel__nav--prev"
            onClick={() => go(-1)}
            data-cursor="hover"
            aria-label={t("projects.previous")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            className="carousel__nav carousel__nav--next"
            onClick={() => go(1)}
            data-cursor="hover"
            aria-label={t("projects.next")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <div className="carousel__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                data-cursor="hover"
                aria-label={`${t("projects.slide")} ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
                className={`carousel__dot ${
                  i === idx ? "carousel__dot--active" : ""
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

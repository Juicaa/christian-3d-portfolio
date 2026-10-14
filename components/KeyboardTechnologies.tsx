"use client";

import { SKILLS_FLAT } from "@/lib/skills";
import { useLanguage } from "@/components/LanguageProvider";

// The same 15 technologies and descriptions remain available without hover,
// WebGL or animated text. The existing full professional catalogue stays intact.
export default function KeyboardTechnologies({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <details className="pointer-events-auto rounded-xl border border-ink-3 bg-ink-1/90 p-4 text-ice-100" open={compact || undefined}>
      <summary className="cursor-pointer text-sm font-medium">{t("keyboard.explore")}</summary>
      <ul className={`mt-4 grid gap-3 ${compact ? "grid-cols-3 text-[10px]" : "sm:grid-cols-2 lg:grid-cols-3 text-sm"}`}>
        {SKILLS_FLAT.map((skill) => (
          <li key={skill.slug} className="min-w-0">
            <span className="flex items-center gap-2 font-medium break-words">
              <svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0" fill={`#${skill.hex}`} aria-hidden="true"><path d={skill.path} /></svg>
              <span className="min-w-0 break-words">{skill.title}</span>
            </span>
            {!compact && <p className="mt-1 text-ice-300">{t(`keyboard.taglines.${skill.slug}`)}</p>}
          </li>
        ))}
      </ul>
    </details>
  );
}

"use client";

import { education, profile } from "@/content/portfolio";
import { useLanguage } from "@/components/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function EducationSection() {
  const { lang, t } = useLanguage();
  return (
    <section data-kb-section="education" className="relative p-6 sm:p-10 md:p-14 pb-24">
      <div className="text-center mb-12">
        <Reveal><h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.03em] text-ice-50 leading-[0.95]">{t("education.title")}</h2></Reveal>
        <Reveal delay={120}><p className="mt-3 text-sm sm:text-base text-ice-300">{t("education.subtitle")}</p></Reveal>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto space-y-4 pointer-events-auto">
        {education.map((item, index) => (
          <Reveal key={item.id} as="article" delay={index * 60}
            className="rounded-2xl bg-ink-1/80 backdrop-blur-md border border-ink-3 p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ice-400 mb-2">{t(`education.${item.kind}`)}</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-ice-50">{item.program[lang]}</h3>
            <p className="text-sm text-ice-300 mt-2">{item.institution}</p>
            {item.status && <p className="text-sm text-ice-100 mt-2">{item.status[lang]}</p>}
            {item.period && <p className="font-mono text-xs text-ice-400 mt-2">{item.period[lang]}</p>}
            {item.summary && <p className="text-ice-200 leading-relaxed mt-3">{item.summary[lang]}</p>}
          </Reveal>
        ))}
        <Reveal delay={200} className="rounded-2xl bg-ink-1/80 backdrop-blur-md border border-ink-3 p-5 sm:p-7">
          <h3 className="font-mono text-xs uppercase tracking-widest text-ice-400 mb-4">{t("education.languages")}</h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {profile.languages.map((language) => (
              <li key={language.name.es} className="text-sm text-ice-100">{language.name[lang]} <span className="text-ice-400">· {language.level[lang]}</span></li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

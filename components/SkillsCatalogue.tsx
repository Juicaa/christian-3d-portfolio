"use client";

import { skills, SKILL_CATEGORIES } from "@/content/skills";
import { useLanguage } from "@/components/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function SkillsCatalogue() {
  const { lang, t } = useLanguage();
  return (
    <div className="relative z-10 max-w-6xl mx-auto mt-12 pb-12 pointer-events-auto">
      <Reveal>
        <h3 className="text-2xl sm:text-3xl font-semibold text-ice-50 mb-8">
          {t("skills.catalogue")}
        </h3>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SKILL_CATEGORIES.map((category, index) => (
          <Reveal key={category.id} as="article" delay={index * 60}
            className="rounded-2xl bg-ink-1/80 backdrop-blur-md border border-ink-3 p-5 sm:p-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-ice-300 mb-5">
              {category.label[lang]}
            </h4>
            <ul className="space-y-3">
              {skills.filter((skill) => skill.category === category.id).map((skill) => (
                <li key={skill.slug} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-ink-3/50 pb-2">
                  <span className="text-sm text-ice-100">{skill.label?.[lang] ?? skill.name}</span>
                  <span className="text-[10px] text-ice-400">{t(`skills.context.${skill.context}`)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

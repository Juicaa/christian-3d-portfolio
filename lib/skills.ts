import {
  siCss,
  siDocker,
  siGit,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siOdoo,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
} from "simple-icons";
import { skills } from "@/content/skills";

export type SkillIcon = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

// Presentation adapter: icon paths/colors remain outside professional data.
const ICONS_BY_SLUG: Readonly<Record<string, SkillIcon>> = {
  javascript: siJavascript,
  typescript: siTypescript,
  html5: siHtml5,
  css: siCss,
  tailwindcss: siTailwindcss,
  python: siPython,
  react: siReact,
  nextdotjs: siNextdotjs,
  vuedotjs: siVuedotjs,
  nodedotjs: siNodedotjs,
  php: siPhp,
  odoo: siOdoo,
  postgresql: siPostgresql,
  docker: siDocker,
  git: siGit,
};

type KeyboardRow = readonly [string, string, string, string, string];

// Preserve exactly the original 3×5 order, independent of catalog ordering.
export const KEYBOARD_LAYOUT: readonly [KeyboardRow, KeyboardRow, KeyboardRow] = [
  ["javascript", "typescript", "html5", "css", "tailwindcss"],
  ["python", "react", "nextdotjs", "vuedotjs", "nodedotjs"],
  ["php", "odoo", "postgresql", "docker", "git"],
];

function resolveSkill(slug: string): SkillIcon {
  const skill = skills.find((item) => item.slug === slug);
  const icon = ICONS_BY_SLUG[slug];
  if (!skill || !icon || icon.slug !== slug) {
    throw new Error(`Missing or mismatched keyboard skill: ${slug}`);
  }
  // Keep the source icon's extra metadata (including license/source notices).
  return { ...icon, title: skill.name };
}

export const SKILLS_GRID: readonly (readonly SkillIcon[])[] = KEYBOARD_LAYOUT.map(
  (row) => row.map(resolveSkill)
);

export const SKILLS_FLAT: readonly SkillIcon[] = SKILLS_GRID.flat();

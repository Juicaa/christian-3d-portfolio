import {
  siCypress,
  siSelenium,
  siPostman,
  siBruno,
  siApachejmeter,
  siJira,
  siGit,
  siGithub,
  siGithubactions,
  siMysql,
  siJavascript,
  siPhp,
  siPython,
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
  // Self-authored browser-check and test-grid symbols. They are alternatives
  // to unavailable Playwright/Xray brand logos, not copies of those logos.
  playwright: {
    title: "Playwright", slug: "playwright", hex: "45BA4B",
    path: "M2 3h20v18H2V3zm2 2v2h16V5H4zm0 4v10h16V9H4zm3 5 2-2 2 2 5-5 2 2-7 7-4-4z",
  },
  xray: {
    title: "Xray", slug: "xray", hex: "38BDF8",
    path: "M2 2h9v9H2V2zm2 2v5h5V4H4zm9-2h9v9h-9V2zm2 2v5h5V4h-5zM2 13h9v9H2v-9zm2 2v5h5v-5H4zm10 2 2-2 2 2 4-4 2 2-6 6-4-4z",
  },
  cypress: siCypress,
  selenium: siSelenium,
  postman: siPostman,
  bruno: siBruno,
  apachejmeter: siApachejmeter,
  jira: siJira,
  github: siGithub,
  githubactions: siGithubactions,
  mysql: siMysql,
  javascript: siJavascript,
  python: siPython,
  php: siPhp,
  git: siGit,
};

type KeyboardRow = readonly [string, string, string, string, string];

// Same 3×5 geometry; only the configured technology symbols change.
export const KEYBOARD_LAYOUT: readonly [KeyboardRow, KeyboardRow, KeyboardRow] = [
  ["playwright", "cypress", "selenium", "postman", "bruno"],
  ["apachejmeter", "jira", "xray", "git", "github"],
  ["githubactions", "mysql", "php", "javascript", "python"],
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

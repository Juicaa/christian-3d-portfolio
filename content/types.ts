// Content contracts are independent of React, Next.js and the icon renderer.
export type Locale = "es" | "en";
export type Localized<T = string> = Readonly<Record<Locale, T>>;

export type SkillSlug = string;
export type ProjectSectionId = `project${number}`;
export type SectionId = "hero" | "stack" | "experience" | "education" | "contact" | ProjectSectionId;
export type ProjectAlignment = "left" | "right";

export type Profile = {
  fullName: string;
  displayName: string;
  heroName: { firstLine: string; secondLine: string };
  role: Localized;
  tagline: Localized;
  availability: Localized;
  email: string;
  links: { github: string; linkedin: string; repository: string };
  cv: Localized;
  cvLabel: Localized;
  languages: readonly { name: Localized; level: Localized }[];
  contactBody: Localized;
  footer: Localized;
  seo: {
    title: string;
    description: string;
    socialDescription: string;
    locale: string;
  };
};

export type Experience = {
  id: string;
  role: Localized;
  company: string;
  period: Localized;
  location?: Localized;
  summary: Localized;
  bullets: readonly Localized[];
  stack: readonly string[];
};

export type Education = {
  id: string;
  institution: string;
  program: Localized;
  period?: Localized;
  status?: Localized;
  summary?: Localized;
  kind: "degree" | "course" | "participation";
};

export type SkillCategory = "qa" | "api" | "performance" | "management" | "cicd" | "development";
export type SkillContext = "professional" | "practice" | "learning";

export type Skill = {
  // Canonical ID shared by project highlights, i18n and the keyboard adapter.
  slug: SkillSlug;
  name: string;
  label?: Localized;
  tagline: Localized;
  category: SkillCategory;
  context: SkillContext;
};

// Preserves the modal's existing field names and optional resource contract.
export type ProjectDetail = {
  num: string;
  name: Localized;
  stack: readonly string[];
  desc: Localized;
  details: Localized;
  url?: string;
  github?: string;
  badge?: Localized;
  highlights?: readonly SkillSlug[];
  media?: readonly string[];
};

export type Project = ProjectDetail & {
  id: string;
  align: ProjectAlignment;
  section: ProjectSectionId;
};

export type Portfolio = {
  profile: Profile;
  experiences: readonly Experience[];
  education: readonly Education[];
  skills: readonly Skill[];
  projects: readonly Project[];
};

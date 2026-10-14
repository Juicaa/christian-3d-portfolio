import { projects } from "@/content/projects";
import type { Project, SectionId } from "@/content/types";

export type PortfolioSection = {
  id: SectionId;
  labelKey: "nav.home" | "nav.stack" | "nav.experience" | "nav.education" | "nav.project" | "nav.contact";
  num?: string;
};

// IDs remain stable; adding a project updates navigation and observed targets.
export function getPortfolioSections(items: readonly Project[]): readonly PortfolioSection[] {
  return [
    { id: "hero", labelKey: "nav.home" },
    { id: "stack", labelKey: "nav.stack" },
    { id: "experience", labelKey: "nav.experience" },
    { id: "education", labelKey: "nav.education" },
    ...items.map((project) => ({
      id: project.section,
      labelKey: "nav.project" as const,
      num: project.num,
    })),
    { id: "contact", labelKey: "nav.contact" },
  ];
}

export const PORTFOLIO_SECTIONS = getPortfolioSections(projects);

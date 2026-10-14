import { profile } from "./profile";
import { experiences } from "./experience";
import { education } from "./education";
import { skills } from "./skills";
import { projects } from "./projects";
import type { Portfolio } from "./types";

export { profile, experiences, education, skills, projects };
export type * from "./types";

export const portfolio: Portfolio = {
  profile,
  experiences,
  education,
  skills,
  projects,
};

import type { Education } from "./types";

// No education section exists in the current page. Do not infer records from
// CV PDFs or add visible content during this extraction-only phase.
export const education: readonly Education[] = [];

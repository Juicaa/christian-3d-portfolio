# Christian Juica — 3D QA Portfolio

Professional portfolio of Christian Maximo Juica Alarcon, Systems Engineering
student at Universidad Nacional de Cañete, Peru. Focus: QA Engineering,
Test Automation and API Testing, with academic software development projects.

- Interactive 3D keyboard: 15 QA/development tools, hover/touch and sound.
- Four seasonal themes, ES/EN, smooth scroll, reveals and project modals.
- Two experience records, education/courses, categorized skills and three
  academic projects. No invented metrics, certifications or clinical validation.
- Both language variants download the owner's Spanish CV at /cv.pdf; the
  English button explicitly says “Download CV (Spanish)”.

## Development

Use Node 24.x (declared in package.json, .nvmrc and .node-version). Docker and
Vercel use the same major; exact patches are managed by each environment.

~~~bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run validate:content
npm run build
npm start
~~~

On Windows PowerShell use npm.cmd if npm.ps1 is blocked by execution policy.

## Content and architecture

Professional data lives in content/. See [content/README.md](content/README.md)
for models, adapters, section IDs, adding projects and bilingual content.
The 3D scene remains in components/FrozenKeyboard.tsx. lib/skills.ts connects
professional slugs to graphic assets while retaining the 3×5 geometry.

Public repositories:

- [2025 inventory project](https://github.com/Juicaa/BOTICA)
- [2026 academic thesis](https://github.com/Juicaa/Botica-bienestar-devops)
- [Portfolio](https://github.com/Juicaa/christian-3d-portfolio)

The virtual classroom project has a supplied repository URL that currently
returns 404 publicly; its card does not offer a broken link. Missing own
screenshots use a clearly labeled neutral state. Previous screenshots are
preserved in archive/original-projects/ and are not publicly served.

See [PERSONALIZATION_REVIEW.md](PERSONALIZATION_REVIEW.md) for CV discrepancies,
source evidence and pending confirmation. No corporate endpoints or client
materials are included. No production or clinical deployment is claimed.

## Deployment

Next.js App Router is prepared for Vercel. Import this repository, use Node
24.x, validate a preview, then configure the personal domain and DNS in Vercel.
A custom domain has not been configured. The Dockerfile remains an alternative
standalone deployment; no Docker build is claimed in this phase.

## Attribution and licenses

The base code derives from the MIT-licensed Txemalon/3d-portfolio by Jose Maria
Albero Belamendia. [LICENSE](LICENSE) remains unchanged. This attribution is
retained for code provenance; the professional content belongs to Christian.
Read [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for brand/font notices,
self-authored replacement symbols and unresolved sound/font provenance.

Security/runtime work is recorded in [TECHNICAL_BASELINE.md](TECHNICAL_BASELINE.md)
and [DEPENDENCY_CHANGES.md](DEPENDENCY_CHANGES.md). The development-only braces
advisory remains a tracked risk from phase 1.

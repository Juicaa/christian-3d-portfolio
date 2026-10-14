import type { Experience } from "./types";

export const experiences: readonly Experience[] = [
  {
    id: "activalink-tech-lead",
    role: { es: "Tech Lead", en: "Tech Lead" },
    company: "Activalink",
    period: { es: "2023 — Presente", en: "2023 — Present" },
    location: { es: "Alcoy, España", en: "Alcoy, Spain" },
    summary: {
      es: "Activalink implementa y adapta ERPs para pymes y grandes empresas. Desarrollo módulos y personalizaciones custom sobre Odoo, integraciones a medida y proyectos de implantación llave en mano. Lidero un equipo de 3 desarrolladores: nuestro trabajo se mide en tiempo ahorrado y errores evitados.",
      en: "Activalink implements and customises ERPs for SMBs and large companies. I build custom modules and personalisations on top of Odoo, bespoke integrations, and end-to-end implementation projects. I lead a team of 3 developers: our work is measured in time saved and errors avoided.",
    },
    bullets: [
      {
        es: "OCR de facturas en Odoo — de 4 h/día a 30 min (−87 %).",
        en: "Invoice OCR in Odoo — from 4 h/day down to 30 min (−87 %).",
      },
      {
        es: "Logística con mapa interactivo — −60 % errores de seguimiento.",
        en: "Interactive logistics map — −60 % tracking errors.",
      },
      {
        es: "Conciliación automática — cierre contable de 3 días a medio día.",
        en: "Automated reconciliation — monthly close from 3 days to half a day.",
      },
      {
        es: "Dashboards financieros — detección temprana de facturas sin emitir.",
        en: "Financial dashboards — early detection of uninvoiced orders.",
      },
    ],
    stack: ["Odoo", "Python", "PostgreSQL", "Next.js", "TypeScript", "Docker"],
  },
];

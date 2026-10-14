import type { Education } from "./types";

export const education: readonly Education[] = [
  {
    "id": "undc-systems-engineering",
    "institution": "Universidad Nacional de Cañete · Perú",
    "program": {
      "es": "Ingeniería de Sistemas",
      "en": "Systems Engineering"
    },
    "status": {
      "es": "Estudiante de X ciclo",
      "en": "Tenth-semester student"
    },
    "kind": "degree"
  },
  {
    "id": "cisco-cybersecurity",
    "institution": "Cisco",
    "program": {
      "es": "Introduction to Cybersecurity",
      "en": "Introduction to Cybersecurity"
    },
    "kind": "course"
  },
  {
    "id": "infopucp-python",
    "institution": "INFOPUCP",
    "program": {
      "es": "Introducción a Python para Machine Learning",
      "en": "Introduction to Python for Machine Learning"
    },
    "kind": "course"
  },
  {
    "id": "infopucp-sql",
    "institution": "INFOPUCP",
    "program": {
      "es": "SQL Server: Implementación de Base de Datos",
      "en": "SQL Server: Database Implementation"
    },
    "kind": "course"
  },
  {
    "id": "cade-universitario-2026",
    "institution": "CADE Universitario",
    "program": {
      "es": "CADE Universitario 2026",
      "en": "CADE Universitario 2026"
    },
    "status": {
      "es": "Participación",
      "en": "Participation"
    },
    "kind": "participation"
  }
];

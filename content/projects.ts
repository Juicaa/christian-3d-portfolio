import type { Project } from "./types";

export const projects: readonly Project[] = [
  {
    "id": "gestion-inventario-academico",
    "num": "01",
    "section": "project1",
    "align": "left",
    "name": {
      "es": "Sistema Web de Gestión e Inventario",
      "en": "Web Management and Inventory System"
    },
    "badge": {
      "es": "Proyecto académico aplicado · 2025",
      "en": "Applied academic project · 2025"
    },
    "stack": [
      "PHP",
      "MySQL",
      "JavaScript",
      "SQL",
      "Git",
      "Functional Testing"
    ],
    "desc": {
      "es": "Proyecto académico aplicado con participación en pruebas funcionales, diseño de casos de prueba y validación de ventas, reportes y consistencia de datos.",
      "en": "An applied academic project involving functional testing, test case design, and validation of sales, reports and data consistency."
    },
    "details": {
      "es": "En este proyecto académico participé en la ejecución de pruebas funcionales sobre módulos de registro, ventas y reportes, y en el diseño de casos de prueba basados en requerimientos.\n\nRealicé pruebas exploratorias, documenté defectos y validé consultas y consistencia de datos mediante SQL básico. El trabajo colaborativo y el control de cambios se gestionaron mediante Git.",
      "en": "In this academic project, I contributed to functional testing of registration, sales and reporting modules, and to requirements-based test case design.\n\nI performed exploratory testing, documented defects, and validated queries and data consistency using basic SQL. Collaboration and change tracking were managed with Git."
    },
    "highlights": [
      "php",
      "mysql",
      "javascript",
      "git",
      "github"
    ],
    "media": [],
    "github": "https://github.com/Juicaa/BOTICA"
  },
  {
    "id": "tesis-inventario-farmaceutico",
    "num": "02",
    "section": "project2",
    "align": "right",
    "name": {
      "es": "Inventario farmacéutico y sistema experto",
      "en": "Pharmaceutical Inventory and Expert System"
    },
    "badge": {
      "es": "Tesis académica · En desarrollo",
      "en": "Academic thesis · In development"
    },
    "stack": [
      "PHP",
      "MySQL",
      "Inventory Management",
      "Business Rules"
    ],
    "github": "https://github.com/Juicaa/Botica-bienestar-devops",
    "desc": {
      "es": "Aplicación web de inventario con sistema experto de restricción de medicamentos con interacciones adversas. Proyecto de tesis académica en desarrollo.",
      "en": "A web inventory application with an expert system for restricting medicines with adverse interactions. An academic thesis project in development."
    },
    "details": {
      "es": "Proyecto de tesis: aplicación web de inventario con sistema experto de restricción de medicamentos con interacciones adversas.\n\nEl alcance académico contempla gestión de medicamentos e inventario, lotes, compras y ventas, reglas de interacción, roles y permisos, auditoría y reportes. Las tecnologías declaradas son PHP y MySQL.\n\nEl sistema experto está en desarrollo académico y no se presenta como una solución clínicamente validada.",
      "en": "Thesis project: a web inventory application with an expert system for restricting medicines with adverse interactions.\n\nThe academic scope covers medicine and inventory management, batches, purchases and sales, interaction rules, roles and permissions, auditing and reports. The declared technologies are PHP and MySQL.\n\nThe expert system is under academic development and is not presented as a clinically validated solution."
    },
    "highlights": [
      "php",
      "mysql",
      "github"
    ],
    "media": []
  },
  {
    "id": "av-mater-chirsti",
    "num": "03",
    "section": "project3",
    "align": "left",
    "name": {
      "es": "AV-MATER-CHIRSTI",
      "en": "AV-MATER-CHIRSTI"
    },
    "badge": {
      "es": "Proyecto colaborativo académico",
      "en": "Collaborative academic project"
    },
    "stack": [
      "Software Development",
      "Academic Collaboration"
    ],
    "desc": {
      "es": "Aula virtual institucional orientada a gestionar procesos académicos, contenidos y actividades educativas, desarrollada como proyecto colaborativo académico.",
      "en": "An institutional virtual classroom intended to support academic processes, learning content and educational activities, developed as a collaborative academic project."
    },
    "details": {
      "es": "Participación en un proyecto colaborativo académico de aula virtual institucional. Su propósito es apoyar la organización de procesos académicos, contenidos y actividades educativas.\n\nSe presenta en su contexto académico, sin afirmar que está desplegado en producción ni que todos sus módulos están terminados.",
      "en": "Participation in a collaborative academic project for an institutional virtual classroom. Its purpose is to support the organization of academic processes, learning content and educational activities.\n\nIt is presented in its academic context, without claiming a production deployment or completion of every module."
    },
    "highlights": [],
    "media": []
  }
];

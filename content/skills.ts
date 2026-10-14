import type { Localized, Skill, SkillCategory } from "./types";

export const SKILL_CATEGORIES: readonly { id: SkillCategory; label: Localized }[] = [
  {
    "id": "qa",
    "label": {
      "es": "QA Automation",
      "en": "QA Automation"
    }
  },
  {
    "id": "api",
    "label": {
      "es": "API Testing",
      "en": "API Testing"
    }
  },
  {
    "id": "performance",
    "label": {
      "es": "Performance Testing",
      "en": "Performance Testing"
    }
  },
  {
    "id": "management",
    "label": {
      "es": "Gestión de pruebas",
      "en": "Test Management"
    }
  },
  {
    "id": "cicd",
    "label": {
      "es": "CI/CD y control de versiones",
      "en": "CI/CD & Version Control"
    }
  },
  {
    "id": "development",
    "label": {
      "es": "Desarrollo y bases de datos",
      "en": "Development & Databases"
    }
  }
];

export const skills: readonly Skill[] = [
  {
    "slug": "playwright",
    "name": "Playwright",
    "category": "qa",
    "context": "practice",
    "tagline": {
      "es": "Práctica local de automatización de escenarios web y pruebas End-to-End.",
      "en": "Local practice automating web scenarios and end-to-end tests."
    }
  },
  {
    "slug": "cypress",
    "name": "Cypress",
    "category": "qa",
    "context": "practice",
    "tagline": {
      "es": "Práctica de automatización funcional y de regresión en aplicaciones web.",
      "en": "Practice automating functional and regression tests for web applications."
    }
  },
  {
    "slug": "selenium",
    "name": "Selenium",
    "category": "qa",
    "context": "practice",
    "tagline": {
      "es": "Práctica de automatización web con Selenium WebDriver.",
      "en": "Web automation practice with Selenium WebDriver."
    }
  },
  {
    "slug": "end-to-end",
    "name": "End-to-End Testing",
    "category": "qa",
    "context": "professional",
    "tagline": {
      "es": "Validación de flujos completos y escenarios críticos de usuario.",
      "en": "Validation of complete workflows and critical user scenarios."
    }
  },
  {
    "slug": "functional-testing",
    "name": "Functional Testing",
    "category": "qa",
    "context": "professional",
    "tagline": {
      "es": "Pruebas basadas en requerimientos y criterios de aceptación.",
      "en": "Testing based on requirements and acceptance criteria."
    }
  },
  {
    "slug": "regression-testing",
    "name": "Regression Testing",
    "category": "qa",
    "context": "professional",
    "tagline": {
      "es": "Verificación de funcionalidades después de los cambios.",
      "en": "Verification of functionality after changes."
    }
  },
  {
    "slug": "smoke-testing",
    "name": "Smoke Testing",
    "category": "qa",
    "context": "professional",
    "tagline": {
      "es": "Validación inicial de flujos esenciales antes de ampliar la cobertura.",
      "en": "Initial validation of essential workflows before expanding coverage."
    }
  },
  {
    "slug": "postman",
    "name": "Postman",
    "category": "api",
    "context": "professional",
    "tagline": {
      "es": "Validación de APIs REST, respuestas HTTP y reglas de negocio.",
      "en": "Validation of REST APIs, HTTP responses and business rules."
    }
  },
  {
    "slug": "bruno",
    "name": "Bruno",
    "category": "api",
    "context": "professional",
    "tagline": {
      "es": "Pruebas de servicios backend mediante colecciones de solicitudes.",
      "en": "Backend service testing with request collections."
    }
  },
  {
    "slug": "rest-apis",
    "name": "REST APIs",
    "category": "api",
    "context": "professional",
    "tagline": {
      "es": "Validación funcional de servicios y sus respuestas.",
      "en": "Functional validation of services and their responses."
    }
  },
  {
    "slug": "api-contracts",
    "name": "Validación de contratos",
    "category": "api",
    "context": "professional",
    "tagline": {
      "es": "Verificación de estructuras y contratos de APIs.",
      "en": "Verification of API structures and contracts."
    },
    "label": {
      "es": "Validación de contratos",
      "en": "Contract Validation"
    }
  },
  {
    "slug": "http-responses",
    "name": "Respuestas HTTP",
    "category": "api",
    "context": "professional",
    "tagline": {
      "es": "Verificación de códigos de estado y manejo de errores.",
      "en": "Verification of status codes and error handling."
    },
    "label": {
      "es": "Respuestas HTTP",
      "en": "HTTP Responses"
    }
  },
  {
    "slug": "business-rules",
    "name": "Reglas de negocio",
    "category": "api",
    "context": "professional",
    "tagline": {
      "es": "Comprobación del comportamiento esperado según requerimientos.",
      "en": "Checking expected behavior against requirements."
    },
    "label": {
      "es": "Reglas de negocio",
      "en": "Business Rules"
    }
  },
  {
    "slug": "apachejmeter",
    "name": "JMeter",
    "category": "performance",
    "context": "professional",
    "tagline": {
      "es": "Ejecución de pruebas básicas de carga y análisis de tiempos de respuesta.",
      "en": "Execution of basic load tests and response-time analysis."
    }
  },
  {
    "slug": "load-testing",
    "name": "Pruebas de carga",
    "category": "performance",
    "context": "professional",
    "tagline": {
      "es": "Ejecución y revisión de escenarios de carga.",
      "en": "Execution and review of load scenarios."
    },
    "label": {
      "es": "Pruebas de carga",
      "en": "Load Testing"
    }
  },
  {
    "slug": "response-times",
    "name": "Tiempos de respuesta",
    "category": "performance",
    "context": "professional",
    "tagline": {
      "es": "Análisis de tiempos de respuesta en escenarios de prueba.",
      "en": "Response-time analysis in test scenarios."
    },
    "label": {
      "es": "Tiempos de respuesta",
      "en": "Response Times"
    }
  },
  {
    "slug": "basic-performance",
    "name": "Rendimiento básico",
    "category": "performance",
    "context": "practice",
    "tagline": {
      "es": "Práctica de pruebas básicas de rendimiento.",
      "en": "Practice with basic performance tests."
    },
    "label": {
      "es": "Rendimiento básico",
      "en": "Basic Performance Testing"
    }
  },
  {
    "slug": "jira",
    "name": "Jira",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Documentación, seguimiento y gestión de incidencias de software.",
      "en": "Documentation, tracking and management of software issues."
    }
  },
  {
    "slug": "xray",
    "name": "Xray",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Gestión de casos de prueba y trazabilidad de ejecuciones.",
      "en": "Test case management and execution traceability."
    }
  },
  {
    "slug": "test-case-design",
    "name": "Test Case Design",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Diseño de casos de prueba a partir de requerimientos.",
      "en": "Designing test cases from requirements."
    }
  },
  {
    "slug": "bug-tracking",
    "name": "Bug Tracking",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Seguimiento de incidencias y evidencia de reproducción.",
      "en": "Issue tracking and reproduction evidence."
    }
  },
  {
    "slug": "defect-management",
    "name": "Defect Management",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Documentación de defectos, seguimiento y retesting.",
      "en": "Defect documentation, tracking and retesting."
    }
  },
  {
    "slug": "scrum",
    "name": "Scrum",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Colaboración en equipos y ciclos de trabajo ágiles.",
      "en": "Collaboration in agile teams and work cycles."
    }
  },
  {
    "slug": "agile-testing",
    "name": "Agile Testing",
    "category": "management",
    "context": "professional",
    "tagline": {
      "es": "Validación continua y colaboración con desarrollo.",
      "en": "Continuous validation and collaboration with development."
    }
  },
  {
    "slug": "git",
    "name": "Git",
    "category": "cicd",
    "context": "professional",
    "tagline": {
      "es": "Control de versiones y colaboración en cambios de código.",
      "en": "Version control and collaboration on code changes."
    }
  },
  {
    "slug": "github",
    "name": "GitHub",
    "category": "cicd",
    "context": "professional",
    "tagline": {
      "es": "Repositorios, revisión de cambios y trabajo colaborativo.",
      "en": "Repositories, change reviews and collaborative work."
    }
  },
  {
    "slug": "githubactions",
    "name": "GitHub Actions",
    "category": "cicd",
    "context": "practice",
    "tagline": {
      "es": "Práctica de flujos automatizados y conceptos de integración continua.",
      "en": "Practice with automated workflows and continuous integration concepts."
    }
  },
  {
    "slug": "cicd",
    "name": "CI/CD",
    "category": "cicd",
    "context": "learning",
    "tagline": {
      "es": "Conceptos y prácticas de integración y entrega continua.",
      "en": "Continuous integration and delivery concepts and practices."
    }
  },
  {
    "slug": "collaborative-workflows",
    "name": "Flujos colaborativos",
    "category": "cicd",
    "context": "professional",
    "tagline": {
      "es": "Organización de cambios y colaboración mediante repositorios.",
      "en": "Organizing changes and collaborating through repositories."
    },
    "label": {
      "es": "Flujos colaborativos",
      "en": "Collaborative Workflows"
    }
  },
  {
    "slug": "php",
    "name": "PHP",
    "category": "development",
    "context": "practice",
    "tagline": {
      "es": "Desarrollo aplicado en proyectos web académicos.",
      "en": "Applied development in academic web projects."
    }
  },
  {
    "slug": "mysql",
    "name": "MySQL",
    "category": "development",
    "context": "practice",
    "tagline": {
      "es": "Bases de datos para proyectos de gestión e inventario.",
      "en": "Databases for management and inventory projects."
    }
  },
  {
    "slug": "sql",
    "name": "SQL",
    "category": "development",
    "context": "practice",
    "tagline": {
      "es": "Consultas básicas y validación de consistencia de datos.",
      "en": "Basic queries and data consistency validation."
    }
  },
  {
    "slug": "javascript",
    "name": "JavaScript",
    "category": "development",
    "context": "practice",
    "tagline": {
      "es": "Uso aplicado en funcionalidades e interfaces web.",
      "en": "Applied use in web functionality and interfaces."
    }
  },
  {
    "slug": "python",
    "name": "Python",
    "category": "development",
    "context": "learning",
    "tagline": {
      "es": "Formación y uso aplicado, incluido Python para Machine Learning.",
      "en": "Education and applied use, including Python for Machine Learning."
    }
  }
];

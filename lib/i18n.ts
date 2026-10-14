import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import type { Locale } from "@/content/types";

// Generic UI translations plus compatibility adapters for professional copy.
// Profile/skill values live only in content/; existing dot-path consumers keep
// using useLanguage().t() with the same ES/EN strings and keys.
export type Lang = Locale;

export const LANGUAGES: Lang[] = ["es", "en"];
export const DEFAULT_LANG: Lang = "es";

type Leaf = Record<Lang, string>;
type Node = Leaf | { [key: string]: Node };

function isLeaf(node: Node): node is Leaf {
  return typeof (node as Leaf).es === "string";
}

export const DICT = {
  picker: {
    season: { es: "Estación", en: "Season" },
    language: { es: "Idioma", en: "Language" },
  },
  seasons: {
    spring: { es: "Primavera", en: "Spring" },
    summer: { es: "Verano", en: "Summer" },
    autumn: { es: "Otoño", en: "Autumn" },
    winter: { es: "Invierno", en: "Winter" },
  },
  nav: {
    aria: { es: "Secciones", en: "Sections" },
    home: { es: "Inicio", en: "Home" },
    stack: { es: "Stack", en: "Stack" },
    experience: { es: "Experiencia", en: "Experience" },
    education: { es: "Formación", en: "Education" },
    project: { es: "Proyecto", en: "Project" },
    contact: { es: "Contacto", en: "Contact" },
  },
  header: {
    availability: profile.availability,
  },
  hero: {
    greeting: { es: "Hola, soy", en: "Hi, I am" },
    roleLine: profile.role,
    tagline: profile.tagline,
    cv: profile.cvLabel,
    hire: { es: "Contactarme", en: "Contact me" },
    scroll: { es: "Scroll para explorar", en: "Scroll to explore" },
    keysHint: {
      es: "· hover sobre las teclas",
      en: "· hover over the keys",
    },
  },
  stack: {
    title: { es: "QA & Tech Stack", en: "QA & Tech Stack" },
    hint: {
      es: "(hint: pasa el ratón por una tecla)",
      en: "(hint: hover over a key)",
    },
    hintMobile: {
      es: "Herramientas, prácticas y formación en calidad de software.",
      en: "Tools, practice and education in software quality.",
    },
  },
  experience: {
    title: { es: "Experiencia", en: "Experience" },
    subtitle: {
      es: "Mi trayectoria profesional.",
      en: "My professional journey.",
    },
  },
  skills: {
    catalogue: { es: "Herramientas y prácticas", en: "Tools & Practice" },
    context: {
      professional: { es: "Uso profesional", en: "Professional use" },
      practice: { es: "Práctica en proyectos", en: "Project practice" },
      learning: { es: "Formación", en: "Education" },
    },
  },
  education: {
    title: { es: "Formación", en: "Education" },
    subtitle: { es: "Formación universitaria y aprendizaje continuo.", en: "University education and continuous learning." },
    degree: { es: "Formación universitaria", en: "University education" },
    course: { es: "Curso", en: "Course" },
    participation: { es: "Participación", en: "Participation" },
    languages: { es: "Idiomas", en: "Languages" },
  },
  projects: {
    kicker: { es: "proyecto", en: "project" },
    viewMore: { es: "Ver más", en: "View more" },
    openSite: { es: "Abrir sitio", en: "Visit site" },
    viewCode: { es: "Ver código", en: "View code" },
    close: { es: "Cerrar", en: "Close" },
    stackLabel: { es: "Stack", en: "Stack" },
    overview: { es: "Resumen", en: "Overview" },
    mediaPending: { es: "Sin capturas públicas", en: "No public screenshots" },
    previous: { es: "Anterior", en: "Previous" },
    next: { es: "Siguiente", en: "Next" },
    slide: { es: "Imagen", en: "Image" },
    screenshot: { es: "Captura", en: "Screenshot" },
  },
  contact: {
    kicker: { es: "contacto", en: "contact" },
    title: { es: "¿Hablamos?", en: "Let's talk?" },
    body: profile.contactBody,
    copyEmail: { es: "Copiar email", en: "Copy email" },
    openMail: { es: "Abrir mail", en: "Open mailto" },
    github: { es: "GitHub", en: "GitHub" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    emailToast: { es: "Email copiado", en: "Email copied" },
    footer: profile.footer,
  },
  keyboard: {
    taglines: Object.fromEntries(skills.map((skill) => [skill.slug, skill.tagline])),
  },
} as const satisfies Record<string, Node>;

// Resolve a dotted path in the dictionary for a given language.
export function translate(path: string, lang: Lang): string {
  const parts = path.split(".");
  let ref: Node = DICT as unknown as Node;
  for (const p of parts) {
    if (isLeaf(ref)) return path;
    ref = (ref as { [key: string]: Node })[p];
    if (ref === undefined) return path;
  }
  if (isLeaf(ref)) return ref[lang] ?? ref.es ?? path;
  return path;
}

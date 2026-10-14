# Contenido del portafolio

Los archivos de este directorio contienen los datos de Christian Juica desde
la fase 3. No contienen componentes ni imports de React, Next.js o Simple Icons.
`portfolio.ts` exporta el conjunto y sus partes; los contratos están en `types.ts`.

| Archivo | Datos |
| --- | --- |
| profile.ts | Identidad, presentación ES/EN, disponibilidad, correo, redes, CV, contacto, footer y SEO |
| experience.ts | Experiencias con ID estable, periodos, textos ES/EN, resultados y tecnologías |
| education.ts | UNDC, tres cursos y participación en CADE Universitario 2026 |
| skills.ts | Catálogo por categorías, contexto de uso, slugs y descripciones ES/EN |
| projects.ts | IDs, números, secciones, textos ES/EN, tecnologías, highlights, medios y enlaces |

`Localized<T>` requiere ambos idiomas. Se preservan las cadenas existentes,
incluidas las fechas escritas como texto; no se reinterpretan durante esta fase.
Los metadatos y enlaces corresponden al perfil actual. No se han añadido URLs
localizadas. Ambos idiomas descargan el CV español con indicación explícita
en inglés; no existe un enlace funcional al CV inglés del autor anterior.

## Flujo de datos

- `app/page.tsx` consume perfil, experiencias y proyectos desde `portfolio.ts`;
  `EducationSection` consume formación e idiomas.
- `app/layout.tsx` consume el perfil para identidad y metadatos.
- `lib/i18n.ts` mantiene etiquetas genéricas y adapta los campos del perfil y
  del catálogo a las claves existentes (`hero.roleLine`, `contact.footer`,
  `keyboard.taglines.<slug>`, etc.). No duplica sus textos profesionales.
- `lib/skills.ts` resuelve los nombres del catálogo hacia iconos y conserva la
  disposición 3×5. El catálogo puede crecer sin cambiar esa disposición.
- `lib/sections.ts` genera navegación y objetivos de observación desde los
  proyectos; el teclado les asigna las poses originales según `align`.
- El modal y el carrusel aceptan los mismos campos de proyecto e imágenes,
  ahora con contratos compartidos y arrays readonly.

## Añadir contenido posteriormente

Para añadir una experiencia, editar `experience.ts`: usar un ID único y aportar
ambas traducciones. La página recorre la colección sin cambios de componentes.

Para añadir un proyecto, editar `projects.ts` y aportar las capturas:

1. `id`, `num` y `section` deben ser únicos. Mantener `section` con formato
   `projectN`, siendo N un entero positivo: también lo utiliza el giro 3D.
2. Conservar los IDs de proyectos existentes al reordenarlos.
3. `align: left/right` determina presentación y pose; las poses se asignan
   automáticamente. Navegación y secciones observadas se generan de los datos.
4. `highlights` solo debe contener slugs presentes en las 15 teclas. `stack`
   puede mencionar otras tecnologías; no todas necesitan una tecla.
5. `url`, `github`, `badge`, `media` y `highlights` siguen siendo opcionales.
   Las rutas locales de medios y CV se resuelven desde `public/`.

No hace falta editar la página, el modal, la navegación y el mapa de poses para
añadir proyectos. Para sustituir una tecnología representada en el teclado,
su recurso gráfico y su posición requieren una decisión explícita en el
adaptador visual; cambiar una descripción solo requiere `skills.ts`.

## Validación

```bash
npm run typecheck
npm run lint
npm run validate:content
npm run build
```

La validación comprueba IDs, slugs, ES/EN, categorías, contexto de habilidades,
las 15 posiciones solicitadas, highlights, navegación y poses, identidad del
PDF, idioma de descarga y ausencia de datos profesionales anteriores.
También comprueba en memoria que un proyecto adicional recibe navegación y
pose sin guardarlo. No usa igualdad con los datos del autor anterior.
Las licencias y pendientes de procedencia siguen documentados en
`THIRD_PARTY_NOTICES.md`; los avisos de desarrollo de la fase 1 no se resuelven
con esta reorganización.

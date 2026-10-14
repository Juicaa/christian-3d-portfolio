# Revisión de contenido — Christian Juica

Fecha: 14 de octubre de 2026. Rama: feat/portfolio-christian.
Fuentes: instrucciones del titular, CV aportado y revisión de repositorios
públicos. No se modificó el PDF ni se publicó información corporativa interna.

## CV comprobado

- `public/cv.pdf`: PDF 1.4, cabecera, objetos, tablas ToUnicode, contenido textual
  y marcador EOF legibles. Identidad: Christian Maximo Juica Alarcon.
- SHA-256: `f66834845ea6e9dfe793266654b5dc2917b542f486f782c0d071a9752aeff330`.
- El archivo ya estaba sustituido al comenzar esta fase. `public/cv_en.pdf`
  también estaba eliminado en el árbol de trabajo inicial. Se conservaron esos
  cambios del titular, sin restaurar ni editar documentos anteriores.
- Ambos botones descargan `/cv.pdf`. La interfaz inglesa indica “Download CV
  (Spanish)”. El teléfono permanece en el PDF, no en la interfaz.

## Discrepancias y confirmaciones pendientes

1. El resumen del CV dice “Ingeniero de Sistemas”, pero el mismo documento
   declara “Estudiante de Ingeniería de Sistemas – X ciclo”. La web usa
   estudiante, según las instrucciones; el PDF sigue intacto.
2. El bloque NTT DATA mezcla trabajo en admisión UNDC. Ese trabajo no se atribuye
   a NTT en la web. Confirmar la organización y el periodo de cada actividad.
3. El CV menciona más de 120 casos, más de 15 endpoints, más de 25 escenarios,
   más de 45 incidencias y una reducción aproximada del 30 %. No se presentan
   como logros: falta confirmar alcance, periodo, trabajo individual/equipo y
   organización. Las cifras originales permanecen solo en el PDF y esta revisión.
4. Los cargos y periodos publicados siguen los declarados: QA Automation en NTT
   DATA, febrero 2026–actualidad; QA Analista de Sistemas en UNDC, marzo
   2024–enero 2026. Confirmar denominación contractual y naturaleza de la relación
   con UNDC. No se añadió trabajo audiovisual/comunicación.
5. Cypress/Selenium se presentan de forma conservadora como práctica; Playwright
   como práctica local; Python y CI/CD como formación/conceptos. Revisar alcance
   profesional específico de cada herramienta antes de elevar su clasificación.
6. Los cursos Cisco e INFOPUCP se etiquetan como cursos, no como certificaciones
   profesionales. CADE Universitario 2026 se etiqueta como participación.

## Proyectos y enlaces

El titular confirmó que el proyecto de gestión de 2025 y la tesis son distintos,
y proporcionó las siguientes asociaciones:

| Proyecto | Repositorio | Evidencia y tratamiento |
| --- | --- | --- |
| Sistema Web de Gestión e Inventario, 2025 | https://github.com/Juicaa/BOTICA | Repositorio público, API GitHub 200. Se verificaron archivos PHP/JavaScript y uso de MySQL en el código sin publicar configuración ni credenciales. Responsabilidades QA tomadas del CV. |
| Tesis de inventario farmacéutico, 2026 | https://github.com/Juicaa/Botica-bienestar-devops | Repositorio público, API GitHub 200; el árbol visible solo aporta README. PHP/MySQL y alcance se toman de las instrucciones del titular, no se afirma implementación completa ni validación clínica. |
| AV-MATER-CHIRSTI | https://github.com/sxxntoz/AV-MATER-CHIRSTI | URL confirmada por el titular, pero lectura pública y API GitHub devuelven 404. La tarjeta conserva el proyecto académico y no ofrece un botón roto. Confirmar acceso público o permisos antes de activar el enlace. |

No se crearon casos de estudio QA ficticios para llenar secciones. La experiencia
QA se presenta en las tarjetas profesionales. Faltan capturas propias, demos y
evidencias publicables para las tres tarjetas; se usa un estado gráfico neutro
“Sin capturas públicas”, no imágenes de trabajos ajenos.

GitHub del titular y repositorio del portafolio disponibles públicamente.
LinkedIn coincide con el CV y las instrucciones, pero bloquea la lectura
automatizada (999); su accesibilidad debe comprobarse en una sesión normal.

## Recursos y continuidad visual

- Capturas anteriores conservadas en `archive/original-projects/`, sin servirlas
  desde public. LICENSE y avisos de fuentes se conservan.
- Sonidos existentes, cámara, materiales, geometría, distribución 3×5, poses y
  transiciones se mantienen. Solo se actualizan iconos, copy y highlights.
- Education reutiliza la pose de Experience; la navegación incluye esa sección.
- La tipografía del nombre se adapta mediante clamp; header y párrafos se
  ajustan para móvil sin reconstruir el diseño.
- La prueba táctil en Chrome detectó una tecla que podía quedar presionada al
  moverse el teclado entre pointerdown/pointerup. Se añadió captura/liberación
  del puntero a los handlers móviles; geometría, materiales y movimiento no
  cambiaron. La repetición de la prueba confirma toque y liberación.
- Permanecen los pendientes de procedencia de sonidos/fuentes y los avisos de
  herramientas de desarrollo documentados en la fase 1.

Los resultados reales están en `BROWSER_VALIDATION.md`. No se presupone
equivalencia visual ni rendimiento por compilar correctamente.

# Fase 4: rendimiento y accesibilidad

Revisión del 14 de octubre de 2026 en `feat/portfolio-christian`, sobre `6cf3fb9`. Cambios locales para revisión; sin commits, pushes, instalaciones ni actualizaciones de dependencias.

## Problemas encontrados

- Three.js, Fiber y Drei formaban parte de la carga inicial de la página. El teclado móvil seguía ejecutando sus 16 callbacks de animación y dibujando aunque el hero ya estuviera fuera de pantalla.
- El contenedor móvil se añadía después de la hidratación: el CLS de referencia fue **0,2003**. En 320 px, parte del modelo salía del Canvas; en tablet, el teclado se superponía al texto del hero.
- Los iconos creaban 15 geometrías de plano iguales. Las geometrías principales ya estaban compartidas; las texturas y algunos materiales son distintos por tecla y deben conservarse.
- El cursor decorativo tenía un RAF permanente aun sin movimiento. Las partículas reconstruían sus colores en cada frame. Faltaba aplicar movimiento reducido al scroll, al Canvas y a varias animaciones de interfaz.
- El modal enfocaba su contenido, pero no atrapaba Tab ni hacía inerte el resto de la página. Faltaban un enlace para saltar al contenido y una alternativa HTML con las descripciones de las 15 teclas.
- El texto de ubicación de la experiencia tenía contraste calculado entre **2,90:1 y 4,08:1** sobre el fondo base. Las tarjetas transparentes podían perder legibilidad al pasar el teclado blanco por detrás.

El teclado genera su geometría por código, sin descargar GLB/GLTF, y construye el environment con Lightformers locales. Los iconos son texturas Canvas generadas a partir de los SVG existentes. Los dos WOFF2 de Geist transferidos suman unos 51,2 KiB; los dos MP3 originales suman 4700 bytes y se reutilizan desde el controlador existente. El título de hover utiliza el JSON local de Space Grotesk (29 768 bytes antes de compresión). El texto descriptivo de Troika no tiene `font` explícito y conserva su resolvedor externo: no se garantiza que esa descripción funcione sin red. Los proyectos actuales no referencian imágenes, por lo que no se inventaron capturas ni se aplicó una optimización de imágenes ficticia.

Las actualizaciones por frame del teclado siguen trabajando sobre refs y objetos Three, sin introducir `setState` por frame. No se aplicó una memoización amplia de React sin evidencia; la reducción comprobable procede de la pausa del renderer y la geometría compartida.

## Archivos y cambios

| Archivo | Cambio |
| --- | --- |
| `components/KeyboardScene.tsx` **nuevo** | Carga diferida, visibilidad del hero/página, pausa al abrir modal, comprobación de WebGL, límite de DPR para puntero táctil, manejo de errores/pérdida de contexto y reintento. |
| `components/KeyboardTechnologies.tsx` **nuevo** | Desplegable HTML accesible con las 15 tecnologías y sus descripciones originales; versión compacta para el fallo de WebGL. |
| `components/SkipLink.tsx` **nuevo** | Enlace bilingüe para saltar al contenido, visible al recibir foco. |
| `lib/browser-preferences.ts` **nuevo** | Suscripciones con limpieza a movimiento reducido, tipo de puntero y visibilidad de página. |
| `components/FrozenKeyboard.tsx` | Pausa mediante `frameloop="never"`; render bajo demanda con movimiento reducido; plano compartido para iconos; encuadre para Canvas estrechos; cancelación de hover/touch pendiente al pausar. |
| `app/page.tsx` | Consumidor de la escena; reserva del espacio móvil desde SSR; identificador del contenido principal; callback estable de cierre del modal; columnas de texto en tablet; contraste de experiencia; desplegable de tecnologías. |
| `app/layout.tsx` | Montaje del enlace para saltar al contenido. |
| `app/globals.css` | Foco visible, enlace de salto, columnas de tablet y reglas de movimiento reducido sin ocultar texto. |
| `components/ProjectModal.tsx` | Tab/Shift+Tab dentro del diálogo, Escape, aislamiento con `inert`, restauración del foco y limpieza de listeners. Conserva el bloqueo de Lenis y el diseño. |
| `components/Carousel.tsx` | Pausa por foco, hover, página oculta o movimiento reducido; control de pausa para galerías con varias imágenes; slides inactivos ocultos al lector. Los proyectos actuales mantienen su panel sin imágenes. |
| `components/CustomCursor.tsx` | RAF únicamente mientras sigue al puntero; cancelación al salir/ocultar página; desactivación con movimiento reducido. |
| `components/FrozenBackground.tsx` | Colores de partículas precalculados, DPR decorativo de hasta 1,5 en touch, imagen de partículas estática con movimiento reducido y protección contra RAF duplicados. |
| `components/MagneticTargets.tsx` | Movimiento magnético desactivado con preferencia de movimiento reducido. |
| `components/Reveal.tsx` | Contenido inmediatamente visible con movimiento reducido; desconexión del observer tras una aparición única. |
| `components/SectionNav.tsx` | Área de pulsación mínima de 24 px, etiquetas visibles con foco y navegación inmediata con movimiento reducido. |
| `components/smooth-scroll.tsx` | Desactiva inercia y RAF automático de Lenis con movimiento reducido. |
| `components/EducationSection.tsx`, `components/SkillsCatalogue.tsx` | Opacidad de tarjetas de 0,80 a 0,90 para proteger el contraste sobre la escena. |
| `lib/i18n.ts` | Solo textos genéricos ES/EN de accesibilidad, recuperación de WebGL y pausa de galería. |
| `PERFORMANCE_REVIEW.md` **nuevo** | Este informe y las limitaciones de las mediciones. |

## Comportamiento implementado

El documento conserva su prerenderizado estático. `KeyboardScene` solicita el módulo 3D después de la hidratación, en un momento libre del navegador, con un límite de espera de 250 ms. Se utiliza `next/dynamic` con SSR desactivado solo para el teclado. El módulo sigue cargándose en equipos compatibles: la alternativa HTML aparece cuando WebGL no está disponible o falla, y permite reintentar. [Carga diferida en Next.js](https://nextjs.org/docs/app/guides/lazy-loading).

En móvil, IntersectionObserver pausa el Canvas cuando sale del viewport. La escena permanece montada y conserva sus recursos para reanudar sin reconstrucción. La página oculta y los modales también suspenden el renderizado 3D. La animación usa un tiempo local que conserva su fase al pausar. Se deshabilitan eventos y se cancelan confirmaciones/capturas pendientes, sin cambiar las superficies interactivas. [Render bajo demanda y recursos compartidos en Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

El DPR del teclado mantiene el límite móvil anterior de 1,5 y el de escritorio de 2; las tablets con puntero grueso usan hasta 1,5. Se conservan antialiasing, iluminación, environment de 128 px, geometrías visibles, materiales y texturas. El ajuste de cámara amplía el campo de visión únicamente cuando el Canvas es estrecho para conservar el modelo completo. En movimiento reducido se mantienen poses, resaltados e información, pero sin balanceo, saltos ni giros continuos.

El modal aísla el fondo, contiene el foco y devuelve el foco al botón que lo abrió. El teclado decorativo es invisible al lector de pantalla; el desplegable HTML proporciona la misma información sin depender de hover, WebGL ni animaciones. [Patrón de diálogo modal WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

El contraste de ubicación ahora es al menos **4,62:1** en las cuatro paletas, incluso calculando una superficie blanca detrás de la tarjeta con opacidad 0,90. Es un cálculo de composición de colores CSS; no constituye una auditoría completa de todos los píxeles o de conformidad WCAG.

## Mediciones antes y después

Se midió el build de producción con `next start`, en el mismo equipo Windows, **AMD Ryzen 7 7700X**, Node **24.19.0**, Chrome **155.0.8059.40** headless y WebGL real mediante **SwiftShader**, que renderiza por software. No se desactivó la política de autoplay.

- Escritorio: 1440 × 1000, DPR 1, sin limitación de CPU ni red, servidor local.
- Móvil simulado: 375 × 900, DPR 2, CPU ralentizada 4 veces, latencia de 150 ms, descarga de 1,6 Mbps y subida de 0,75 Mbps. El Canvas 3D utiliza DPR 1,5.
- Dos navegaciones por entorno y versión, caché deshabilitada. La tabla muestra la mediana de esas dos muestras. Es una simulación de CPU/red, no una medición de un teléfono de gama media físico.
- LCP/CLS: PerformanceObserver; FPS: contador del renderer en intervalos de aproximadamente 2 segundos; CPU: tiempo de tareas del hilo principal vía CDP; memoria: heap JavaScript en un instante. Los mismos probes de interacción se usan antes y después.

| Métrica | Escritorio antes | Escritorio después | Móvil antes | Móvil después |
| --- | ---: | ---: | ---: | ---: |
| LCP, ms | 648 | 648 | 1044 | 986 |
| CLS | 0 | 0 | 0,2003 | 0 |
| Evento `load`, ms | 205 | 193 | 3352 | 1763 |
| Primer dibujo WebGL, ms | 1140 | 1593 | 3908 | 4101 |
| JS solicitado antes de `load`, KiB transferidos | 463,4 | 170,5 | 463,4 | 170,5 |
| JS total tras cargar el teclado, KiB transferidos | 463,4 | 467,4 | 463,4 | 467,4 |
| FPS con hero visible | 14,9 | 14,7 | 28,8 | 32,5 |
| FPS durante recorrido entre teclas | 12,4 | 14,1 | 27,3 | 30,3 |
| Frames 3D en 2 s al llegar a Contacto | 31 | 30 | 60 | **0** |
| Tiempo de tareas del hilo principal con hero, ms/2 s | 101 | 98 | 688 | 483 |
| Tiempo de tareas del hilo principal en Contacto, ms/2 s | 110 | 99 | 733 | 847 |
| Heap JS con hero, MiB | 13,2 | 15,1 | 30,0 | 12,3 |
| Mayor Event Timing observado, ms | 288 | 244 | 120 | 132 |
| Geometrías registradas por renderer | 31 | 17 | 31 | 17 |
| Texturas registradas por renderer | 19 | 19 | 19 | 19 |

En escritorio el teclado sigue visible en Contacto; esos frames se conservan intencionadamente. En móvil se verifica la ausencia total de nuevos dibujos 3D fuera del hero. La pausa no implica CPU total igual a cero: continúan el fondo, el navegador y la instrumentación.

La carga diferida reduce el trabajo que precede al evento `load`, pero retrasa el primer dibujo 3D aproximadamente 453 ms en escritorio y 194 ms en móvil. El JS total aumenta unos 4,1 KiB por el control de ciclo de vida y las alternativas accesibles; no se afirma una reducción del bundle total. El chunk diferido del teclado pesa aproximadamente 297 KiB transferidos.

Los valores de CPU y heap tienen variabilidad considerable por la ejecución por software, GC y throttling. Por ejemplo, el tiempo de tareas móvil en Contacto osciló entre 352–1114 ms antes y 555–1139 ms después. **No se demuestra una mejora global de CPU ni una reducción garantizada de memoria.** Dos muestras tampoco justifican atribuir cada diferencia de LCP, FPS o latencia exclusivamente al cambio.

La fila Event Timing es el mayor evento con `interactionId` capturado durante el recorrido de prueba; **no es INP de campo**. Hover no basta para medir INP. INP requiere observar las interacciones de una visita; la evaluación de Core Web Vitals en producción requiere datos reales. No se midieron consumo eléctrico, utilización de GPU ni memoria GPU. [Definición de INP](https://web.dev/articles/inp).

Los JSON originales y la comparación están en `.next/phase4-performance/{before,after,comparison}.json`. Son artefactos locales ignorados por Git; otro build puede eliminarlos.

## Resultados de validación

| Comprobación | Resultado real |
| --- | --- |
| `npm run typecheck` | Código de salida 0; TypeScript sin emisión. |
| `npm run lint` | Código de salida 0; sin errores ni advertencias de ESLint. |
| `npm run build` | Código de salida 0; compilación y prerenderizado de producción correctos. |
| `npm run validate` | Código de salida 0; contratos de contenido y pruebas automatizadas del controlador de audio correctos. El audio de esta comprobación utiliza dobles de prueba. |

En PowerShell se ejecutaron los comandos mediante `npm.cmd`, con los mismos scripts, por la política de ejecución de `npm.ps1`.

Pruebas automatizadas en Chrome con WebGL y políticas normales de autoplay:

- **12 comprobaciones agrupadas de layout/accesibilidad**: 320, 375, 390, 430, 768, 1024 y 1440 px; hero, controles, catálogo, experiencia, tres proyectos, formación y contacto accesibles; sin overflow horizontal del documento ni del modal. Tab/Shift+Tab permanecen en el diálogo; Escape cierra y restaura foco; el control de audio y el fondo quedan inertes mientras está abierto.
- Enlace de salto como primer destino de Tab; acceso al contenido principal; árbol de accesibilidad del navegador con el enlace disponible.
- Pausa móvil con cero nuevos frames fuera del hero y reanudación con 15 teclas. Cuatro cambios repetidos de orientación: un único Canvas y conteos estables de 17 geometrías/19 texturas.
- Movimiento reducido: Canvas bajo demanda sin frames ociosos, contenido esencial visible, cuatro temas, ES/EN y descripción HTML de las 15 tecnologías. WebGL no disponible simulado: alternativa HTML sin crear Canvas.
- **20 comprobaciones de regresión de audio/hover/touch**: visita sin autorización silenciosa, autorización mediante gesto válido, un sonido por entrada, huecos entre filas/columnas silenciosos, recorrido lento/rápido, oscilación de bordes, confirmación de 90 ms, tolerancia de reentrada de 100 ms, mute/unmute, recarga, autorización por teclado y touch/cancelación. Se instrumentan fuentes reales de Web Audio sin sustituir su política de autorización.
- Verificación adicional del rótulo 3D y su fuente al hacer hover en Stack, y pérdida de contexto mediante `WEBGL_lose_context`: alternativa HTML y reintento que restaura el teclado WebGL real.
- Proyección de los vértices del modelo sobre el Canvas en distintas poses de scroll y revisión de capturas, incluyendo el encuadre de 320 px y la separación de texto/teclado en tablet.

Los informes/capturas se guardan en `.next/phase4-validation/`, `.next/audio-validation/`, `.next/phase4-extra/` y `.next/phase4-pose-check/`. Los helpers de navegador quedan junto a los informes para reproducirlos desde la raíz, con Chrome instalado; usan exclusivamente procesos locales temporales. No se añadieron dependencias de pruebas al proyecto.

Estas comprobaciones usan un navegador real automatizado, pero no equivalen a una prueba humana con auriculares, un lector de pantalla o una GPU de móvil. No se verificó percepción subjetiva del sonido ni FPS en hardware físico.

## Integridad conservada

- Las 15 tecnologías, sus slugs/iconos y disposición permanecen iguales. Superficies estables, propagación, 90 ms de confirmación y 100 ms de reentrada conservados; sin cooldown global.
- El controlador `lib/keyboard-audio.ts`, `KeyboardAudioControl.tsx`, ambos MP3 y sus pruebas permanecen idénticos por SHA-256. Se conserva autorización, preferencia y comportamiento de mute.
- Se conservan los cuatro temas, materiales, texturas, geometrías visibles, sonidos, poses, resaltados y transiciones normales por scroll. Movimiento reducido aplica la alternativa solicitada por el visitante.
- Todo `content/`, el catálogo y los identificadores, el CV, los recursos públicos, `LICENSE`, `THIRD_PARTY_NOTICES.md`, los providers ES/EN/temas y los manifiestos de dependencias permanecen idénticos por SHA-256. No se borró ningún archivo inicial.
- `HEAD` y `main` conservan sus referencias iniciales. No se hicieron commits ni pushes.

## Riesgos pendientes y despliegue

1. Revisar con Safari/iOS y Firefox, GPU real de Android de gama media, lector de pantalla NVDA/VoiceOver y zoom de texto. SwiftShader no permite garantizar calidad/percepción/FPS en esos dispositivos. La galería de varias imágenes tiene control de pausa, pero los proyectos actuales no incluyen imágenes: esa variante requiere validación al añadirlas.
2. El JavaScript 3D sigue siendo el mayor recurso. Se preservaron los materiales para mantener calidad; las siguientes decisiones de reducción de shaders o DPR deberían basarse en teléfonos físicos. La carga diferida añade una breve espera de aparición, con espacio reservado para evitar saltos.
3. La estabilidad de conteos tras orientación y la limpieza de observers/listeners no descartan todas las fugas. Falta una sesión larga con varias decenas de ciclos y medición de memoria GPU cuando el navegador lo permita.
4. El indicador de sección conserva su algoritmo de observación anterior; estas pruebas verifican destinos y poses, no todas las combinaciones posibles de velocidad de scroll y ratios de intersección.
5. La procedencia del audio, la cadena de conversión de Space Grotesk y el archivo de fuente solicitado por Troika siguen pendientes según `THIRD_PARTY_NOTICES.md`. Esta fase conserva archivos y avisos; no resuelve ni presume derechos de redistribución. Identificar la URL/licencia efectiva del resolvedor antes de estudiar alojamiento local de esa fuente.
6. Para Vercel: usar preset Next.js, raíz del repositorio, `npm ci` con el lockfile y `npm run build`; seleccionar Node **24.x**, coherente con `engines`, `.nvmrc` y `.node-version`. Confirmar región/configuración y revisar el preview antes del dominio personalizado. No se desplegó ni se modificó configuración remota. [Versiones de Node en Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
7. Medir LCP, CLS e INP con usuarios reales después del preview/despliegue, mediante la observabilidad disponible o Speed Insights. Comprobar compresión y caché de los chunks versionados y no aplicar `immutable` indiscriminadamente a recursos públicos cuyo nombre no cambia. Definir presupuestos sobre esos datos y repetir una medición de producción desde la región de los visitantes.

La fase queda implementada localmente y detenida para revisión.

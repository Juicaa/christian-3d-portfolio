# Estabilización técnica — fase 1

Fecha de revisión: 14 de octubre de 2026 (America/Lima).
Rama de trabajo: `feat/portfolio-christian`. Base: `52cfcb8`.

## Runtime y compatibilidad

Se adopta Node **24.x LTS**, ya instalado localmente como **24.19.0**.
`engines.node`, `.nvmrc`, `.node-version` y las tres etapas del Dockerfile
declaran la misma línea major. No se modificó la instalación global de Node.
Vercel admite 24.x y selecciona su minor/patch; por ello se fija la línea LTS,
no un patch que la plataforma no permite fijar.

Fuente: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
y https://nodejs.org/en/about/previous-releases.

| Componente | Versión final | Compatibilidad publicada |
| --- | --- | --- |
| Next.js | 16.3.8 | Node >=20.9; React/React DOM ^19 admitidos |
| React / React DOM | 19.2.4 / 19.2.4 | Pareja conservada; react-dom requiere ^19.2.4 |
| React Three Fiber | 9.6.0 | React/React DOM >=19 <19.3; Three >=0.156 |
| Drei | 10.7.7 | Fiber ^9; React/React DOM ^19; Three >=0.159 |
| Three.js | 0.184.0 | Satisface Fiber y Drei |
| Tipos de Node | 24.19.2 | Alineados con runtime 24; dependencia de desarrollo |

Se consultaron los metadatos publicados en registry.npmjs.org antes de
instalar. React 19.3 no se seleccionó porque queda fuera del peer range de
Fiber 9.6.0. No se actualizaron las bibliotecas de renderizado 3D.

## Cambios puntuales

- `FrozenKeyboard.tsx`: los tres Math.random del movimiento independiente de
  cada tecla se inicializan en un efecto y permanecen en una ref. El efecto
  tiene guardia para no regenerarlos en un replay de Strict Mode. Conserva los
  rangos de frecuencia, fase y umbral, las amplitudes y las interpolaciones.
  El callback de frame espera esa inicialización; no añade renders por frame.
- `Reveal.tsx`: adjunta la ref mediante JSX, conservando `as`, la etiqueta
  resultante, hijos, clases, estilos y observador. El tipo local de props HTML
  evita la intersección con los elementos JSX de Three ampliados por Fiber.
  No se desactivaron reglas ESLint para eludir los cuatro errores.
- `package.json`: añade typecheck sin emisión/caché incremental y hace que
  lint rechace warnings. Mantiene Next y eslint-config-next en la misma versión.

## Seguridad de dependencias

Se eligió Next **16.3.8**, una versión estable de seguridad anterior a 16.4.0,
para evitar incorporar otra versión minor sin necesidad. Reúne los parches de
16.3.3 (AVIF y Windows), 16.3.6 (next/og) y los avisos de septiembre corregidos
en 16.3.8. La presencia de una versión afectada en la auditoría inicial no
demostraba explotación en este portafolio; las condiciones dependen de cada
función y configuración.

Fuentes oficiales:

- https://github.com/vercel/next.js/releases/tag/v16.3.8
- https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4
- https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36
- https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j

Además se actualizaron dependencias transitivas vulnerables de forma dirigida,
dentro de los rangos de sus dependientes. No se usó `npm audit fix --force`,
`--legacy-peer-deps` ni overrides. La instalación y actualización se realizaron
con `--ignore-scripts`; SWC, Sharp y el build funcionan con los paquetes
precompilados instalados en Windows. El detalle completo anterior/nuevo está
en [DEPENDENCY_CHANGES.md](DEPENDENCY_CHANGES.md).

| Auditoría npm | Resultado observado |
| --- | --- |
| Antes, árbol completo | 17 paquetes afectados: 1 crítico, 12 altos, 3 moderados, 1 bajo |
| Después, árbol completo | 5 paquetes afectados, todos altos, en herramientas de desarrollo |
| Después, `--omit=dev` | 0 vulnerabilidades conocidas; salida 0 |

Los cinco avisos finales proceden de una sola vulnerabilidad raíz de `braces`
3.0.3, propagada por `micromatch`, `fast-glob`, `@next/eslint-plugin-next` y
`eslint-config-next`. El aviso
https://github.com/advisories/GHSA-vfj7-8cjw-p6xm afecta a <=3.0.3 y no publica
versión parcheada; el registro npm seguía publicando 3.0.3 como latest.
`npm audit` completo termina con salida 1 por este pendiente real.

Npm propone bajar eslint-config-next a 14.2.35. No se aplicó porque desalinearía
la herramienta con Next 16 y excedería la actualización controlada. No se
parcheó node_modules manualmente ni se ocultó el aviso. Hasta disponer de
parche, mantener los patrones de glob de las herramientas bajo control del
repositorio y no introducir patrones de llaves anidadas provenientes de
entradas no confiables. Revisar el aviso al actualizar las herramientas.

Cero avisos en producción expresa el resultado de npm en esta fecha, no una
garantía de ausencia de vulnerabilidades ni de cumplimiento de licencias.

## Validación automatizada ejecutada

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd run typecheck` | Salida 0; `tsc --noEmit --incremental false` |
| `npm.cmd run lint -- --no-cache` | Salida 0; cero errores y warnings |
| `npm.cmd run build` | Salida 0; Next 16.3.8/Turbopack, compilación y prerender correctos |
| `npm.cmd ls --all` | Sin problemas del árbol ni peers incompatibles |
| `npm audit --omit=dev` | Salida 0; sin avisos conocidos de producción |
| HTTP de producción local | Página /, chunks JS, fuente Space Grotesk, dos MP3 y dos CV con HTTP 200 |
| Cabeceras HTTP | DENY, nosniff y HSTS presentes |
| Comparación con HEAD | Poses, dimensiones 3x5, Canvas, materiales, eventos y animación general del teclado sin cambios |
| Comparación de Reveal | Observador, delays, duration, threshold y variables CSS sin cambios |
| Comparación de contenido | app/, lib/, CV, fuentes, sonidos, capturas y LICENSE sin cambios |

El servidor de la prueba HTTP escuchó solo en 127.0.0.1:3107 y se detuvo al
finalizar. Esa prueba no ejecuta JavaScript cliente ni renderiza WebGL.
Los archivos generados por el build quedan en .next, ignorado por Git.

## Comprobaciones pendientes

- Navegador real: hover/touch, presión/liberación/cancelación, sonido después
  del gesto inicial, highlights y movimientos de Contacto.
- Escritorio y móvil: transiciones entre secciones, giros, cambio de tamaño,
  los cuatro temas y el selector ES/EN, modal y Reveal.
- Comparación visual: el código de diseño está preservado, pero no se ha
  demostrado equivalencia de píxeles ni rendimiento mediante navegador.
- Vercel: build y runtime 24.x en preview; no se realizó despliegue ni se
  cambiaron ajustes de una cuenta Vercel.
- Docker: las etapas se alinearon a Node 24; la imagen no se construyó.
- Recursos: resolver procedencia de sonidos, conversión Space Grotesk y fuente
  descargada por Troika, según [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

El contenido profesional original permanece intacto. No se realizaron commits,
pushes ni modificaciones de main. La fase termina aquí para revisión.

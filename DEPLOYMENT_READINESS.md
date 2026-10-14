# Fase 5A — Preparación para Vercel

Revisión local del 14 de octubre de 2026. Alcance: preparar y comprobar la rama
`feat/portfolio-christian` sin desplegar, conectar Vercel/GitHub ni cambiar ramas
remotas.

## A. Archivos cambiados

- `.env.example` y `.gitignore`: documentan `NEXT_PUBLIC_SITE_URL` y permiten
  incluir únicamente la plantilla vacía; los archivos `.env*` siguen ignorados.
- `lib/site-config.ts`: resuelve de forma validada la URL base y si el entorno
  puede indexarse.
- `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`: metadatos SEO,
  canonical y reglas de indexación condicionadas al entorno.
- `next.config.ts`: envía `X-Robots-Tag: noindex, nofollow, noarchive` cuando el
  entorno no es Producción indexable.
- `scripts/validate-deployment.mjs` y `package.json`: agrega comprobaciones de
  configuración, recursos públicos, variables de entorno y duplicados de URLs;
  `npm run validate` las incluye.
- `.github/workflows/ci.yml`: flujo de validación en GitHub Actions.
- `DEPLOYMENT_READINESS.md`: este informe y el procedimiento de Preview.

No se cambió ninguna dependencia, archivo de contenido, recurso, licencia,
teclado, sonido, tema ni animación. No se modificó `LICENSE`.

## B. Configuración para producción

Node local observado: `v24.19.0`. `.node-version`, `.nvmrc` y
`package.json#engines` ya fijaban Node 24; Next `16.3.8` requiere Node `>=20.9`.
Vercel ofrece Node `24.x` y acepta el rango `24.x` de `engines`, así que no
requiere cambios de runtime. React `19.2.4`, R3F `9.6.0`, Drei `10.7.7` y Three
`0.184.0` están resueltos por el lockfile; `npm ls --depth=0` no reportó
dependencias inválidas ni conflictos de pares.

La URL se configurará en Vercel como `NEXT_PUBLIC_SITE_URL` en el entorno
**Production** cuando se elija un dominio. Debe ser un origen HTTPS, sin ruta,
credenciales, consulta ni fragmento. No hay dominio seleccionado ni valor de
producción configurado ahora. En Preview se utiliza el host asignado por Vercel
para formar metadatos absolutos, pero no para canonical ni indexación.

Producción se indexa únicamente cuando `VERCEL_ENV=production` y el origen
público está configurado. En Preview, CI, desarrollo local y Producción sin
origen explícito:

- los metadatos `robots` y Googlebot marcan `noindex, nofollow`;
- todas las respuestas incluyen `X-Robots-Tag: noindex, nofollow, noarchive`;
- `/robots.txt` bloquea `/`, y `/sitemap.xml` no contiene URLs.

Cuando el dominio se configure, metadataBase, canonical, Open Graph URL,
`robots.txt` y sitemap usarán ese origen. El sitemap actual incluye solo la
página raíz porque el sitio tiene una sola ruta indexable. Twitter usa tarjeta
`summary`: no hay imagen Open Graph/Twitter definida, y no se inventó una.
`/icon.svg` y `/favicon.ico` responden desde la compilación actual.

Se conserva `output: "standalone"`, que ya alimenta el Dockerfile del proyecto.
Next.js registra que `next start` no es el servidor correspondiente a ese modo;
para la prueba local se ejecutó `.next/standalone/server.js` con `public/` y
`.next/static` copiados, igual que hace el Dockerfile. No se cambió esta
configuración por la mera preparación de Vercel. La integración real del
adaptador de Next en Vercel aún requiere un Preview controlado.

## C. Resultados técnicos

| Comprobación | Resultado local |
| --- | --- |
| `npm run typecheck` | Aprobado: `tsc --noEmit --incremental false`. |
| `npm run lint` | Aprobado: ESLint sin errores ni advertencias. |
| `npm run build` | Aprobado en Next `16.3.8`/Turbopack; generó `/`, `/_not-found`, `/icon.svg`, `/robots.txt` y `/sitemap.xml`. |
| `npm run validate` | Aprobado: 3 proyectos, 2 experiencias, 5 estudios, IDs/slugs, contratos de modal, ES/EN, 15 teclas y escenarios estáticos de audio. También pasó la política de URL y escaneo de recursos públicos. |
| `npm audit --omit=dev` | Aprobado: 0 vulnerabilidades en dependencias de producción. |
| `npm audit` completo | No limpio: 5 paquetes afectados, 1 aviso alto transitivo de desarrollo descrito en E. |
| `npm ls --depth=0` | Aprobado: versiones esperadas y sin conflictos de peer dependencies. |
| YAML de Actions | Parseado con el analizador YAML local; se comprobó el job y el permiso mínimo. No se ejecutó en GitHub. |
| Escaneo heurístico de secretos y nombres | No encontró claves privadas/tokens de alta confianza en archivos de texto examinados ni nombres de archivos sensibles entre los versionados. No sustituye un escáner especializado ni cubre secretos en historial remoto. |

Prueba HTTP de la compilación standalone local: la portada y los metadatos de
noindex, `/robots.txt`, sitemap vacío, favicon/icono, CV, ambos JSON de fuente
3D, ambos MP3 y 12 recursos estáticos usados por la portada devolvieron HTTP
200; entre estos recursos estaban los dos WOFF2 de `next/font`. Esta comprobación
valida rutas y carga HTTP de archivos, no decodificación/reproducción de audio,
WebGL, interacción visual ni el entorno remoto de Vercel.

No se hizo una medición de Core Web Vitals, una prueba visual de navegador ni un
despliegue. Los scripts estáticos sí verificaron la conservación de 15 teclas,
sus contratos, traducciones y casos de audio ya existentes.

## D. Seguridad, privacidad y licencias

La carpeta `public/` no contiene claves, archivos de entorno, bases de datos ni
archivos temporales según la comprobación añadida. `.env.example` está vacío
salvo el nombre de variable documentado. No hay credenciales de Vercel o GitHub
en la configuración nueva. Las acciones de CI están fijadas a SHA completos;
el workflow tiene solo `contents: read`, desactiva la persistencia de credenciales
de checkout y no contiene pasos de despliegue ni secretos.

Hay datos personales intencionalmente públicos: correo en el perfil y teléfono
dentro del CV descargable. La revisión de contenido existente registra que el CV
fue entregado por el titular. Un Preview de Vercel es accesible públicamente por
defecto; se recomienda activar Vercel Authentication antes de crear el primero.
La revisión de contenido también detecta que el repositorio enlazado
`Juicaa/BOTICA` publica `BdBotica.sql` y contiene secuencias numéricas de ocho
dígitos cuyo carácter sintético o sensible no se pudo acreditar. No se copió ese
archivo al portafolio ni se lo clasifica como dato real; el titular debería
revisar el permiso y los datos de prueba del repositorio vinculado antes de un
Preview público sin protección. El repositorio enlazado identifica una botica y
una localidad; no se encontró evidencia para llamarlos confidenciales, pero su
publicación debe estar autorizada por quien corresponda.

`THIRD_PARTY_NOTICES.md` y `LICENSE` se mantienen. El código heredado conserva
la licencia MIT y atribución a Txema Albero en `README.md`; la búsqueda no halló
referencias visibles a él en contenido profesional o UI. Las licencias
incluidas cubren Geist (OFL), Helvetiker y Space Grotesk (OFL de la familia),
pero la procedencia/conversión del JSON de Space Grotesk aún requiere evidencia.
Los dos sonidos MP3 no tienen autor, fuente o permiso documentado. Drei/Troika
resuelve una fuente de texto sin URL/licencia efectiva identificada en ejecución.
Algunos logos conservan condiciones de marca distintas a la licencia CC0 del
paquete Simple Icons. Los SVG genéricos en `public/` tampoco tienen atribución
individual documentada. No se declara resuelta ninguna de esas procedencias.

La tarjeta `AV-MATER-CHIRSTI` no tiene una URL de repositorio en los datos
actuales. El enlace que el titular facilitó anteriormente
(`sxxntoz/AV-MATER-CHIRSTI`) devuelve 404 en la revisión web; no se añadió ni se
reemplazó el enlace. Los otros dos repositorios GitHub de proyectos están
accesibles y no hay URLs duplicadas entre las tarjetas. Las tres tarjetas tienen
`media` vacío; no hay imágenes de proyecto que cargar o comprobar.

## E. Pendientes y riesgos

1. **No existe Preview de Vercel todavía.** Por tanto, runtime, protección,
   cabeceras externas, enlaces dentro de la red desplegada y comportamiento del
   adaptador Vercel siguen pendientes de prueba real.
2. **Riesgo de ramas:** `main` continúa siendo la versión original de Txema. Al
   inicio de esta revisión `main` estaba en `52cfcb8`, mientras la rama de trabajo
   estaba en `cb39372`. Vercel suele elegir `main` como Production Branch al
   importar un repositorio; conectar la integración GitHub sin revisar esa
   configuración podría publicar la versión original como producción.
3. **Aviso alto de desarrollo:** la auditoría completa encuentra el aviso
   `GHSA-vfj7-8cjw-p6xm` en `braces@3.0.3` (stack exhaustion/DoS), dentro de
   `eslint-config-next@16.3.8 → @next/eslint-plugin-next@16.3.8 →
   fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`. `npm audit` indica que el
   arreglo automático disponible baja `eslint-config-next` a `14.2.35`, un
   downgrade mayor incompatible con Next 16. El registro aún ofrece `braces`
   `3.0.3`, dentro del rango vulnerable; tampoco el árbol de
   `eslint-config-next@16.4.0` probado elimina `fast-glob@3.3.1`. No se aplicó
   override especulativo ni downgrade. No es una dependencia de runtime, pero
   debe seguirse y resolverse antes de exigir un audit limpio de toda la cadena
   de desarrollo.
4. Revisar permiso sobre los datos visibles del repositorio de BOTICA antes de
   un Preview abierto, y corregir/verificar el enlace de AV-MATER solo con
   confirmación del titular.
5. La licencia/procedencia de MP3, fuente efectiva de Troika, conversión de
   Space Grotesk y algunos recursos no está cerrada. Esas incertidumbres constan
   en `THIRD_PARTY_NOTICES.md`; no son evidencia de infracción ni autorización.
6. El contenido del CV y el teléfono son públicos por diseño actual; verificar
   que el PDF vigente sea el que se desea exponer en una URL externa.
7. No se escaneó de nuevo cada objeto del historial Git ni el contenido binario
   de todos los archivos archivados; `main` y el historial del fork siguen
   conteniendo material original. No se reescribió historial.

## F. GitHub Actions

`.github/workflows/ci.yml` se ejecuta en push a
`feat/portfolio-christian`, en pull requests y manualmente. Ejecuta `npm ci`,
`npm audit --omit=dev --audit-level=moderate`, TypeScript, ESLint, `npm run
validate` y build. Usa Node del archivo `.node-version`, limita permisos,
desactiva credenciales persistentes del checkout y fija `checkout`/`setup-node`
a SHA de publicación revisados. No intenta desplegar en Vercel.

El workflow está preparado pero **no ha corrido en GitHub**: no hubo commit ni
push, de acuerdo con las restricciones. El audit del workflow cubre producción
para no bloquear cada build con el aviso conocido de la herramienta de lint;
el audit completo local sigue reportando ese aviso alto y se documenta arriba.

## G. Procedimiento seguro para el primer Preview

Recomendación: usar Vercel CLI primero, sin importar/conectar el repositorio
GitHub. La CLI crea un Preview con `vercel deploy`; `vercel deploy --prod` crea
Producción y no se debe usar en este procedimiento. Mantener desconectada la
integración GitHub mientras `main` siga siendo el portafolio original.

Después de revisar estos cambios y autorizar un Preview en una fase posterior:

1. Asegurarse de estar en `feat/portfolio-christian`, inspeccionar
   `git status --short` y probar un commit revisado y limpio. No cambiar a
   `main`. Ejecutar localmente `npm ci`, `npm run typecheck`, `npm run lint`,
   `npm run validate` y `npm run build`.
2. En Vercel, crear un proyecto sin importar ni conectar un proveedor Git. En
   Settings, fijar Node.js `24.x`. Antes del primer build, activar Deployment
   Protection con Vercel Authentication para los Preview deployments. No añadir
   un dominio ni `NEXT_PUBLIC_SITE_URL` para Preview; Vercel provee `VERCEL_ENV`
   y `VERCEL_URL`.
3. En la carpeta del repositorio, instalar/usar la CLI oficial y autenticar la
   cuenta: `npx vercel@latest login`. Ejecutar `npx vercel@latest link` y elegir
   el proyecto creado manualmente. Revisar que `.vercel` apunte al equipo y
   proyecto esperados; no descargar variables de producción.
4. Solo entonces crear el Preview con `npx vercel@latest deploy` (sin `--prod`).
   Revisar que la salida indique Preview y que la compilación corresponda al
   commit revisado de `feat/portfolio-christian`.
5. Abrir el Preview autenticado y comprobar portada, teclado 3D, iconos, sonido
   tras autorización, CV, fuentes y modales; probar los breakpoints en navegador.
   Confirmar `/robots.txt` con `Disallow: /`, sitemap vacío y
   `X-Robots-Tag: noindex, nofollow, noarchive`. Revisar logs y que ningún
   recurso esperado responda 404.
6. Dejar GitHub desconectado hasta que el titular apruebe una estrategia para
   reemplazar la rama `main` original y publicar Producción. No añadir dominio ni
   ejecutar `vercel deploy --prod` en la Fase 5A.

Referencias oficiales revisadas: [Versiones Node.js en Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Deploy desde CLI](https://vercel.com/docs/projects/deploy-from-cli), [deploys Git y rama de Producción](https://vercel.com/docs/git), [URLs generadas y protección](https://vercel.com/docs/deployments/generated-urls), [pin seguro de Actions](https://docs.github.com/en/actions/reference/security/secure-use) y [aviso de braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

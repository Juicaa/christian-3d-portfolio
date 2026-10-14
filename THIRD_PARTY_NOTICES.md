# Licencias, atribuciones y procedencia

## Actualización de personalización — fase 3

La atribución MIT original se conserva. La identidad y el contenido profesional
publicados ahora corresponden a Christian Juica. Las capturas antiguas se han
trasladado sin modificación a `archive/original-projects/`, fuera de `public/`;
no se utilizan en tarjetas ni se sirven como recursos estáticos del portafolio.
El PDF en `public/cv.pdf` fue aportado por el titular y se conserva sin edición.
El antiguo `cv_en.pdf` ya no está presente ni tiene enlaces funcionales.

El teclado conserva 15 posiciones. Los logos actuales de Simple Icons son
Cypress, Selenium, Postman, Bruno, Apache JMeter, Jira, Git, GitHub, GitHub
Actions, MySQL, PHP, JavaScript y Python. Se mantienen sus metadatos de origen
en el adaptador. Apache JMeter declara Apache-2.0; las condiciones de Git, PHP
y JavaScript documentadas abajo siguen aplicando. Las directrices de MySQL
están en https://www.mysql.com/about/legal/logos.html; las de Jira en
https://atlassian.design/foundations/logos/; las de GitHub en
https://github.com/logos. La licencia CC0 del paquete no sustituye restricciones
particulares de logos o marcas.

Playwright y Xray no están en la versión instalada de Simple Icons. Sus teclas
utilizan símbolos geométricos originales de ventana/check y matriz de pruebas,
creados en `lib/skills.ts`; no reproducen logos oficiales. El monograma CJ en
`app/icon.svg` también es un vector original. Estos gráficos nuevos se aportan
al código MIT del proyecto, Copyright (c) 2026 Christian Maximo Juica Alarcon.

Las referencias a capturas, CV y tecnologías anteriores de las secciones
siguientes describen la revisión histórica de la fase 1. Los pendientes sobre
sonidos, conversión de Space Grotesk y fuentes de Troika permanecen abiertos.

Revisión: 14 de octubre de 2026. Esta documentación conserva la atribución
original y distingue licencias identificadas de procedencia pendiente. No
constituye una autorización general para redistribuir los recursos externos.

## Código y geometría 3D

Proyecto original: [Txemalon/3d-portfolio](https://github.com/Txemalon/3d-portfolio).
Copyright (c) 2026 Jose Maria Albero Belamendia. Licencia MIT en [LICENSE](LICENSE).
Debe conservarse el copyright y el texto de permiso en las copias o porciones
sustanciales del software. LICENSE no se ha modificado.

La base y las 15 teclas se generan en `components/FrozenKeyboard.tsx` con
geometría de Three.js. No hay un modelo GLB/GLTF externo. Los comentarios
mencionan una referencia visual a Naresh, pero no identifican una URL ni una
licencia independiente; esa referencia no acredita derechos sobre recursos
externos. El código del teclado pertenece al código del repositorio MIT.

## Bibliotecas

Next.js, React, React DOM, Three.js, React Three Fiber, Drei, Lenis, Tailwind CSS
y ESLint declaran MIT. TypeScript declara Apache-2.0. Simple Icons declara
CC0-1.0 para el paquete, con condiciones independientes para algunos logos.
Las licencias completas de cada dependencia se distribuyen con sus paquetes;
deben conservarse al redistribuirlos. El lockfile identifica las versiones
exactas. Esta lista de dependencias principales no sustituye un inventario
completo de licencias transitivas.

## Fuentes

| Archivo o uso | Evidencia | Estado y acción |
| --- | --- | --- |
| `public/fonts/space_grotesk_bold.typeface.json` | `familyName: Space Grotesk`; `original_font_information` vacío. El proyecto oficial publica SIL OFL 1.1. | Se adjunta la licencia del proyecto oficial. Falta confirmar fuente de origen, versión y proceso de conversión del JSON; el nombre de familia por sí solo no prueba esa cadena. |
| `public/fonts/helvetiker_bold.typeface.json` | Incluye copyright MAGENTA Ltd. 2004 y permiso completo de redistribución de fuentes. | Se conserva el aviso embebido y se adjunta copia legible. No está referenciada por el teclado actual, pero sigue distribuida en public. |
| Geist / Geist Mono, `app/layout.tsx` | `next/font/google`; proyecto oficial Geist, SIL OFL 1.1. | Se adjunta OFL. Conservar avisos al distribuir las fuentes. |
| Texto descriptivo `<Text>` del teclado | Drei/Troika sin `font` explícito. El resolvedor instalado referencia datos de unicode-font-resolver en jsDelivr. | La fuente realmente solicitada debe identificarse mediante la red del navegador. No asumir funcionamiento offline ni una licencia concreta del archivo descargado. |

Avisos completos incluidos:

- [Space Grotesk OFL](public/licenses/space-grotesk-OFL.txt), obtenido de
  https://github.com/floriankarsten/space-grotesk/blob/master/OFL.txt.
- [Geist OFL](public/licenses/geist-OFL.txt), obtenido de
  https://github.com/vercel/geist-font/blob/main/OFL.txt.
- [Helvetiker/MAGENTA](public/licenses/helvetiker-LICENSE.txt), extraído sin
  alterar de los metadatos de la fuente local.

OFL cubre las fuentes y sus derivados, incluidas conversiones de formato;
requiere conservar sus avisos. No implica que todo el portafolio tenga OFL.

## Logos de tecnologías

Se utilizan 15 logos de `simple-icons` 16.16.0. Consultar el
[disclaimer oficial](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md)
y las directrices de cada marca. La ausencia de un campo `license` no significa
ausencia de restricciones. Ningún logo debe sugerir patrocinio o afiliación.

| Logo | Licencia/directriz identificada en el paquete o fuente oficial |
| --- | --- |
| JavaScript | MIT; conservar avisos aplicables del recurso |
| TypeScript | https://www.typescriptlang.org/branding |
| HTML5 | https://www.w3.org/html/logo/ |
| CSS | https://github.com/CSS-Next/logo.css |
| Tailwind CSS | https://tailwindcss.com/brand |
| Python | https://www.python.org/community/logos/ |
| React | https://github.com/facebook/react; confirmar condiciones específicas del logo |
| Next.js | https://vercel.com/design/brands#next-js |
| Vue.js | Evan You; CC-BY-NC-SA-4.0. Sus condiciones permiten ilustrar experiencia profesional en portafolios. https://github.com/vuejs/art |
| Node.js | https://nodejs.org/en/about/branding |
| PHP | Colin Viebrock; CC-BY-SA-4.0. https://www.php.net/download-logos.php |
| Odoo | https://www.odoo.com/page/brand-assets |
| PostgreSQL | https://www.postgresql.org/about/policies/trademarks/ |
| Docker | https://www.docker.com/company/newsroom/media-resources/ |
| Git | Jason Long; CC-BY-3.0. https://git-scm.com/about/logos |

Enlaces de licencias de logos: [CC-BY-3.0](https://creativecommons.org/licenses/by/3.0/),
[CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/) y
[CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
Los logos se convierten de SVG a texturas canvas para mostrarlos en las teclas;
se conserva su trazado y color de marca. Las atribuciones anteriores acompañan
su uso actual. Confirmar condiciones vigentes antes de publicación.

## Recursos con procedencia pendiente

- `public/sounds/switch_press.mp3` y `switch_release.mp3`: no hay autor, enlace
  de origen, licencia individual ni permiso documentado. El código reproduce
  muestras MP3; el comentario antiguo sobre síntesis no acredita su origen.
  Pedir evidencia del permiso o sustituirlos por muestras propias/licenciadas
  en una fase autorizada. Se mantienen sin alteración en esta fase.
- JSON convertido de Space Grotesk: licencia de la familia identificada,
  cadena de origen/conversión pendiente como se detalla arriba.
- Fuente de texto Troika descargada en ejecución: verificar URL y licencia
  reales antes de preparar alojamiento local.
- Las 20 capturas en `public/projects/{revio,aptia,gestor-gastos,dianas}` son
  recursos del portafolio original. No hay documentación separada sobre logos,
  imágenes o datos de terceros dentro de las capturas. No atribuir sus proyectos
  al propietario del fork; se conservan hasta la fase de contenido.
- `public/cv.pdf` y `cv_en.pdf` contienen información profesional y personal del
  autor original. Se conservan en esta fase; la MIT del código no autoriza a
  presentar esa información como experiencia propia.
- `app/favicon.ico` y los SVG de public no tienen avisos individuales de
  procedencia en el repositorio. Verificar fuente y condiciones si se conserva
  su redistribución. Los logos de Next.js/Vercel siguen sujetos a sus marcas.

No se ha retirado ningún recurso para alterar la experiencia actual. Los
pendientes anteriores requieren evidencia o sustitución antes de declarar
completa la revisión de derechos de una publicación.

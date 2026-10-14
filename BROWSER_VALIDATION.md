# Validación de personalización

14 de octubre de 2026. Node 24.19.0, Next 16.3.8. No se añadieron dependencias.

## Comprobaciones automatizadas

| Comprobación final | Resultado |
| --- | --- |
| npm run typecheck | Salida 0, sin emisión de archivos |
| npm run lint -- --no-cache | Salida 0, cero errores/warnings |
| npm run validate:content | Salida 0: 3 proyectos, 2 experiencias, 5 registros de formación, 34 habilidades |
| npm run build | Salida 0; página y favicon SVG prerenderizados |
| CV | Firma PDF, contenido/identidad legibles y hash original del archivo aportado conservado |
| Recursos archivados | Las 20 capturas coinciden byte a byte con los archivos de HEAD |
| Teclado | Geometrías, cámara, iluminación, materiales, poses originales y fórmulas de movimiento sin cambios |

La validación actual comprueba categorías y contextos, ES/EN, posiciones y
slugs del teclado, highlights, proyectos/modales, IDs/secciones, enlace español
del CV en ambos idiomas y ausencia de datos profesionales del autor anterior.
No exige igualdad de contenido con las fases anteriores.

## Navegador ejecutado

Se abrió Chrome instalado en modo headless mediante CDP, con perfil temporal
aislado. Se probó el build de producción servido solo en 127.0.0.1:3107.
WebGL2 utilizó SwiftShader (renderizado por software). No hubo excepciones de
JavaScript ni fallos de red en la ejecución final.

Comprobaciones realizadas:

- Hero visible con nombre/rol/presentación personalizados y teclado 3D.
- Renderizado WebGL activo, con llamadas de dibujo aumentando entre muestras.
- Hover sobre una tecla real mediante eventos de ratón; creación de una fuente
  de audio tras decodificar el sonido. Esto no es una evaluación auditiva humana.
- Activación de las cuatro estaciones; cambio ES/EN y etiqueta inglesa que
  indica el CV español.
- Apertura de los tres modales; contenido y estado “Sin capturas públicas”.
  Cierre mediante Escape.
- Desplazamiento a Stack, Experiencia, Formación, proyecto y Contacto.
- Emulación táctil: pointerdown sobre tecla 3D móvil y liberación correcta.
- Capturas y límites de layout a 320, 375, 768 y 1440 px, sin desbordamiento
  horizontal del documento ni recorte final del selector del encabezado.
- PDF español y nuevo favicon responden HTTP 200. El PDF inglés anterior y
  las rutas de capturas ajenas archivadas responden HTTP 404.

Se detectó y corrigió un recorte de ~5 px del selector a 320 px, reduciendo sus
botones solo en móvil. Se detectó y corrigió la captura táctil descrita en
`PERSONALIZATION_REVIEW.md`. Las pruebas se repitieron sobre un nuevo build.

Las capturas y el informe JSON de la sesión local están en
`.next/phase3-preview/` (ignorados por Git y regenerables; no son assets del
portafolio ni se incluyen en las tarjetas). El helper de prueba también es
local/temporal. El servidor y Chrome se cerraron al finalizar.

## Límites y pendientes

- No se probaron Safari, Firefox ni dispositivos móviles físicos.
- No se midieron FPS, consumo de batería ni Core Web Vitals en GPU/dispositivo
  real. El teclado móvil sigue montado cuando el hero sale de pantalla, como
  en la base original; esa optimización queda pendiente.
- La presentación completa alarga el hero móvil; se comprobó que el contenido
  es desplazable y el nombre/selector caben, no que todos los CTA entren en el
  primer viewport.
- No se probaron todas las combinaciones de idioma, estación, modal y tamaño.
- Quedan pendientes de accesibilidad heredados (por ejemplo, confinamiento y
  restauración de foco del modal), fuera de esta personalización.
- No hubo despliegue Vercel, configuración DNS/dominio ni build Docker.
- AV-MATER-CHIRSTI devuelve 404 públicamente. LinkedIn bloquea lectura
  automatizada (999); comprobarlo en una sesión normal.
- Faltan capturas propias, evidencias publicables y confirmación del alcance
  de las cifras y actividades mezcladas del CV. Sonidos y fuentes mantienen
  los pendientes de procedencia ya documentados.

Trabajo exclusivo en feat/portfolio-christian, sin commits ni pushes.

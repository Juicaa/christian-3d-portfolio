# Cambios de dependencias ? fase 1

Comparaci?n de package-lock.json con HEAD 52cfcb8. No se actualizaron React,
React DOM, Fiber, Drei, Three.js, Lenis, Simple Icons, Tailwind, ESLint o TypeScript.
Los cambios transitivos proceden del framework parcheado y de actualizaciones
dirigidas dentro de los rangos permitidos por sus dependientes, sin --force,
--legacy-peer-deps ni overrides. @types/node cambia de major para corresponder
al runtime Node 24, y no es una dependencia de ejecuci?n.

| Paquete / ubicaci?n | Anterior | Nueva |
| --- | --- | --- |
| `@babel/code-frame` | `7.29.0` | `7.29.7` |
| `@babel/compat-data` | `7.29.0` | `7.29.7` |
| `@babel/core` | `7.29.0` | `7.29.7` |
| `@babel/generator` | `7.29.1` | `7.29.8` |
| `@babel/helper-compilation-targets` | `7.28.6` | `7.29.7` |
| `@babel/helper-globals` | `7.28.0` | `7.29.7` |
| `@babel/helper-module-imports` | `7.28.6` | `7.29.7` |
| `@babel/helper-module-transforms` | `7.28.6` | `7.29.7` |
| `@babel/helper-string-parser` | `7.27.1` | `7.29.7` |
| `@babel/helper-validator-identifier` | `7.28.5` | `7.29.7` |
| `@babel/helper-validator-option` | `7.27.1` | `7.29.7` |
| `@babel/helpers` | `7.29.2` | `7.29.10` |
| `@babel/parser` | `7.29.2` | `7.29.9` |
| `@babel/template` | `7.28.6` | `7.29.7` |
| `@babel/traverse` | `7.29.0` | `7.29.10` |
| `@babel/types` | `7.29.0` | `7.29.8` |
| `@emnapi/runtime` | `1.10.0` | `1.11.3` |
| `@humanfs/core` | `0.19.1` | `0.19.2` |
| `@humanfs/node` | `0.16.7` | `0.16.8` |
| `@img/sharp-darwin-arm64` | `0.34.5` | `0.35.5` |
| `@img/sharp-darwin-x64` | `0.34.5` | `0.35.5` |
| `@img/sharp-libvips-darwin-arm64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-darwin-x64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linux-arm` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linux-arm64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linux-ppc64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linux-riscv64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linux-s390x` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linux-x64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linuxmusl-arm64` | `1.2.4` | `1.3.4` |
| `@img/sharp-libvips-linuxmusl-x64` | `1.2.4` | `1.3.4` |
| `@img/sharp-linux-arm` | `0.34.5` | `0.35.5` |
| `@img/sharp-linux-arm64` | `0.34.5` | `0.35.5` |
| `@img/sharp-linux-ppc64` | `0.34.5` | `0.35.5` |
| `@img/sharp-linux-riscv64` | `0.34.5` | `0.35.5` |
| `@img/sharp-linux-s390x` | `0.34.5` | `0.35.5` |
| `@img/sharp-linux-x64` | `0.34.5` | `0.35.5` |
| `@img/sharp-linuxmusl-arm64` | `0.34.5` | `0.35.5` |
| `@img/sharp-linuxmusl-x64` | `0.34.5` | `0.35.5` |
| `@img/sharp-wasm32` | `0.34.5` | `0.35.5` |
| `@img/sharp-win32-arm64` | `0.34.5` | `0.35.5` |
| `@img/sharp-win32-ia32` | `0.34.5` | `0.35.5` |
| `@img/sharp-win32-x64` | `0.34.5` | `0.35.5` |
| `@next/env` | `16.2.4` | `16.3.8` |
| `@next/eslint-plugin-next` | `16.2.4` | `16.3.8` |
| `@next/swc-darwin-arm64` | `16.2.4` | `16.3.8` |
| `@next/swc-darwin-x64` | `16.2.4` | `16.3.8` |
| `@next/swc-linux-arm64-gnu` | `16.2.4` | `16.3.8` |
| `@next/swc-linux-arm64-musl` | `16.2.4` | `16.3.8` |
| `@next/swc-linux-x64-gnu` | `16.2.4` | `16.3.8` |
| `@next/swc-linux-x64-musl` | `16.2.4` | `16.3.8` |
| `@next/swc-win32-arm64-msvc` | `16.2.4` | `16.3.8` |
| `@next/swc-win32-x64-msvc` | `16.2.4` | `16.3.8` |
| `@swc/helpers` | `0.5.15` | `0.5.23` |
| `@types/node` | `20.19.39` | `24.19.2` |
| `@typescript-eslint/typescript-estree/node_modules/brace-expansion` | `5.0.5` | `5.0.12` |
| `baseline-browser-mapping` | `2.10.19` | `2.11.28` |
| `brace-expansion` | `1.1.14` | `1.1.21` |
| `browserslist` | `4.28.2` | `4.29.3` |
| `caniuse-lite` | `1.0.30001788` | `1.0.30001816` |
| `electron-to-chromium` | `1.5.339` | `1.5.455` |
| `eslint-config-next` | `16.2.4` | `16.3.8` |
| `fastq` | `1.20.1` | `1.20.3` |
| `fflate` | `0.8.2` | `0.8.3` |
| `js-yaml` | `4.1.1` | `4.3.2` |
| `nanoid` | `3.3.11` | `3.3.20` |
| `next` | `16.2.4` | `16.3.8` |
| `node-releases` | `2.0.37` | `2.0.58` |
| `postcss` | `8.5.10` | `8.5.23` |
| `sharp` | `0.34.5` | `0.35.5` |
| `sharp/node_modules/semver` | `7.7.4` | `7.8.5` |
| `source-map-js` | `1.2.1` | `1.2.2` |
| `three-stdlib/node_modules/fflate` | `0.6.10` | `0.6.11` |
| `undici-types` | `6.21.0` | `7.24.6` |
| `update-browserslist-db` | `1.2.3` | `1.3.4` |

Nuevas entradas de lockfile: `@humanfs/types`, `@img/sharp-freebsd-wasm32` y
`@img/sharp-webcontainers-wasm32`. Se deduplic? `next/node_modules/postcss`
(antes 8.4.31) hacia la copia de PostCSS 8.5.23. Las entradas de binarios para
otros sistemas operativos son opcionales; no se instalan todas en Windows.

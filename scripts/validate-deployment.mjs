import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourcePath = path.join(root, "lib/site-config.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const sandboxModule = { exports: {} };
vm.runInNewContext(compiled, {
  module: sandboxModule,
  exports: sandboxModule.exports,
  process: { env: {} },
  URL,
}, { filename: sourcePath });
const { resolveSiteConfig } = sandboxModule.exports;

function checkPolicy(environment, expected) {
  const actual = resolveSiteConfig(environment);
  assert.equal(actual.indexable, expected.indexable, "Unexpected indexing policy");
  assert.equal(actual.metadataBase?.toString() ?? null, expected.metadataBase);
}

checkPolicy(
  { VERCEL_ENV: "preview", VERCEL_URL: "portfolio-git-feature-vercel.app" },
  { indexable: false, metadataBase: "https://portfolio-git-feature-vercel.app/" }
);
checkPolicy(
  { VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://portfolio.example" },
  { indexable: true, metadataBase: "https://portfolio.example/" }
);
checkPolicy(
  { VERCEL_ENV: "production" },
  { indexable: false, metadataBase: null }
);
checkPolicy(
  { VERCEL_ENV: undefined, NEXT_PUBLIC_SITE_URL: "http://localhost:3000" },
  { indexable: false, metadataBase: "http://localhost:3000/" }
);
assert.throws(
  () => resolveSiteConfig({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://portfolio.example" }),
  /HTTPS origin/
);
assert.throws(
  () => resolveSiteConfig({ VERCEL_ENV: "preview", VERCEL_URL: "attacker.example/path" }),
  /HTTPS origin/
);

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
const lockedNext = lock.packages["node_modules/next"];
assert.match(packageJson.engines.node, /^24\.x$/);
assert.equal(lockedNext.version, packageJson.dependencies.next);
assert.match(lockedNext.engines.node, /20\.9/);

const requiredAssets = [
  "public/cv.pdf",
  "public/fonts/space_grotesk_bold.typeface.json",
  "public/fonts/helvetiker_bold.typeface.json",
  "public/sounds/switch_press.mp3",
  "public/sounds/switch_release.mp3",
  "public/licenses/geist-OFL.txt",
  "public/licenses/space-grotesk-OFL.txt",
  "public/licenses/helvetiker-LICENSE.txt",
  "app/favicon.ico",
  "app/icon.svg",
];
for (const relativePath of requiredAssets) {
  assert(fs.statSync(path.join(root, relativePath)).isFile(), `Missing production asset: ${relativePath}`);
}

const forbiddenPublicFiles = [];
function visitPublic(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      forbiddenPublicFiles.push(path.relative(root, fullPath));
    } else if (entry.isDirectory()) {
      visitPublic(fullPath);
    } else if (/\.(?:env|pem|key|p12|pfx|sqlite|db|dump|sql|log|bak)$/i.test(entry.name)) {
      forbiddenPublicFiles.push(path.relative(root, fullPath));
    }
  }
}
visitPublic(path.join(root, "public"));
assert.deepEqual(forbiddenPublicFiles, [], "Found a secret, database, or temporary file under public/");

const ignoreFile = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
assert.match(ignoreFile, /^\.env\*$/m);
assert.match(ignoreFile, /^!\.env\.example$/m);
assert(fs.existsSync(path.join(root, ".env.example")));

const githubLinks = fs.readFileSync(path.join(root, "content/projects.ts"), "utf8")
  .match(/"https:\/\/github\.com\/[^"]+"/g) ?? [];
assert.equal(new Set(githubLinks).size, githubLinks.length, "Duplicate GitHub project URL");

console.log(`PASS deployment policy: Preview/CI/local fail closed; production requires an HTTPS public origin`);
console.log(`PASS Node ${process.versions.node}, Next ${lockedNext.version}, and locked runtime requirement`);
console.log(`PASS ${requiredAssets.length} production assets, public-file scan, environment-file ignore rules, and unique project repository URLs`);

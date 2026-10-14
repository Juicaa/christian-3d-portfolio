import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const cache = new Map();

// Evaluate the small data modules in memory, using the installed TypeScript.
// No dependency installation or generated JavaScript files are needed.
function evaluate(source, filename, bindings = {}) {
  const sandboxModule = { exports: {} };
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(compiled, {
    module: sandboxModule,
    exports: sandboxModule.exports,
    require: (specifier) => {
      if (specifier.startsWith("@/")) return load(specifier.slice(2));
      if (specifier.startsWith(".")) {
        return load(path.relative(root, path.resolve(path.dirname(filename), specifier)));
      }
      return require(specifier);
    },
    ...bindings,
  }, { filename });
  return sandboxModule.exports;
}

function load(relative) {
  const filename = path.resolve(root, relative.endsWith(".ts") ? relative : `${relative}.ts`);
  if (!cache.has(filename)) cache.set(filename, evaluate(fs.readFileSync(filename, "utf8"), filename));
  return cache.get(filename);
}

function variable(source, name, bindings = {}) {
  const ast = ts.createSourceFile("input.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(ast) === name) {
        return evaluate(`module.exports = ${declaration.initializer.getText(ast)};`, "expression.ts", bindings);
      }
    }
  }
  throw new Error(`Missing variable: ${name}`);
}

const plain = (value) => JSON.parse(JSON.stringify(value));
const equal = (actual, expected, message) => assert.deepEqual(plain(actual), plain(expected), message);
const { portfolio } = load("content/portfolio");
const { projects, experiences, education, skills, profile } = portfolio;
const { SKILLS_GRID, SKILLS_FLAT } = load("lib/skills");
const { DICT, translate } = load("lib/i18n");
const { PORTFOLIO_SECTIONS, getPortfolioSections } = load("lib/sections");

function unique(items, key) {
  const values = items.map((item) => item[key]);
  assert(values.every((value) => typeof value === "string" && value.trim()), `Empty ${key}`);
  assert.equal(new Set(values).size, values.length, `Duplicate ${key}`);
}

function translations(value, location = "content") {
  if (!value || typeof value !== "object") return;
  if ("es" in value || "en" in value) {
    for (const lang of ["es", "en"]) {
      assert(typeof value[lang] === "string" && value[lang].trim(), `${location}.${lang} missing`);
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) translations(child, `${location}.${key}`);
}

function resource(url) {
  assert.equal(typeof url, "string", "Resource must be a URL or public path");
  if (url.startsWith("/") && !url.startsWith("//")) {
    const publicRoot = path.join(root, "public");
    const resolved = path.resolve(publicRoot, `.${url}`);
    assert(resolved.startsWith(`${publicRoot}${path.sep}`), `Resource escapes public: ${url}`);
    assert(fs.statSync(resolved).isFile(), `Missing resource: ${url}`);
  } else {
    assert(["http:", "https:"].includes(new URL(url).protocol), `Invalid URL: ${url}`);
  }
}

unique(projects, "id");
unique(projects, "num");
unique(projects, "section");
unique(experiences, "id");
unique(education, "id");
unique(skills, "slug");
translations(portfolio);
translations(DICT, "i18n");
for (const url of Object.values(profile.links)) resource(url);
for (const url of Object.values(profile.cv)) resource(url);

assert.equal(SKILLS_GRID.length, 3, "Keyboard must keep three rows");
assert(SKILLS_GRID.every((row) => row.length === 5), "Keyboard must keep five keys per row");
assert.equal(SKILLS_FLAT.length, 15);
unique(SKILLS_FLAT, "slug");
const keyboardSlugs = new Set(SKILLS_FLAT.map((icon) => icon.slug));
for (const icon of SKILLS_FLAT) {
  assert(skills.some((skill) => skill.slug === icon.slug), `Missing skill: ${icon.slug}`);
  assert(icon.path && /^[0-9a-f]{6}$/i.test(icon.hex), `Invalid icon: ${icon.slug}`);
  for (const lang of ["es", "en"]) {
    const key = `keyboard.taglines.${icon.slug}`;
    assert.notEqual(translate(key, lang), key, `Unresolved ${key}.${lang}`);
  }
}

for (const project of projects) {
  assert(/^project[1-9]\d*$/.test(project.section), `Invalid animated section: ${project.section}`);
  assert(["left", "right"].includes(project.align));
  assert(Array.isArray(project.stack) && project.stack.every((item) => typeof item === "string" && item));
  for (const slug of project.highlights ?? []) assert(keyboardSlugs.has(slug), `Unmapped highlight: ${slug}`);
  for (const url of project.media ?? []) resource(url);
  for (const url of [project.url, project.github].filter(Boolean)) resource(url);
}

unique(PORTFOLIO_SECTIONS, "id");
equal(PORTFOLIO_SECTIONS.map((section) => section.id), [
  "hero", "stack", "experience", ...projects.map((project) => project.section), "contact",
], "Navigation must follow all project sections");
for (const section of PORTFOLIO_SECTIONS) {
  for (const lang of ["es", "en"]) assert.notEqual(translate(section.labelKey, lang), section.labelKey);
}

const keyboardSource = fs.readFileSync(path.join(root, "components/FrozenKeyboard.tsx"), "utf8");
const states = variable(keyboardSource, "SECTION_STATES");
const projectStates = variable(keyboardSource, "PROJECT_SECTION_STATES", { projects, SECTION_STATES: states });
for (const project of projects) {
  equal(projectStates[project.section], states[project.align === "left" ? "project1" : "project2"], "Missing project pose");
}
// Exercise extension without writing fictitious projects to production data.
const extra = { ...projects[0], id: "validation-only", section: "project9999", num: "9999", align: "right" };
const extended = [...projects, extra];
assert(getPortfolioSections(extended).some((section) => section.id === extra.section));
const extendedStates = variable(keyboardSource, "PROJECT_SECTION_STATES", { projects: extended, SECTION_STATES: states });
equal(extendedStates[extra.section], states.project2, "Additional projects must inherit a pose");

console.log(`PASS content: ${projects.length} projects, ${experiences.length} experiences, ${education.length} education records`);
console.log(`PASS IDs/slugs, ${projects.flatMap((project) => project.media ?? []).length} image references, modal fields and ES/EN`);
console.log("PASS 15 keys, highlights, navigation and current/additional project poses (static validation)");

const compareIndex = process.argv.indexOf("--compare-ref");
if (compareIndex >= 0) {
  const ref = process.argv[compareIndex + 1];
  assert(/^[0-9a-f]{7,40}$/.test(ref), "Supply a commit hash for comparison");
  const original = (file) => execFileSync("git", ["show", `${ref}:${file}`], { cwd: root, encoding: "utf8" });
  const page = original("app/page.tsx");
  const removeId = (items) => items.map((item) => Object.fromEntries(
    Object.entries(item).filter(([key]) => key !== "id")
  ));
  equal(removeId(projects), variable(page, "projects"), "Project content changed during extraction");
  equal(removeId(experiences), variable(page, "experiences"), "Experience content changed during extraction");
  assert.equal(profile.email, variable(page, "EMAIL"));
  equal(DICT, evaluate(original("lib/i18n.ts"), "old-i18n.ts").DICT, "Translations changed during extraction");
  equal(SKILLS_FLAT, evaluate(original("lib/skills.ts"), "old-skills.ts").SKILLS_FLAT, "Key names/order/paths/colors changed");
  equal(states, variable(original("components/FrozenKeyboard.tsx"), "SECTION_STATES"), "Original poses changed");
  equal(variable(keyboardSource, "MOBILE_STATE"), variable(original("components/FrozenKeyboard.tsx"), "MOBILE_STATE"));
  const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8");
  equal(variable(layout, "metadata", { profile }), variable(original("app/layout.tsx"), "metadata"), "SEO changed");
  const attributes = (source, name) => {
    const result = [];
    const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxAttribute(node) && node.name.getText(ast) === name && node.initializer && ts.isStringLiteral(node.initializer)) {
        result.push(node.initializer.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    return result;
  };
  for (const url of attributes(page, "href")) assert(Object.values(profile.links).includes(url), `Original link changed: ${url}`);
  equal([profile.heroName.firstLine, profile.heroName.secondLine], attributes(page, "text"), "Hero name changed");
  execFileSync("git", ["diff", "--exit-code", ref, "--", "app/globals.css", "public", "LICENSE", "THIRD_PARTY_NOTICES.md", "package-lock.json", "lib/seasons.ts", "components/Reveal.tsx", "components/FrozenBackground.tsx", "components/SeasonProvider.tsx", "components/SeasonPicker.tsx", "components/LanguageProvider.tsx", "components/LanguagePicker.tsx", "components/smooth-scroll.tsx"], { cwd: root });
  console.log(`PASS preservation against ${ref}: original content, translations, icons, poses, SEO, links, resources, styles, themes and notices`);
}

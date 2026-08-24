import fs from "node:fs";
import path from "node:path";
import { parse as parseSfc } from "@vue/compiler-sfc";
import { NodeTypes, parse as parseTemplate } from "@vue/compiler-dom";
import { parse as parseScript } from "@babel/parser";

const root = path.resolve("src");
const sourceFiles = [];
const issues = [];
const ignoredSourceFiles = new Set([
  "src/config/area.js",
  "src/config/lang.js",
  "src/config/phone.js",
  "src/util/useLocale.js",
]);
const allowedVisibleValues = new Set([
  "DAS",
  "DMK",
  "PPC",
  "SEO",
  "USD",
  "support@swcpartnership.online",
]);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (/\.(vue|js)$/.test(entry.name)) sourceFiles.push(fullPath);
  }
}

function hasEnglish(value) {
  return /[A-Za-z]{2,}/.test(value);
}

function clean(value) {
  return value.replace(/\s+/g, " ").trim();
}

function display(file, line, kind, value) {
  const relative = path.relative(process.cwd(), file).replaceAll("\\", "/");
  const normalized = clean(value);
  if (
    ignoredSourceFiles.has(relative) ||
    allowedVisibleValues.has(normalized) ||
    /^das\.[A-Za-z0-9_.-]+$/.test(normalized)
  ) {
    return;
  }
  issues.push(`${relative}:${line} [${kind}] ${normalized}`);
}

function visitTemplate(node, file) {
  if (node.type === NodeTypes.TEXT && hasEnglish(node.content)) {
    display(file, node.loc.start.line, "template-text", node.content);
  }

  if (node.type === NodeTypes.ELEMENT) {
    for (const prop of node.props) {
      if (
        prop.type === NodeTypes.ATTRIBUTE &&
        prop.value &&
        ["alt", "aria-label", "placeholder", "title", "value"].includes(prop.name) &&
        hasEnglish(prop.value.content)
      ) {
        display(file, prop.loc.start.line, `attr:${prop.name}`, prop.value.content);
      }
    }
  }

  for (const child of node.children || []) visitTemplate(child, file);
  if (node.branches) {
    for (const branch of node.branches) visitTemplate(branch, file);
  }
}

const visiblePropertyNames = new Set([
  "answer",
  "copy",
  "description",
  "emptyText",
  "hint",
  "label",
  "message",
  "name",
  "placeholder",
  "question",
  "subtitle",
  "text",
  "title",
]);

function propertyName(node) {
  if (!node || node.computed) return "";
  if (node.key?.type === "Identifier") return node.key.name;
  if (node.key?.type === "StringLiteral") return node.key.value;
  return "";
}

function visitScript(node, file, parent = null) {
  if (!node || typeof node !== "object") return;

  if (node.type === "ObjectProperty" && visiblePropertyNames.has(propertyName(node))) {
    if (node.value?.type === "StringLiteral" && hasEnglish(node.value.value)) {
      display(file, node.value.loc.start.line, `script:${propertyName(node)}`, node.value.value);
    }
    if (
      node.value?.type === "TemplateLiteral" &&
      hasEnglish(node.value.quasis.map((part) => part.value.raw).join(""))
    ) {
      display(
        file,
        node.value.loc.start.line,
        `script:${propertyName(node)}`,
        node.value.quasis.map((part) => part.value.raw).join("${…}"),
      );
    }
  }

  const isMessageCall =
    node.type === "CallExpression" &&
    ((node.callee.type === "Identifier" &&
      /^(alert|confirm|prompt|showToast|showDialog|showNotify|showFailToast|showSuccessToast)$/.test(
        node.callee.name,
      )) ||
      (node.callee.type === "MemberExpression" &&
        node.callee.property?.type === "Identifier" &&
        /^(error|info|success|warning)$/.test(node.callee.property.name)));

  if (isMessageCall) {
    for (const argument of node.arguments || []) {
      if (argument.type === "StringLiteral" && hasEnglish(argument.value)) {
        display(file, argument.loc.start.line, "script-message", argument.value);
      }
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (["loc", "start", "end", "extra"].includes(key) || key === "comments") continue;
    if (Array.isArray(value)) {
      for (const child of value) visitScript(child, file, node);
    } else if (value && typeof value === "object" && value !== parent) {
      visitScript(value, file, node);
    }
  }
}

walk(root);

for (const file of sourceFiles.sort()) {
  const source = fs.readFileSync(file, "utf8");
  if (file.endsWith(".vue")) {
    const { descriptor } = parseSfc(source, { filename: file });
    if (descriptor.template?.content) {
      const ast = parseTemplate(descriptor.template.content, { comments: false });
      visitTemplate(ast, file);
    }
    for (const block of [descriptor.script, descriptor.scriptSetup]) {
      if (!block?.content) continue;
      const ast = parseScript(block.content, {
        sourceType: "module",
        plugins: ["typescript", "topLevelAwait"],
      });
      visitScript(ast, file);
    }
  } else {
    const ast = parseScript(source, {
      sourceType: "module",
      plugins: ["typescript", "topLevelAwait"],
    });
    visitScript(ast, file);
  }
}

if (issues.length) {
  console.error("Found user-visible English text outside the locale messages:\n");
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${sourceFiles.length} source files: no hard-coded user-visible English text found.`);
}

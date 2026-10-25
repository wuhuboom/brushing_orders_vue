import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDmkMessages } from "../src/i18n/dmk.messages.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(projectRoot, "src");
const localeRoot = path.join(sourceRoot, "i18n", "locales");
const localeNames = fs
  .readdirSync(localeRoot)
  .filter((name) => name.endsWith(".json"))
  .map((name) => path.basename(name, ".json"))
  .sort();

const messages = Object.fromEntries(
  localeNames.map((locale) => {
    const file = path.join(localeRoot, `${locale}.json`);
    const message = JSON.parse(fs.readFileSync(file, "utf8"));
    message.das ||= {};
    message.das.dmk = createDmkMessages(locale, message);
    return [locale, message];
  }),
);

const sourceFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (/\.(vue|js)$/.test(entry.name) && !fullPath.includes(`${path.sep}i18n${path.sep}`)) {
      sourceFiles.push(fullPath);
    }
  }
}

function readPath(object, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], object);
}

walk(sourceRoot);

const usedKeys = new Set();
const literalKeyPattern = /["'`](das\.[A-Za-z0-9_.-]+)["'`]/g;
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(literalKeyPattern)) usedKeys.add(match[1]);
}

const failures = [];
for (const [locale, message] of Object.entries(messages)) {
  for (const key of usedKeys) {
    const value = readPath(message, key);
    if (typeof value !== "string" || !value.trim()) {
      failures.push(`${locale}: missing ${key}`);
    } else if (value === key) {
      failures.push(`${locale}: unresolved ${key}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${usedKeys.size} translation keys across ${localeNames.length} locales.`);
}

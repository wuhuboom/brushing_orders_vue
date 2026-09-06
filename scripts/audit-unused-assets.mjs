import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['public', 'src/static', 'src/assets'];
const textExtensions = new Set(['.vue', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.json', '.css', '.scss', '.sass', '.less', '.html', '.svg']);
const walk = async (directory) => {
  const result = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Refusing to follow a symbolic link: ${directory}/${entry.name}`);
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) result.push(...await walk(relative));
    else if (entry.isFile()) result.push(relative);
  }
  return result.sort();
};
const targetFiles = (await Promise.all(targets.map(walk))).flat();
const resources = await Promise.all(targetFiles.map(async file => {
  const bytes = await readFile(path.join(root, file));
  return { file, size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), references: [] };
}));
const isResource = file => targets.some(directory => file.startsWith(`${directory}/`));
// Keep every source-code reference, even in secondary/lazy routes. Do not infer
// usage from dist/: this project's Vite plugin copies public files wholesale.
const sources = (await walk('src')).filter(file => !isResource(file) && textExtensions.has(path.extname(file)));
sources.push('index.html', 'vite.config.js');
sources.push(...(await walk('scripts/fixtures')).filter(file => textExtensions.has(path.extname(file))));
const sourceText = new Map();
const sourceHashes = {};
const processed = new Set();
const remember = (resource, source, index, kind) => {
  const text = sourceText.get(source);
  const line = text.slice(0, index).split('\n').length;
  if (!resource.references.some(ref => ref.source === source && ref.line === line && ref.kind === kind)) {
    resource.references.push({ source, line, kind });
  }
  if (textExtensions.has(path.extname(resource.file)) && !processed.has(resource.file)) sources.push(resource.file);
};
const quoted = text => [...text.matchAll(/["'`]([^"'`\r\n]+)["'`]/g)];
while (sources.length) {
  const source = sources.shift();
  if (processed.has(source)) continue;
  processed.add(source);
  const raw = await readFile(path.join(root, source));
  sourceHashes[source] = createHash('sha256').update(raw).digest('hex');
  const text = raw.toString('utf8').replaceAll('\\/', '/');
  sourceText.set(source, text);
  const strings = quoted(text);
  for (const resource of resources) {
    if (source === resource.file) continue;
    const relative = path.posix.relative(path.posix.dirname(source), resource.file);
    const variants = new Set([resource.file, relative, `./${relative}`]);
    if (resource.file.startsWith('public/')) variants.add(`/${resource.file.slice(7)}`);
    if (resource.file.startsWith('src/')) {
      variants.add(`@/${resource.file.slice(4)}`);
      variants.add(`/${resource.file}`);
    }
    for (const variant of variants) {
      // Bare names are handled as complete string values below, not substrings.
      if (!variant.includes('/')) continue;
      for (const spelling of [variant, variant.replaceAll(' ', '%20')]) {
        const index = text.indexOf(spelling);
        if (index !== -1) remember(resource, source, index, 'path');
      }
    }
    const basename = path.posix.basename(resource.file);
    for (const match of strings) {
      if (match[1] === basename) remember(resource, source, match.index, 'filename used by asset factory');
    }
  }
}

// Reviewed dynamic families: full filenames do not occur as literals in Vue.
const dynamic = [
  ['src/components/dmkH5/DmkH5Header.vue', '/nsg16/menu-${item.iconName}.png', /^public\/nsg16\/menu-[^/]+\.png$/],
  ['src/components/nsg/NsgVipBadge.vue', '/nsg16/vip-badge-${color}.png', /^public\/nsg16\/vip-badge-[1-4]\.png$/],
  ['src/components/dmk/NsgWithdrawalList.vue', '/nsg16/status-${', /^public\/nsg16\/status-(success|rejected|reviewing)\.png$/],
  ['src/components/dmk/DmkFlagCarousel.vue', '${assetBase}/i${index}.png', /^public\/dmk\/assets\/i(?:[1-9]|10)\.png$/],
];
for (const [source, token, pattern] of dynamic) {
  const text = sourceText.get(source);
  if (!text?.includes(token)) throw new Error(`Dynamic asset rule needs review: ${source}`);
  for (const resource of resources.filter(item => pattern.test(item.file))) remember(resource, source, text.indexOf(token), 'reviewed dynamic family');
}

// A basename-only mention in tests/docs is not a production import. Record it
// for manual review, especially negative assertions about removed old assets.
const otherSources = [...await walk('scripts'), ...(await readdir(root)).filter(file => /\.(md|ps1|json)$/.test(file))]
  .filter(file => file !== 'scripts/audit-unused-assets.mjs' && /\.(vue|js|mjs|ts|html|md|ps1|json)$/.test(file));
for (const source of otherSources) {
  if (!(await stat(path.join(root, source))).isFile()) continue;
  const text = await readFile(path.join(root, source), 'utf8');
  for (const resource of resources.filter(item => !item.references.length)) {
    const basename = path.posix.basename(resource.file), index = text.indexOf(basename);
    if (index !== -1) (resource.nonRuntimeMentions ??= []).push({ source, line: text.slice(0, index).split('\n').length });
  }
}
const report = {
  generatedAt: new Date().toISOString(), root,
  policy: 'Delete only resources with no source-code/import/style/HTML/config or reviewed dynamic reference. Tests/docs are reviewed separately. No asset is classified by its age or its presence in dist.',
  scannedSources: [...processed].sort(), sourceHashes, resources,
  summary: { total: resources.length, retained: resources.filter(item => item.references.length).length, candidates: resources.filter(item => !item.references.length).length, candidateBytes: resources.filter(item => !item.references.length).reduce((sum, item) => sum + item.size, 0) },
};
const output = path.resolve(root, process.argv[2] || 'artifacts/resource-cleanup-20260906/audit-before.json');
if (!output.startsWith(`${root}${path.sep}`)) throw new Error('Report output must remain in the workspace');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary));
for (const resource of resources.filter(item => !item.references.length)) console.log(`${(resource.size / 1024).toFixed(1).padStart(9)} KiB  ${resource.file}${resource.nonRuntimeMentions?.length ? ' [test/doc mention: review]' : ''}`);
console.log(`Audit: ${output}`);

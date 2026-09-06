import assert from 'node:assert/strict';
import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = path.join(root, 'artifacts/resource-cleanup-20260906');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));
const exists = async file => { try { await access(file); return true; } catch { return false; } };
const buildFiles = async (directory = 'dist') => {
  const files = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await buildFiles(file));
    else if (entry.isFile()) {
      const bytes = await readFile(path.join(root, file));
      files.push({ file, size: bytes.length, sha256: hash(bytes) });
    }
  }
  return files.sort((a, b) => a.file.localeCompare(b.file));
};
const built = await buildFiles();
if (process.argv.includes('--baseline')) {
  await writeFile(path.join(reportDir, 'build-before.json'), JSON.stringify(built, null, 2) + '\n');
  console.log(`Saved build baseline: ${built.length} files, ${built.reduce((sum, file) => sum + file.size, 0)} bytes.`);
} else {
  const audit = await readJson(path.join(reportDir, 'audit-before.json'));
  const result = await readJson(path.join(reportDir, 'cleanup-result.json'));
  const beforeBuild = await readJson(path.join(reportDir, 'build-before.json'));
  let removedBytes = 0;
  for (const resource of audit.resources) {
    const file = path.join(root, resource.file);
    if (resource.references.length) assert.equal(hash(await readFile(file)), resource.sha256, `Retained resource changed: ${resource.file}`);
    else {
      assert.equal(await exists(file), false, `Unreferenced resource still exists: ${resource.file}`);
      assert.equal(hash(await readFile(path.join(result.Backup, resource.file))), resource.sha256, `Backup mismatch: ${resource.file}`);
      if (resource.file.startsWith('public/')) assert.equal(await exists(path.join(root, 'dist', resource.file.slice(7))), false);
      removedBytes += resource.size;
    }
  }
  for (const [file, sha256] of Object.entries(audit.sourceHashes)) assert.equal(hash(await readFile(path.join(root, file))), sha256, `Application source changed: ${file}`);
  // Cleaning unused public assets must not change executable code or bundled CSS.
  const modules = list => list.filter(item => /^dist\/assets\/.*\.(js|css)$/.test(item.file));
  assert.deepEqual(modules(built), modules(beforeBuild), 'Application JS/CSS differs from the pre-cleanup build');
  assert.equal(result.RemovedCount, audit.summary.candidates);
  assert.equal(result.RemovedBytes, removedBytes);
  const summary = {
    scanned: audit.resources.length, retained: audit.summary.retained, deleted: result.RemovedCount,
    removedBytes, buildBeforeBytes: beforeBuild.reduce((sum, item) => sum + item.size, 0),
    buildAfterBytes: built.reduce((sum, item) => sum + item.size, 0),
    unchangedBundles: modules(built).length, backup: result.Backup,
  };
  await writeFile(path.join(reportDir, 'verification.json'), JSON.stringify(summary, null, 2) + '\n');
  const directories = ['public', 'src/static', 'src/assets'];
  const mib = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
  const lines = ['# 资源清理结果', '', `扫描 ${summary.scanned} 个文件，保留 ${summary.retained} 个，删除 ${summary.deleted} 个（${mib(removedBytes)}）。`, '', '判断依据：代码、HTML、CSS、配置、动态路径及本地 UI 测试页引用；没有仅凭当前页面是否显示来删除资源。', '', '| 目录 | 扫描 | 保留 | 删除 | 删除体积 |', '| --- | ---: | ---: | ---: | ---: |'];
  for (const directory of directories) {
    const items = audit.resources.filter(item => item.file.startsWith(`${directory}/`));
    const removed = items.filter(item => !item.references.length);
    lines.push(`| ${directory} | ${items.length} | ${items.length - removed.length} | ${removed.length} | ${mib(removed.reduce((sum, item) => sum + item.size, 0))} |`);
  }
  lines.push('', '## 视频核对', '', '| 文件 | 处理 | 引用位置 |', '| --- | --- | --- |');
  for (const resource of audit.resources.filter(item => item.file.endsWith('.mp4'))) lines.push(`| ${resource.file} | ${resource.references.length ? '保留' : '删除'} | ${resource.references.map(ref => `${ref.source}:${ref.line}`).join(', ') || '无引用'} |`);
  lines.push('', '## 验证与恢复', '', `- 删除前已完整备份并校验 SHA-256：${result.Backup}`, '- 原始相对目录结构保留在备份中，可按路径复制回项目。', `- 保留文件及所有已扫描的应用源文件哈希未变；构建中 ${summary.unchangedBundles} 个 JS/CSS 文件与清理前逐字节一致。`, `- 构建产物：${mib(summary.buildBeforeBytes)} → ${mib(summary.buildAfterBytes)}。`, '- audit-before.json 包含全部文件的保留依据、引用位置、大小及校验值。', '', '## 已删除文件', '');
  for (const resource of audit.resources.filter(item => !item.references.length)) lines.push(`- ${resource.file} (${(resource.size / 1024).toFixed(1)} KiB)`);
  await writeFile(path.join(reportDir, 'README.md'), lines.join('\n') + '\n');
  console.log(JSON.stringify(summary, null, 2));
}

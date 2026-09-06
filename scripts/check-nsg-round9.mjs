import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
const read = path => readFile(path, 'utf8');
const salary = await read('src/views/salary/index.vue');
const milestones = new Function(`return ${salary.match(/const milestones = (\[[\s\S]*?\]);/)[1]}`)();
assert.deepEqual(milestones, [{ day: 2, amount: 120 }, { day: 5, amount: 1300 }, { day: 10, amount: 1600 }, { day: 15, amount: 1900 }, { day: 30, amount: 2500 }]);
assert.match(salary, /await userGetInfo\(\)/);
assert.match(salary, /store.setUserInfo\(latest\)/);
assert.equal((salary.match(/<NsgSalaryContent /g) || []).length, 2);
assert.doesNotMatch(salary, /check_in.png/);
const ico = await readFile('public/favicon.ico');
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 6);
for (const [index, size] of [16, 32, 48, 64, 128, 256].entries()) {
  const entry = 6 + index * 16, offset = ico.readUInt32LE(entry + 12), length = ico.readUInt32LE(entry + 8);
  assert.equal(ico[entry] || 256, size);
  assert.equal(ico[entry + 1] || 256, size);
  assert(offset + length <= ico.length);
  assert.equal(ico.subarray(offset, offset + 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(ico.readUInt32BE(offset + 16), size);
  assert.equal(ico.readUInt32BE(offset + 20), size);
}
assert.match(await read('index.html'), /image\/x-icon.*favicon.ico\?v=nsg-/);
const marketing = await read('src/components/dmk/NsgMarketingContent.vue');
assert.match(marketing, /@media \(max-width: \$\{getPcBreakpoint\(\) - 0.02\}px\)/);
assert.match(marketing, /\.nsg-home \.hero-video \.heading-1 \{ text-align: center;/);
assert.match(marketing, /margin: 28px auto 0/);
assert.match(marketing, /props.page === "about" \? "body" : "body nsg-home"/);
const server = await createServer({ configFile: false, plugins: [vue()], server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true } });
try {
  const component = (await server.ssrLoadModule('/src/components/dmk/NsgSalaryContent.vue')).default;
  const i18n = (await server.ssrLoadModule('/src/i18n/index.js')).default;
  const render = async (mobile, items = milestones) => renderToString(createSSRApp(component, { mobile, milestones: items, workingDays: 5, memberLevel: 2 }).use(i18n));
  const required = ['salaryMember', 'salaryDay', 'earningsGrowth', 'salaryTier', 'salaryTopTier', 'salaryRuleSupport'];
  for (const locale of i18n.global.availableLocales) {
    const messages = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
    for (const key of required) assert.equal(typeof messages.das.nsg[key], 'string', `${locale}.${key}`);
    assert(messages.das.nsg.salaryRuleSupport.includes('{support}'));
    i18n.global.locale = locale;
    for (const mobile of [false, true]) {
      const html = await render(mobile);
      assert.equal((html.match(/<article /g) || []).length, 5);
      assert.equal((html.match(/class="nsg-salary__plot-point"/g) || []).length, 5);
      const plotted = html.match(/<polyline points="([^"]+)"/)[1].split(' ').map(pair => pair.split(',').map(Number));
      for (const [index, point] of plotted.entries()) {
        assert.equal(point[0], 6 + index * 22);
        assert(Math.abs(point[1] - (90 - milestones[index].amount / 2500 * 66)) < 1e-8);
      }
      assert.match(html, /nsg-salary__rules[\s\S]*<button type="button"/);
      assert.doesNotMatch(html, /das\.nsg\.|NaN|undefined|check_in.png/);
      assert.equal((html.match(/class="nsg-salary__tier"/g) || []).length, mobile ? 5 : 0);
    }
  }
  const zero = await render(true, [{ day: 1, amount: 0 }]);
  assert.match(zero, /points="50,90"/);
  assert.doesNotMatch(await render(false, []), /NaN|undefined/);
  console.log('PASS: Salary PC/H5, 15 locales, unchanged data/API, live chart/zero/empty states, support control, scoped home CSS and six favicon sizes.');
} finally { await server.close(); }

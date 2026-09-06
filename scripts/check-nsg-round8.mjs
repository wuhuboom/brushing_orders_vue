import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parse, compileTemplate } from "@vue/compiler-sfc";

const read = path => readFile(path, "utf8");
const locales = ["en", "es", "fr", "de", "zh", "ko", "ja", "it", "id", "sv", "no", "ru", "hu", "pl", "sl"];
for (const locale of locales) {
  const { das } = JSON.parse(await read(`src/i18n/locales/${locale}.json`));
  for (const key of ["homeHeroTitle", "homeAgencyTitle", "prizeTitle", "prizeMessage", "prizeSupport"]) {
    assert.ok(das.nsg[key]?.trim(), `${locale}: ${key}`);
  }
  if (locale === "en") {
    assert.equal(das.nsg.homeHeroTitle, "Professional Web Services");
    assert.equal(das.nsg.homeAgencyTitle, "Phoenix Digital Agency");
  }
}
const home = await read("src/assets/nsg-marketing/home.html");
assert.match(home, /data-i18n="das.nsg.homeHeroTitle"/);
assert.match(home, /data-i18n="das.nsg.homeAgencyTitle"/);
const marketing = await read("src/components/dmk/NsgMarketingContent.vue");
assert.match(marketing, /heading.textContent = t\(heading.dataset.i18n\)/);

const header = await read("src/components/dmk/useDmkHeader.js");
const services = new Function(`return ${header.match(/export const services = (\[[\s\S]*?\]);/)[1]};`)();
assert.equal(services[0].path, "/");
assert.ok(!services[0].disabled);
assert.ok(services.slice(1).every(service => service.disabled));
for (const path of ["src/components/dmkPc/DmkPcHeader.vue", "src/components/dmkH5/DmkH5Header.vue"]) {
  assert.match(await read(path), /:disabled="service.disabled"/);
}

const starting = await read("src/views/starting/index.vue");
assert.doesNotMatch(starting.split("</DmkPcLayout>")[0], /nsg-product-support/);
assert.match(starting, /<DmkSupport inline class="nsg-product-support"/);
assert.match(starting, /:amount="bonusAmount"/);
assert.match(starting, /bonusAmount.value = res.data\?\.amount \?\? ""/);
const login = await read("src/views/account/login.vue");
assert.match(login, /<DmkSupport ref="pcSupport" inline class="nsg-login-support--pc"/);
assert.match(login, /nsg-login-username[\s\S]*nsg-login-support--h5/);

const bonus = await read("src/components/BonusDialog.vue");
assert.match(bonus, /\{\{ amount \}\}/);
assert.match(bonus, /USDT/);
assert.match(bonus, /@click="openCustomerService"/);
assert.match(bonus, /@click="close"/);
assert.doesNotMatch(bonus, /bonus-big-win|bonus-rays|tap-hand/);
assert.equal(createHash("sha256").update(await readFile("public/nsg16/bonus-prize-bg.png")).digest("hex"), "887968d9f2884e4450420936eee91c038104c80624178cd76f6b61976a5560fd");
const style = await read("src/style.css");
assert.match(style, /@keyframes nsg-loading-bloom/);
assert.match(style, /prefers-reduced-motion: reduce/);
assert.doesNotMatch(style.slice(style.indexOf(".dmk-request-loading"), style.indexOf(".dmk-api-message")), /d6ff32|214, 255, 50/);

for (const filename of ["src/components/BonusDialog.vue", "src/views/account/login.vue", "src/views/starting/index.vue", "src/components/dmk/DmkSupport.vue"]) {
  const { descriptor, errors } = parse(await read(filename), { filename });
  assert.deepEqual(errors, [], filename);
  const result = compileTemplate({ source: descriptor.template.content, filename, id: "round8" });
  assert.deepEqual(result.errors, [], filename);
}
console.log("NSG round 8 passed: 15 locales, live headings, disabled services, original prize artwork, dynamic amount, support positions and Vue templates.");

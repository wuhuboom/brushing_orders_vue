import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createDmkMessages } from "../src/i18n/dmk.messages.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const apiSource = await read("src/api/index.js");
const feedbackSource = apiSource.slice(apiSource.indexOf("let activeApiMessage"), apiSource.indexOf("const closeLoading"));
const calls = [];
const body = {};
const showError = new Function("ElMessage", "i18n", "document", `${feedbackSource}; return showApiError;`)(
  (options) => {
    const instance = { close: () => options.onClose() };
    calls.push({ options, instance });
    return instance;
  },
  { global: { t: () => "Request failed" } },
  { body },
);
showError("Insufficient balance");
assert.equal(calls[0].options.zIndex, 10000);
assert.equal(calls[0].options.appendTo, body);
assert.equal(calls[0].options.showClose, true);
assert.equal(calls[0].options.duration, 3200);
assert.equal(calls[0].options.type, "error");
showError("Insufficient balance");
assert.equal(calls.length, 1, "repeated API errors stay deduplicated");
showError("Another error");
assert.equal(calls.length, 2);
calls[1].instance.close();
showError("");
assert.equal(calls[2].options.message, "Request failed");

for (const [page, count] of [["home", 2], ["about", 1]]) {
  const html = await read(`src/assets/nsg-marketing/${page}.html`);
  assert.equal([...html.matchAll(/<button type="button" data-customer-service/g)].length, count);
  assert.doesNotMatch(html, /tel:|602-497-1058|Call \d/);
}
const marketing = await read("src/components/dmk/NsgMarketingContent.vue");
assert.match(marketing, /watchEffect\([\s\S]*?t\("das.dmk.contactCustomerService"\)/);
assert.match(marketing, /openCustomerServiceDialog\(\)/);
assert.match(marketing, /button.textContent = label/);
const files = (await readdir(new URL("../src/i18n/locales/", import.meta.url))).filter((file) => file.endsWith(".json"));
for (const file of files) {
  const locale = file.replace(".json", "");
  const messages = JSON.parse(await read(`src/i18n/locales/${file}`));
  const label = createDmkMessages(locale, messages).contactCustomerService;
  assert.ok(label?.trim(), `${locale} has a customer-service translation`);
  if (locale === "zh") assert.equal(label, "联系客服");
  if (locale === "en") assert.equal(label, "Contact Customer Service");
}
const css = await read("src/style.css");
assert.match(css, /\.dmk-api-message.el-message \{\s*z-index: 10000 !important/);
assert.match(css, /\.dmk-api-message \.el-message__content \{[^}]*overflow-wrap: anywhere/);
console.log(`NSG feedback checks passed: overlay layer, error deduplication, close/reset, three support buttons and ${files.length} locales.`);

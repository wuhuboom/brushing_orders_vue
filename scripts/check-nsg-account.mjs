import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { computed, ref, reactive } from "vue";
import { genderForUser, defaultAvatarForUser, hasUserAvatar } from "../src/utils/avatar.js";

const source = file => readFile(file, "utf8");
const password = await source("src/components/DasPasswordForm.vue");
const readiness = password.match(/const passwordReady = computed\([\s\S]*?\n\)\);/)[0];
const old = ref(""), next = ref(""), confirm = ref("");
const ready = new Function("computed", "oldValue", "newValue", "confirmation", `${readiness};return passwordReady;`)(computed, old, next, confirm);
assert.equal(ready.value, false);
old.value = "old-test"; next.value = confirm.value = "new-test";
assert.equal(ready.value, true);
confirm.value = "different";
assert.equal(ready.value, false);
confirm.value = "new-test"; old.value = "";
assert.equal(ready.value, false);
assert.equal((password.match(/'is-ready': passwordReady/g) || []).length, 2);

const profile = await source("src/views/profile/index.vue");
const mobileReadiness = profile.match(/const passwordReady = computed\(\(\) => \{[\s\S]*?\n\}\);/)[0];
const forms = reactive({ login: { old: "", new: "", confirm: "" }, transaction: { old: "", new: "", confirm: "" } });
const expanded = ref("");
const mobileReady = new Function("computed", "passwordForms", "expandedPassword", `${mobileReadiness};return passwordReady;`)(computed, forms, expanded);
assert.equal(mobileReady.value, false);
for (const key of ["login", "transaction"]) {
  expanded.value = key;
  Object.assign(forms[key], { old: "old-test", new: "new-test", confirm: "new-test" });
  assert.equal(mobileReady.value, true);
  forms[key].confirm = "mismatch";
  assert.equal(mobileReady.value, false);
  forms[key].confirm = "";
  assert.equal(mobileReady.value, false);
}
assert.match(profile, /\{\{ genderLabel \}\}/);
assert.equal(genderForUser({gender: 0}), "male");
assert.equal(genderForUser({gender: "0"}), "male");
assert.equal(genderForUser({gender: 1}), "female");
assert.equal(genderForUser({gender: "2"}), "female");
assert.equal(genderForUser({gender: 0, genderLabel: "Female"}), "female");
assert.equal(genderForUser({gender: null}), undefined);

const wallet = await source("src/views/paymentMethods/index.vue");
for (const field of ["walletName", "walletAddress", "bankAccount", "bankName", "accountHolder", "isDefault"]) {
  assert.equal((wallet.match(new RegExp(`v-model(?:\\.trim)?="form\\.${field}"`, "g")) || []).length, 2, `${field}: PC/H5 bindings preserved`);
}
assert.match(wallet, /const payload = \{ \.\.\.form, token: credential.value \}/);
assert.match(wallet, /await updateWithdrawalMethod\(route.query.id, payload\)/);
assert.match(wallet, /await addWithdrawalMethod\(payload\)/);
const my = await source("src/views/my/index.vue");
for (const name of ["wallet", "pending", "bonus", "commission"]) assert.match(my, new RegExp(`/nsg16/profile-${name}\\.png`));
const menu = await source("src/components/dmk/useDmkHeader.js");
for (const [,name] of menu.matchAll(/iconName: "([^"]+)"/g)) await access(`public/nsg16/menu-${name}.png`);
for (let i = 1; i <= 4; i++) await access(`public/nsg16/vip-badge-${i}.png`);

for (const [user, asset] of [
  [{ gender: 0 }, "avatar-man.png"], [{ gender: "0" }, "avatar-man.png"],
  [{ gender: 1 }, "avatar-woman.png"], [{ gender: "2" }, "avatar-woman.png"],
  [{ gender: 0, genderLabel: "Female" }, "avatar-woman.png"], [{ sex: "female" }, "avatar-woman.png"],
  [{}, "avatar-man.png"],
]) {
  assert.equal(defaultAvatarForUser(user), `/nsg16/${asset}`);
  await access(`public/nsg16/${asset}`);
}
for (const value of [null, undefined, "", " ", "null", "undefined", " NULL "]) assert.equal(hasUserAvatar(value), false);
for (const value of ["/uploads/custom.png", "https://example.invalid/avatar.png"]) assert.equal(hasUserAvatar(value), true);
const road = await source("src/components/dmk/DmkCreditRunner.vue");
assert.match(road, /prefers-reduced-motion: reduce/);
assert.doesNotMatch(road, /requestAnimationFrame|nsg-credit-flight|spring|const bend/);
assert.match(road, /nsg-credit-road__car/);
assert.match(road, /nsg-credit-road__exhaust/);
const percentCode = road.match(/const normalizedPercent = computed\(\(\) => \{[\s\S]*?\n\}\);/)[0];
for (const [input, expected] of [[43,43],[0,0],[100,100],[-1,0],[110,100],[NaN,0],[Infinity,0]]) {
  const percent = new Function("computed","props", `${percentCode};return normalizedPercent;`)(computed, {percentage:input});
  assert.equal(percent.value, expected);
}
const backPages = [
  "src/components/DasPageHeader.vue", "src/components/Header.vue", "src/components/DasPasswordForm.vue",
  "src/components/dmk/DmkRichContentPage.vue", "src/views/deposit/index.vue", "src/views/withdraw/index.vue",
  "src/views/withdrawRecords/index.vue", "src/views/profile/index.vue", "src/views/paymentMethods/index.vue",
  "src/views/account/login.vue", "src/views/account/register.vue", "src/views/records/index.vue",
  "src/views/vips/index.vue", "src/views/salary/index.vue", "src/views/starting/index.vue",
];
for (const file of backPages) {
  const text = await source(file);
  assert.match(text, /<NsgBackButton/);
  assert.doesNotMatch(text, />←<|&lsaquo;|static\/images\/back.png/);
}
const starting = await source("src/views/starting/index.vue");
assert.doesNotMatch(starting, /start-work-video\.mp4|start-loading-animation__scanner|>Bavor</);
assert.match(starting, /<NsgMatchingLoader \/>/);
assert.match(starting, /:show="startAnimationVisible"/);
console.log("NSG account checks passed: readiness, gender/avatar fallbacks, wallet bindings, supplied icons, fixed car progress and H5 back coverage.");

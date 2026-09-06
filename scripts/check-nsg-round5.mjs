import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { computed, reactive, ref } from "vue";
import { defaultAvatarForUser, genderForUser, hasUserAvatar } from "../src/utils/avatar.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const setup = (source, bindings, exports) => {
  const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1]
    .replace(/import[\s\S]*?from\s*["'][^"']+["'];/g, "")
    .replaceAll("import.meta.env.VITE_API_IMG_URL", '""');
  return new Function(...Object.keys(bindings), `${script}\nreturn {${exports}};`)(...Object.values(bindings));
};

const profile = await read("src/views/profileItem/index.vue");
let mounted;
let resolveUser;
const avatar = setup(profile, {
  computed, ref, useRouter: () => ({}), useI18n: () => ({ t: (key) => key }),
  onMounted: (callback) => { mounted = callback; },
  userGetInfo: () => new Promise((resolve) => { resolveUser = resolve; }),
  defaultAvatarForUser, genderForUser, hasUserAvatar,
  window: { g: { VITE_API_IMG_URL: "https://images.example/" } },
}, "user,userLoaded,pcAvatar");
assert.equal(avatar.pcAvatar.value, "", "no default image before the response");
const pending = mounted();
assert.equal(avatar.pcAvatar.value, "", "no default image during a pending request");
resolveUser({ data: { avatar: "custom.jpg", gender: 1 } });
await pending;
assert.equal(avatar.pcAvatar.value, "https://images.example/custom.jpg");
avatar.user.value = { avatar: "", gender: 1 };
assert.equal(avatar.pcAvatar.value, "/nsg16/avatar-woman.png");
avatar.user.value = { avatar: null, gender: 0 };
assert.equal(avatar.pcAvatar.value, "/nsg16/avatar-man.png");
assert.match(profile, /v-if="pcAvatar"/);
const editor = await read("src/views/profile/index.vue");
assert.match(editor, /displayAvatar = computed\(\(\) => avatarUrl.value\)/);
assert.equal((editor.match(/v-if="displayAvatar"/g) || []).length, 2);
assert.match(editor, /const handleAvatarError = \(\) => \{[\s\S]*?avatarUrl.value = "";/);

let time = 100;
const walletSource = await read("src/views/paymentMethods/index.vue");
const wallet = setup(walletSource, {
  computed, reactive, ref, nextTick: () => Promise.resolve(), onMounted: () => {},
  useRouter: () => ({}), useRoute: () => ({ query: { action: "create" } }),
  useI18n: () => ({ t: (key) => key }), getWithdrawalCredential: () => "test-only",
  performance: { now: () => time }, setTimeout: (callback) => callback(),
}, "types,form,pcPickerOpen,pcPickerIndex,pcOpenWalletEditor,selectPcWalletType,h5PickerOpen,h5PickerIndex,h5PickerPosition,openH5Picker,startH5PickerDrag,moveH5PickerDrag,endH5PickerDrag,confirmH5WalletType");
wallet.types.value = [{ id: 1, typeName: "BTC" }, { id: 2, typeName: "ETH" }, { id: 3, typeName: "USDC" }];
wallet.form.withdrawalTypeId = "1";
await wallet.pcOpenWalletEditor();
assert.equal(wallet.pcPickerOpen.value, true);
wallet.selectPcWalletType(1);
assert.equal(wallet.form.withdrawalTypeId, "2");
assert.equal(wallet.form.walletName, "ETH");
assert.equal(wallet.pcPickerOpen.value, false);
await wallet.openH5Picker();
const pointer = (y, type = "pointermove") => ({ pointerType: "touch", pointerId: 1, button: 0, clientY: y, type, currentTarget: { setPointerCapture() {}, releasePointerCapture() {} } });
wallet.startH5PickerDrag(pointer(200, "pointerdown"));
for (const offset of [1, 5, 17, 34]) {
  time += 16;
  wallet.moveH5PickerDrag(pointer(200 - offset));
  assert.equal(wallet.h5PickerPosition.value, 44 + offset, "drag follows every pixel, not 44px steps");
}
time += 100;
wallet.endH5PickerDrag(pointer(166, "pointerup"));
assert.equal(wallet.h5PickerPosition.value, 88, "release snaps to the nearest item");
assert.equal(wallet.form.withdrawalTypeId, "2", "drag alone does not change the saved selection");
wallet.confirmH5WalletType();
assert.equal(wallet.form.withdrawalTypeId, "3");
assert.equal(wallet.form.walletName, "USDC");
wallet.startH5PickerDrag(pointer(200, "pointerdown"));
time += 16;
wallet.moveH5PickerDrag(pointer(1000));
assert.equal(wallet.h5PickerPosition.value, 0, "drag remains bounded");
wallet.endH5PickerDrag(pointer(1000, "pointercancel"));
assert.match(walletSource, /role="combobox"/);
assert.match(walletSource, /class="nsg-wallet-select__options" role="listbox"/);
assert.doesNotMatch(walletSource, /dmk-pc-picker-columns|startPcPickerDrag/);

const marketing = await read("src/components/dmk/NsgMarketingContent.vue");
assert.match(marketing, /attachShadow/);
assert.match(marketing, /event.preventDefault\(\)/);
assert.match(marketing, /emit\("start-work"\)/);
for (const page of ["home", "about"]) {
  const html = await read(`src/assets/nsg-marketing/${page}.html`);
  assert.doesNotMatch(html, /<script|chrome-extension:|navigation-wrap|class="footer"/);
  for (const match of html.matchAll(/(?:src|url)=["']([^"']+)["']/g)) {
    if (!match[1].startsWith("/nsg16/")) continue;
    assert.ok((await readFile(new URL(`../public${match[1]}`, import.meta.url))).length);
  }
}
console.log("NSG round 5 checks passed: delayed avatar, gender fallback, desktop selection, continuous mobile drag, snap/confirm semantics, isolated marketing content and local assets.");

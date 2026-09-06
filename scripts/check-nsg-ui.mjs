import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import { Image } from "vant";
import { getPhoneRule, isValidPhone, localPhoneDigits } from "../src/config/phone.js";

// Isolated render checks: no authenticated app, API requests or order submissions.
const server = await createServer({ configFile: false, plugins: [vue()], server: { middlewareMode: true, hmr: false }, appType: "custom", optimizeDeps: { noDiscovery: true } });
try {
  const rail = (await server.ssrLoadModule("/src/components/dmk/NsgProductRail.vue")).default;
  const card = (await server.ssrLoadModule("/src/components/dmk/NsgTaskCard.vue")).default;
  const withdrawal = (await server.ssrLoadModule("/src/components/dmk/NsgWithdrawalList.vue")).default;
  const deposit = (await server.ssrLoadModule("/src/components/dmk/NsgDepositList.vue")).default;
  const withdrawForm = (await server.ssrLoadModule("/src/components/dmk/NsgWithdrawForm.vue")).default;
  const loginError = (await server.ssrLoadModule("/src/components/dmk/NsgLoginError.vue")).default;
  const render = async (component, props) => {
    const app = createSSRApp(component, props);
    app.config.globalProperties.$t = (key) => key;
    app.config.warnHandler = (message) => { throw new Error(message); };
    app.use(Image);
    return renderToString(app);
  };
  const loading = await render(rail, { loading: true });
  const matchingLoader = (await server.ssrLoadModule("/src/components/dmk/NsgMatchingLoader.vue")).default;
  const loaderHtml = await render(matchingLoader, {});
  assert.match(loaderHtml, /role="status"/);
  assert.match(loaderHtml, /nsg-matching-loader__track/);
  assert.match(loaderHtml, /nsg16\/logo.png/);
  assert.doesNotMatch(loaderHtml, /Bavor|starting.png|scanner/);
  const credit = (await server.ssrLoadModule("/src/components/dmk/DmkCreditRunner.vue")).default;
  const creditHtml = await render(credit, { percentage: 43 });
  assert.match(creditHtml, /aria-valuenow="43"/);
  assert.match(creditHtml, /width:43%/);
  assert.match(creditHtml, /nsg-credit-road__car/);
  assert.doesNotMatch(await render(credit, { percentage: 0 }), /<span class="nsg-credit-road__car"/);
  assert.match(loading, /nsg-product-skeleton/);
  assert.doesNotMatch(loading, /<img|product-airpods|SONY|Chanel|ROLEX/);
  const empty = await render(rail, { loading: false, products: [] });
  assert.match(empty, /das.common.noData/);
  assert.doesNotMatch(empty, /<img|nsg-product-tile/);
  const products = Array.from({ length: 9 }, (_, id) => ({ id, goodsName: `API record ${id}` }));
  const populated = await render(rail, { products, current: 8 });
  assert.match(populated, /API record 8/);
  assert.equal((populated.match(/\bnsg-product-tile\b/g) || []).length, 5);
  assert.equal((populated.match(/<button/g) || []).length, 7, "five cards plus previous/next controls");
  assert.match(populated, /das.nsg.previousProduct/);
  assert.match(populated, /das.nsg.nextProduct/);
  assert.doesNotMatch(populated, /<img|product-airpods|SONY|Chanel|ROLEX/);
  const details = { name: "API record", totalAmount: "961.10", profit: "9.61", commissionRate: "1%", createdAt: "2026-09-05 13:42:06", code: "order-code" };
  const pending = await render(card, { details, success: false });
  assert.match(pending, /das.dmk.productDetailsSubmission/);
  assert.match(pending, /das.dmk.submitOrder/);
  assert.match(pending, /nsg-copy-button/);
  assert.match(pending, /aria-label="das.nsg.copy"/);
  assert.doesNotMatch(pending, /das.started.created|das.records.submitted/);
  const success = await render(card, { details, success: true });
  assert.match(await render(card, { details, busy: true }), /van-loading/);
  assert.match(success, /das.started.created/);
  assert.match(success, /das.records.submitted/);
  assert.match(success, /das.auth.continue/);
  assert.doesNotMatch(success, /das.dmk.submitOrder/);
  // Exercise the real copy handlers with a popup focus trap and HTTP fallback.
  const copySource = await readFile('src/components/dmk/NsgCopyButton.vue', 'utf8');
  const copyHandlers = copySource.slice(copySource.indexOf('const fallbackCopy ='), copySource.indexOf('</script>'));
  const checkCopy = async ({ clipboard, popup = true, commandSucceeds = true, value = 'UI-only-copy-check' } = {}) => {
    let focused, selected, copiedText, restored = false, removed = false, toast;
    const container = { appendChild(input) { input.parent = this; } };
    const body = { appendChild(input) { input.parent = this; } };
    const previousFocus = { focus() { restored = true; } };
    const input = { style: {}, focus() { focused = this; }, select() { selected = this; }, setSelectionRange(start, end) { assert.equal(start, 0); assert.equal(end, String(value).length); }, remove() { removed = true; } };
    const document = { body, activeElement: previousFocus, createElement(tag) { assert.equal(tag, 'textarea'); return input; }, execCommand(command) { assert.equal(command, 'copy'); assert.equal(focused, input); assert.equal(selected, input); assert.equal(input.parent, popup ? container : body); copiedText = input.value; return commandSucceeds; } };
    const copy = new Function('document', 'navigator', 'button', 'props', 'showToast', `${copyHandlers}\nreturn copy;`)(document, { clipboard }, { value: { closest: () => popup ? container : null } }, { value }, options => { toast = options; });
    await copy(key => key);
    return { copiedText, restored, removed, toast };
  };
  const httpCopy = await checkCopy();
  assert.equal(httpCopy.copiedText, 'UI-only-copy-check');
  assert(httpCopy.restored && httpCopy.removed);
  assert.equal(httpCopy.toast.message, 'das.profile.copySuccess');
  assert.equal(httpCopy.toast.zIndex, 10000);
  assert.equal((await checkCopy({ clipboard: { writeText: async () => { throw new Error('Denied'); } } })).copiedText, 'UI-only-copy-check');
  assert.equal((await checkCopy({ popup: false, value: 0 })).copiedText, '0');
  assert.equal((await checkCopy({ commandSucceeds: false })).toast.message, 'das.profile.copyFailed');
  let clipboardValue;
  const apiCopy = await checkCopy({ clipboard: { writeText: async value => { clipboardValue = value; } } });
  assert.equal(clipboardValue, 'UI-only-copy-check');
  assert.equal(apiCopy.removed, false, 'Clipboard API success should not run the fallback');
  const withdrawalProps = {
    tabs: [{ status: "1", labelKey: "das.dmk.reviewing" }, { status: "2", labelKey: "das.common.success" }, { status: "3", labelKey: "das.dmk.reject" }],
    active: "2", finished: true,
    items: ["1", "2", "3"].map(status => ({ id: status, status, orderNumber: "202606308527379847163453440", createTime: "2026-06-30T15:54:08" })),
    formatDate: () => "2026-06-30 15:54:08",
    rows: item => [{ key: "walletAddress", label: "Wallet Address", value: "UI-only-address" }, { key: "status", label: "Status", value: item.status }],
  };
  const withdrawalHtml = await render(withdrawal, withdrawalProps);
  for (const state of ["reviewing", "success", "reject"]) assert.match(withdrawalHtml, new RegExp('<article class="[^"]*is-' + state));
  assert.equal((withdrawalHtml.match(/nsg-copy-button/g) || []).length, 3);
  assert.match(withdrawalHtml, /06-30 15:54/);
  assert.match(withdrawalHtml, /has-records nsg-withdraw-end|nsg-withdraw-end has-records/);
  const noWithdrawals = await render(withdrawal, { ...withdrawalProps, items: [] });
  for (const asset of ['status-reviewing.png', 'status-success.png', 'status-rejected.png']) assert(withdrawalHtml.includes(asset));
  const depositHtml = await render(deposit, { items: [{ id: 1, status: '2', amount: 100, receivedAmount: 0 }], formatDate: () => '2026-06-30 15:54:08', finished: true });
  assert.match(depositHtml, /das.dmk.currencyUsd 0/);
  assert.match(depositHtml, /das.records.completed/);
  assert.match(await render(deposit, { items: [{ id: 2, status: '3', amount: 50 }], formatDate: () => '', finished: true }), /deposit-failed.png/);
  assert.match(await render(deposit, { loading: true, formatDate: () => '' }), /van-loading/);
  const formHtml = await render(withdrawForm, { id: 'test', form: { amount: '', tradePassword: '' }, minimum: 25, balance: '100.00', hasAccount: true });
  assert.match(formHtml, /25 das.dmk.currencyUsd/);
  assert.match(formHtml, /withdraw-amount-icon.png/);
  assert.match(formHtml, /withdraw-password-icon.png/);
  assert.match(formHtml, /type="password"/);
  const vipSource = await readFile('src/views/vips/index.vue', 'utf8');
  assert.match(vipSource, /levels.value = \(await getLevel\(\)\).data/);
  assert.equal((vipSource.match(/:src="levelIcon\(item, index\)"/g) || []).length, 2);
  assert.equal((vipSource.match(/in item.descriptionLines/g) || []).length, 2);
  assert.match(await render(withdrawal, { ...withdrawalProps, loading: true }), /van-loading/);
  assert.doesNotMatch(noWithdrawals, /<article/);
  assert.match(noWithdrawals, /das.dmk.noMoreData/);
  const starting = await readFile("src/views/starting/index.vue", "utf8");
  assert.doesNotMatch(starting, /fallbackProduct|placeholder-\$|product-airpods\.png/);
  assert.match(starting, /class="nsg-mobile-history-stats"/);
  assert.doesNotMatch(starting, /nsg-mobile-history-stat:nth-of-type/, "history columns must not depend on the image component's tag");
  const submit = await readFile("src/components/dmk/DmkSubmitTask.vue", "utf8");
  assert(submit.indexOf("submissionSucceeded.value = true") > submit.indexOf("await submitOrder(props.order.id)"));
  assert.match(submit, /emit\("submitted"/);
  assert.match(submit, /Number\(error\?\.code\) === 916/);
  assert.match(submit, /Number\(error\?\.code\) === 918/);
  const errorDialog = await render(loginError, {});
  assert.match(errorDialog, /das.auth.wrongCredentialsHint/);
  assert.match(errorDialog, /<circle/);
  assert.equal((errorDialog.match(/<button/g) || []).length, 1);
  assert.doesNotMatch(errorDialog, /login-error-dialog__close|status-error.png/);
  const serverError = await render(loginError, { message: "API error message" });
  assert.match(serverError, /API error message/);
  assert.doesNotMatch(serverError, /das.auth.wrongCredentialsHint/);

  // Execute the actual presentation expression with isolated form values.
  const registration = await readFile("src/views/account/register.vue", "utf8");
  const readinessSource = registration.match(/const registrationReady = computed\([\s\S]*?\n\)\);/)[0];
  const emailSource = registration.match(/const emailReg = .*;/)[0];
  const readiness = new Function("computed", "form", "confirmPassword", "localPhone", "selectedCountry", "selectedPhoneRule", "agreed", "isValidPhone", "localPhoneDigits", `${emailSource}\n${readinessSource}\nreturn registrationReady;`);
  const valid = { username: "UI-only", password: "preview-only", tradePassword: "preview-only", gender: "0", inviteCode: "UI-only", email: "preview@example.invalid" };
  const ready = (form = valid, options = {}) => readiness((fn) => fn(), form, { value: options.confirm ?? "preview-only" }, { value: options.phone ?? "2025550100" }, { value: { dial: "1" } }, { value: getPhoneRule({ dial: "1" }) }, { value: options.agreed ?? true }, isValidPhone, localPhoneDigits);
  assert.equal(ready(), true);
  assert.equal(ready({ ...valid, email: "" }), true, "email remains optional");
  for (const field of ["username", "password", "tradePassword", "gender", "inviteCode"]) assert.equal(ready({ ...valid, [field]: "" }), false, field);
  assert.equal(ready(valid, { agreed: false }), false);
  assert.equal(ready(valid, { confirm: "different" }), false);
  assert.equal(ready(valid, { phone: "123" }), false);
  assert.equal(ready({ ...valid, email: "invalid" }), false);
  assert.equal((registration.match(/'is-ready': registrationReady/g) || []).length, 2, "PC and H5 share readiness");
  for (const header of ["dmkPc/DmkPcHeader", "dmkH5/DmkH5Header"]) {
    const source = await readFile(`src/components/${header}.vue`, "utf8");
    assert.doesNotMatch(source, /\$t\("das.dmk.login"\)/);
    assert.match(source, /openPath\('\/account\/login'\)/);
  }
  console.log("NSG auth checks passed: shared readiness, optional email, invalid/cleared fields, agreement, Start Work labels and error presentation.");
  console.log("NSG UI checks passed: loading, empty, API-only products, active item, pending/success states, withdrawal states/copy controls, mobile history layout and submission guards.");
} finally {
  await server.close();
}

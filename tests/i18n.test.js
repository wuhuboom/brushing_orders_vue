import assert from "node:assert/strict";
import { test } from "node:test";
import { dasMessages } from "../src/i18n/das.js";

const koreanNamespaces = [
  "common",
  "nav",
  "auth",
  "home",
  "page",
  "profile",
  "profileGroups",
  "form",
  "records",
  "product",
  "started",
  "contact",
  "deposit",
  "transaction",
  "withdraw",
  "vip",
  "logout",
];

test("Korean DAS messages cover every English page namespace", () => {
  for (const namespace of koreanNamespaces) {
    const englishKeys = Object.keys(dasMessages.en[namespace]);
    const koreanKeys = Object.keys(dasMessages.ko[namespace]);

    assert.deepEqual(
      englishKeys.filter((key) => !koreanKeys.includes(key)),
      [],
      `${namespace} is missing Korean keys`,
    );
  }
});

test("Korean navigation and primary page labels do not fall back to English", () => {
  assert.equal(dasMessages.ko.common.confirm, "확인");
  assert.equal(dasMessages.ko.nav.getStarted, "시작하기");
  assert.equal(dasMessages.ko.home.shortcuts, "바로가기");
  assert.equal(dasMessages.ko.page.language, "언어");
  assert.equal(dasMessages.ko.profileGroups.financial, "자금 관리");
  assert.equal(dasMessages.ko.started.startNow, "지금 시작");
  assert.equal(dasMessages.ko.records.completed, "완료");
});

const fullyLocalizedLocales = ["es", "fr", "de", "it", "id"];
const primaryNamespaces = [
  "common",
  "nav",
  "home",
  "page",
  "profile",
  "profileGroups",
];

test("all supported European and Indonesian locales cover primary pages", () => {
  for (const locale of fullyLocalizedLocales) {
    for (const namespace of primaryNamespaces) {
      const englishKeys = Object.keys(dasMessages.en[namespace]);
      const localizedKeys = Object.keys(dasMessages[locale][namespace]);
      assert.deepEqual(
        englishKeys.filter((key) => !localizedKeys.includes(key)),
        [],
        `${locale}.${namespace} is missing localized keys`,
      );
    }
  }
});

test("primary page markers do not fall back to English", () => {
  for (const locale of fullyLocalizedLocales) {
    assert.notEqual(dasMessages[locale].common.confirm, dasMessages.en.common.confirm);
    assert.notEqual(dasMessages[locale].home.shortcuts, dasMessages.en.home.shortcuts);
    assert.notEqual(dasMessages[locale].page.language, dasMessages.en.page.language);
    assert.notEqual(
      dasMessages[locale].profileGroups.financial,
      dasMessages.en.profileGroups.financial,
    );
  }
});

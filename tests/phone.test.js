import test from "node:test";
import assert from "node:assert/strict";
import {
  PHONE_COUNTRIES,
  DEFAULT_PHONE_RULE,
  getPhoneCountry,
  getPhoneRule,
  localPhoneDigits,
  phoneDigitCount,
  formatPhoneNumber,
  isValidPhone,
} from "../src/config/phone.js";

test("country selection accepts string IDs and falls back to the default", () => {
  assert.equal(getPhoneCountry("4").dial, "86");
  assert.equal(getPhoneCountry("unknown").id, 1);
  assert.equal(getPhoneRule({ dial: "unknown" }), DEFAULT_PHONE_RULE);
});

test("phone formatting handles empty, partial, formatted and overlong input", () => {
  const rule = getPhoneRule({ dial: "1" });
  assert.equal(localPhoneDigits(null), "");
  assert.equal(localPhoneDigits("(202) 555-0100"), "2025550100");
  assert.equal(formatPhoneNumber("", rule), "");
  assert.equal(formatPhoneNumber("202", rule), "(202");
  assert.equal(formatPhoneNumber("2025550100", rule), "(202) 555-0100");
  assert.equal(formatPhoneNumber("202555010099", rule), "(202) 555-0100");
});

test("validation rejects missing, non-digit and overlong international input", () => {
  const rule = getPhoneRule({ dial: "1" });
  for (const value of ["", "202 555 0100", "+2025550100", "202555010a"]) {
    assert.equal(isValidPhone(value, "1", rule), false, value);
  }
  assert.equal(isValidPhone("1234567890", "123456", rule), false);
});

for (const country of PHONE_COUNTRIES) {
  test(`${country.name}: configured phone length boundaries and formatting`, () => {
    const rule = getPhoneRule(country);
    assert.notEqual(rule, DEFAULT_PHONE_RULE);
    assert.ok(phoneDigitCount(rule) >= rule.max);
    assert.equal(isValidPhone("2".repeat(rule.min - 1), country.dial, rule), false);
    assert.equal(isValidPhone("2".repeat(rule.min), country.dial, rule), true);
    assert.equal(isValidPhone("2".repeat(rule.max), country.dial, rule), true);
    assert.equal(isValidPhone("2".repeat(rule.max + 1), country.dial, rule), false);
    const digits = "2".repeat(rule.max);
    assert.equal(localPhoneDigits(formatPhoneNumber(digits, rule)), digits);
  });
}

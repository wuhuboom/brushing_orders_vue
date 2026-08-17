import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  DEFAULT_PHONE_COUNTRY_ID,
  PHONE_COUNTRIES,
  formatPhoneNumber,
  getPhoneCountry,
  getPhoneRule,
  isValidPhone,
  localPhoneDigits,
  phoneDigitCount,
} from "../src/config/phone.js";

const digits = (length) => "1".repeat(Math.max(0, length));

describe("phone country configuration", () => {
  test("uses numeric country ids with United States first and United Kingdom second", () => {
    assert.equal(DEFAULT_PHONE_COUNTRY_ID, 1);
    assert.equal(getPhoneCountry(1).name, "United States");
    assert.equal(getPhoneCountry(2).name, "United Kingdom");
    assert.equal(getPhoneCountry("2").name, "United Kingdom");
  });

  test("falls back to United States for an unknown configuration value", () => {
    assert.equal(getPhoneCountry(undefined).name, "United States");
    assert.equal(getPhoneCountry(999).name, "United States");
  });

  test("all country ids are unique positive integers", () => {
    const ids = PHONE_COUNTRIES.map((country) => country.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.every((id) => Number.isInteger(id) && id > 0));
  });
});

describe("phone length validation", () => {
  for (const country of PHONE_COUNTRIES) {
    test(`${country.name} (+${country.dial}) accepts only ${getPhoneRule(country).min}-${getPhoneRule(country).max} local digits`, () => {
      const rule = getPhoneRule(country);

      assert.equal(phoneDigitCount(rule), rule.max);
      assert.equal(isValidPhone(digits(rule.min - 1), country.dial, rule), false);
      assert.equal(isValidPhone(digits(rule.min), country.dial, rule), true);
      assert.equal(isValidPhone(digits(rule.max), country.dial, rule), true);
      assert.equal(isValidPhone(digits(rule.max + 1), country.dial, rule), false);

      const formatted = formatPhoneNumber(digits(rule.max + 5), rule);
      assert.equal(localPhoneDigits(formatted).length, rule.max);
      assert.ok(`${country.dial}${localPhoneDigits(formatted)}`.length <= 15);
    });
  }

  test("rejects non-digit phone values", () => {
    const country = getPhoneCountry(1);
    assert.equal(isValidPhone("555ABC0199", country.dial, getPhoneRule(country)), false);
  });
});

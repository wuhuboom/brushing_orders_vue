import assert from "node:assert/strict";
import { test } from "node:test";
import { formatTime } from "../src/util/times.js";

const afternoon = new Date(2026, 10, 19, 13, 5, 9);
const expected = "11/19/2026 | 01:05:09 PM";

test("formats numeric API timestamps in seconds and milliseconds like Vue 18", () => {
  for (const value of [afternoon.getTime(), afternoon.getTime() / 1000]) {
    assert.equal(formatTime(value), expected);
  }
});

test("accepts numeric timestamp strings returned by the API", () => {
  for (const value of [
    String(afternoon.getTime()),
    String(afternoon.getTime() / 1000),
  ]) {
    assert.equal(formatTime(value), expected);
  }
});

test("uses 12 AM at midnight and 12 PM at noon", () => {
  assert.equal(
    formatTime(new Date(2026, 0, 2, 0).getTime()),
    "01/02/2026 | 12:00:00 AM",
  );
  assert.equal(
    formatTime(new Date(2026, 0, 2, 12).getTime()),
    "01/02/2026 | 12:00:00 PM",
  );
});

test("rejects date strings instead of using them as a timestamp fallback", () => {
  for (const value of [
    "2026-11-19 13:05:09",
    "2026-11-19T13:05:09",
    afternoon.toISOString(),
  ]) {
    assert.equal(formatTime(value), "—");
  }
});

test("shows a placeholder for missing, invalid, or out-of-range timestamps", () => {
  for (const value of [
    undefined,
    null,
    "",
    " ",
    "invalid",
    0,
    "0",
    -1,
    NaN,
    Infinity,
    1e20,
  ]) {
    assert.equal(formatTime(value), "—");
  }
});

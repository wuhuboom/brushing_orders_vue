import assert from "node:assert/strict";
import test from "node:test";

import { formatTime } from "../src/util/times.js";

const timestamp = Date.UTC(2026, 10, 19, 6, 5, 9);

test("formats API second and millisecond timestamps using the reference US format", () => {
  for (const value of [
    timestamp,
    String(timestamp),
    timestamp / 1000,
    String(timestamp / 1000),
  ]) {
    assert.equal(
      formatTime(value, "Asia/Shanghai"),
      "11/19/2026 | 02:05:09 PM",
    );
  }
});

test("does not fall back to API date strings", () => {
  for (const value of [
    "2026-11-19 14:05:09",
    "2026-11-19T14:05:09",
    " 2026-11-19 14:05:09 ",
  ]) {
    assert.equal(formatTime(value), "—");
  }
  assert.equal(formatTime("2026-11-19"), "—");
});

test("formats midnight, noon and explicitly zoned dates correctly", () => {
  assert.equal(
    formatTime(Date.UTC(2026, 10, 19, 6, 5, 9), "Asia/Shanghai"),
    "11/19/2026 | 02:05:09 PM",
  );
  assert.equal(
    formatTime(timestamp, "America/New_York"),
    "11/19/2026 | 01:05:09 AM",
  );
  assert.equal(
    formatTime(Date.UTC(2026, 10, 19, 0, 0, 0), "UTC"),
    "11/19/2026 | 12:00:00 AM",
  );
  assert.equal(
    formatTime(Date.UTC(2026, 10, 19, 12, 0, 0), "UTC"),
    "11/19/2026 | 12:00:00 PM",
  );
  assert.equal(
    formatTime(Date.UTC(2026, 10, 19, 20, 5, 9), "Asia/Shanghai"),
    "11/20/2026 | 04:05:09 AM",
  );
});

test("shows a placeholder for missing or invalid API date times", () => {
  for (const value of [
    undefined,
    null,
    "",
    " ",
    "invalid",
    0,
    "0",
    -1,
    "-1",
    NaN,
    Infinity,
  ]) {
    assert.equal(formatTime(value), "—");
  }
});

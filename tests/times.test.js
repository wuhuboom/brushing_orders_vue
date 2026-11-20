import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  formatDateTime,
  formatWorkTime,
  parseDateTime,
} from "../src/util/times.js";

const timestamp = Date.UTC(2026, 10, 20, 5, 6, 7);

test("formats API timestamps in seconds and milliseconds like Vue 18", () => {
  for (const value of [
    timestamp,
    timestamp / 1000,
    String(timestamp),
    String(timestamp / 1000),
  ]) {
    assert.equal(formatDateTime(value, "UTC"), "11/20/2026 | 05:06:07 AM");
    assert.equal(parseDateTime(value).getTime(), timestamp);
  }
  assert.equal(
    formatDateTime(timestamp, "Asia/Shanghai"),
    "11/20/2026 | 01:06:07 PM",
  );
  assert.equal(
    formatDateTime(Date.UTC(2026, 10, 20), "UTC"),
    "11/20/2026 | 12:00:00 AM",
  );
});

test("missing or invalid timestamps never fall back to date strings or current time", () => {
  for (const value of [
    undefined,
    null,
    "",
    " ",
    0,
    "0",
    -1,
    NaN,
    Infinity,
    "invalid",
    "2026-11-20 05:06:07",
    "2026-11-20T05:06:07Z",
    new Date(timestamp),
    true,
    [],
    {},
    "999999999999999999999",
  ]) {
    assert.equal(formatDateTime(value), "—");
    assert.ok(Number.isNaN(parseDateTime(value).getTime()));
  }
});

test("default formatting uses the browser local timezone", () => {
  const script = `import { formatDateTime } from ${JSON.stringify(new URL("../src/util/times.js", import.meta.url).href)}; process.stdout.write(formatDateTime(${timestamp}));`;
  for (const [TZ, expected] of [
    ["Asia/Shanghai", "11/20/2026 | 01:06:07 PM"],
    ["America/New_York", "11/20/2026 | 12:06:07 AM"],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      { env: { ...process.env, TZ }, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, expected);
  }
});

test("all record displays and notice grouping use only createTimeTimestamp", () => {
  const files = [
    "components/OrderCard.vue",
    "views/records/index.vue",
    "views/productInfo/index.vue",
    "views/deposit/index.vue",
    "views/withdrawRecords/index.vue",
    "views/transactionActivity/index.vue",
    "views/notice/index.vue",
    "views/noticeDetail/index.vue",
  ];
  for (const file of files) {
    const source = readFileSync(
      new URL(`../src/${file}`, import.meta.url),
      "utf8",
    );
    assert.match(
      source,
      /formatDateTime\((?:item|notice|order\.value)\.createTimeTimestamp\)/,
      file,
    );
    assert.doesNotMatch(
      source,
      /\.(?:createTime|createdTime|createdAt|createTimestamp)\b/,
      file,
    );
  }
  const notice = readFileSync(
    new URL("../src/views/notice/index.vue", import.meta.url),
    "utf8",
  );
  assert.match(notice, /parseDateTime\(item\.createTimeTimestamp\)/);
});

test("business hours retain their existing clock format", () => {
  for (const [value, expected] of [
    ["9", "09:00"],
    ["9:30", "09:30"],
    ["18:45:00", "18:45"],
    ["2026-11-20T09:30:00", "09:30"],
    [null, ""],
  ]) {
    assert.equal(formatWorkTime(value), expected);
  }
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  getMemberLevelDescriptionLines,
  getMemberLevelMetrics,
} from "../src/utils/memberLevel.js";

test("renders each backend VIP description paragraph as safe plain text", () => {
  const description =
    "<p><strong>●Suitable for most data capture scenarios involving light to medium usage</strong></p>" +
    "<p><strong>●Profit of 0.5% per product data</strong></p>" +
    "<p><strong>●40 product data per set</strong></p>" +
    "<p><strong>●Up to 80 data submissions per day</strong></p>" +
    "<p><strong>●Can complete 2 sets of data submissions per day</strong></p>" +
    "<p><strong>●No access to other Premium features</strong></p>";

  assert.deepEqual(getMemberLevelDescriptionLines(description), [
    "●Suitable for most data capture scenarios involving light to medium usage",
    "●Profit of 0.5% per product data",
    "●40 product data per set",
    "●Up to 80 data submissions per day",
    "●Can complete 2 sets of data submissions per day",
    "●No access to other Premium features",
  ]);
});

test("escapes description markup instead of injecting backend HTML", () => {
  assert.deepEqual(
    getMemberLevelDescriptionLines(
      '<p onclick="bad()">Safe &amp; visible<script>alert(1)</script></p>',
    ),
    ["Safe & visible"],
  );
});

test("maps VIP metrics from the member-level API response", () => {
  assert.deepEqual(
    getMemberLevelMetrics({
      price: 100,
      orderCountPerDay: 50,
      minCommissionRate: 1.5,
      maxContinuousCommissionRate: 15,
      taskCountPerDay: 2,
    }),
    {
      price: "100 USD",
      dataPerSet: "50",
      profitPerTransaction: "1.5%",
      mergedProfit: "15%",
      tasksPerDay: "2",
    },
  );
});

test("does not replace missing or zero backend values with hardcoded defaults", () => {
  assert.deepEqual(getMemberLevelMetrics(), {
    price: "—",
    dataPerSet: "—",
    profitPerTransaction: "—",
    mergedProfit: "—",
    tasksPerDay: "—",
  });

  assert.deepEqual(
    getMemberLevelMetrics({
      minBalance: 0,
      orderCountPerDay: 0,
      minCommissionRate: 0,
      maxContinuousCommissionRate: 0,
      taskCountPerDay: 0,
    }),
    {
      price: "0 USD",
      dataPerSet: "0",
      profitPerTransaction: "0%",
      mergedProfit: "0%",
      tasksPerDay: "0",
    },
  );
});

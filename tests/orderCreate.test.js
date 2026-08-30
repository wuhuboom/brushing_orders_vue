import assert from "node:assert/strict";
import test from "node:test";

import {
  getOrderErrorKey,
  parseCreateOrderResponse,
} from "../src/utils/orderCreate.js";

test("normalizes an ORDER create response for the product details page", () => {
  const response = {
    code: 200,
    resultType: "ORDER",
    data: { id: 9, orderNumber: "WD9", productTitle: "Camera" },
  };
  const result = parseCreateOrderResponse(response, (order) => ({
    ...order,
    orderNo: order.orderNumber,
    goodsName: order.productTitle,
  }));

  assert.equal(result.resultType, "ORDER");
  assert.equal(result.data.orderNo, "WD9");
  assert.equal(result.data.goodsName, "Camera");
});

test("keeps BONUS data separate and does not run order normalization", () => {
  const bonus = {
    id: 21,
    orderNum: 4,
    amount: 18.5,
    animationDuration: 2,
    displayDuration: 5,
    distributionType: "TASK",
  };
  const result = parseCreateOrderResponse(
    { code: 200, resultType: "BONUS", data: bonus },
    () => {
      throw new Error("order normalizer must not run for a bonus");
    },
  );

  assert.deepEqual(result, { resultType: "BONUS", data: bonus });
});

test("infers legacy responses and maps all documented create error codes", () => {
  assert.equal(
    parseCreateOrderResponse({ data: { displayDuration: 3 } }).resultType,
    "BONUS",
  );
  assert.equal(
    parseCreateOrderResponse({ data: { orderNumber: "WD1" } }).resultType,
    "ORDER",
  );

  for (const code of [
    500, 901, 902, 904, 905, 906, 908, 910, 911, 912, 913, 914, 916,
    918, 921, 922, 923,
  ]) {
    assert.match(getOrderErrorKey(code), /^das\.orderErrors\./);
  }
});

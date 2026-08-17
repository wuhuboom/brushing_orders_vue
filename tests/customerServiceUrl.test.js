import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCustomerServiceUrl,
  customerServiceVisitor,
} from "../src/utils/customerServiceUrl.js";

const chatUrl =
  "https://serve.madebydasother.cc/chatIndex?kefu_id=madebydas&ent_id=2&lang=en";

test("appends the logged-in visitor to supported chat links", () => {
  assert.equal(
    buildCustomerServiceUrl(chatUrl, {
      isLoggedIn: true,
      user: { id: 108, username: "wuhu 10" },
    }),
    `${chatUrl}&visitor_id=108&visitor_name=wuhu%2010`,
  );
});

test("does not identify anonymous visitors", () => {
  assert.equal(
    buildCustomerServiceUrl(chatUrl, {
      isLoggedIn: false,
      user: { id: 108, username: "wuhu10" },
    }),
    chatUrl,
  );
});

test("leaves unrelated or incomplete customer-service links unchanged", () => {
  for (const url of [
    "https://example.com/chatIndex?lang=en",
    "https://example.com/?ent_id=2",
    "https://example.com/support?ent_id=2",
  ]) {
    assert.equal(
      buildCustomerServiceUrl(url, {
        isLoggedIn: true,
        user: { id: 108, username: "wuhu10" },
      }),
      url,
    );
  }
});

test("requires both visitor fields and supports backend aliases", () => {
  assert.equal(
    buildCustomerServiceUrl(chatUrl, {
      isLoggedIn: true,
      user: { userId: 0, userName: "访客&A" },
    }),
    `${chatUrl}&visitor_id=0&visitor_name=${encodeURIComponent("访客&A")}`,
  );
  assert.equal(
    buildCustomerServiceUrl(chatUrl, {
      isLoggedIn: true,
      user: { id: 108 },
    }),
    chatUrl,
  );
  assert.deepEqual(customerServiceVisitor({ memberId: 9, name: "Nine" }), {
    id: 9,
    name: "Nine",
  });
});

test("inserts visitor parameters before URL fragments", () => {
  assert.equal(
    buildCustomerServiceUrl(`${chatUrl}#conversation`, {
      isLoggedIn: true,
      user: { id: 108, username: "wuhu10" },
    }),
    `${chatUrl}&visitor_id=108&visitor_name=wuhu10#conversation`,
  );
});

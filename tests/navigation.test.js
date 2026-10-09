import assert from "node:assert/strict";
import test from "node:test";

import { profileNavigationAction } from "../src/utils/navigation.js";

test("opens My from a primary page without replacing that page", () => {
  for (const path of ["/", "/starting", "/records"]) {
    assert.equal(profileNavigationAction(path, ""), "push");
  }
});

test("returns to the existing My entry instead of adding a history loop", () => {
  assert.equal(profileNavigationAction("/withdraw", "/my"), "back");
});

test("preserves Withdraw in history when opening My", () => {
  assert.equal(profileNavigationAction("/withdraw", "/"), "push");
});

test("does nothing when My is already open", () => {
  assert.equal(profileNavigationAction("/my", "/withdraw"), "stay");
});

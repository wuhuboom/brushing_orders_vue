import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultAvatarForUser,
  isFemaleUser,
} from "../src/utils/avatar.js";

const avatars = { male: "male.png", female: "female.png" };

test("uses the female default avatar for the registration gender value", () => {
  assert.equal(isFemaleUser({ gender: "1" }), true);
  assert.equal(
    defaultAvatarForUser({ gender: "1" }, avatars),
    "female.png",
  );
});

test("recognizes common female values returned by the backend", () => {
  for (const user of [
    { sex: 1 },
    { gender: "female" },
    { rawGender: "F" },
    { sexName: "女性" },
  ]) {
    assert.equal(isFemaleUser(user), true);
  }
});

test("keeps the existing male avatar as the default for other values", () => {
  for (const user of [
    { gender: "0" },
    { gender: "male" },
    {},
  ]) {
    assert.equal(defaultAvatarForUser(user, avatars), "male.png");
  }
});

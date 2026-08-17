import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultAvatarForUser,
  genderForUser,
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
    { rawGender: 2 },
    { genderCode: "2" },
    { gender: "female" },
    { rawGender: "F" },
    { sexName: "女性" },
  ]) {
    assert.equal(isFemaleUser(user), true);
  }
});

test("normalizes backend gender codes consistently across profile pages", () => {
  assert.equal(genderForUser({ rawGender: "0" }), "male");
  assert.equal(genderForUser({ rawGender: "1" }), "female");
  assert.equal(genderForUser({ rawGender: "2" }), "female");
  assert.equal(genderForUser({ genderName: "Male" }), "male");
  assert.equal(genderForUser({}), undefined);
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

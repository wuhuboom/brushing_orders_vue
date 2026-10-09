import assert from "node:assert/strict";
import test from "node:test";

import { normalizeHttpError } from "../src/utils/apiError.js";

test("preserves documented business codes from non-2xx HTTP responses", () => {
  const normalized = normalizeHttpError({
    message: "Request failed with status code 409",
    response: {
      status: 409,
      data: { code: 918, msg: "Please try again later" },
    },
  });

  assert.deepEqual(normalized, {
    code: 918,
    msg: "Please try again later",
    httpStatus: 409,
  });
});

test("keeps network errors unchanged when no business response exists", () => {
  const error = new Error("timeout");
  assert.equal(normalizeHttpError(error), error);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { listRepoFiles } from "../support/repo-files.mjs";

test("no test lives outside tests/", () => {
  const misplaced = listRepoFiles().filter((path) => path.endsWith(".test.mjs") && !path.startsWith("tests/"));
  assert.deepEqual(misplaced, []);
});

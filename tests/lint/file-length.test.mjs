import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, listRepoFiles } from "../support/repo-files.mjs";

const MAX_LINES = 300;
const CHECKED = /\.(mjs|js|html|css|json|md|yml)$/;

test("no repository file is longer than 300 lines", () => {
  const tooLong = listRepoFiles()
    .filter((path) => CHECKED.test(path) && path !== "package-lock.json")
    .map((path) => [path, readFileSync(join(REPO_ROOT, path), "utf8").split("\n").length])
    .filter(([, lines]) => lines > MAX_LINES);
  assert.deepEqual(tooLong, [], `Files too long : ${tooLong.map(([p, n]) => `${p} (${n})`).join(", ")}`);
});

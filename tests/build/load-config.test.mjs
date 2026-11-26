import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig } from "../../scripts/build/load-config.mjs";

function configFile(config) {
  const path = join(mkdtempSync(join(tmpdir(), "config-")), "site.config.json");
  writeFileSync(path, JSON.stringify(config));
  return path;
}

test("the repository's own config builds locally", () => {
  assert.ok(loadConfig(new URL("../../site.config.json", import.meta.url).pathname, { release: false }));
});

test("a mailto or Tally contact is accepted for release", () => {
  for (const contactUrl of ["mailto:bonjour@cabinet-test.fr", "https://tally.so/r/wAbC12"]) {
    assert.ok(loadConfig(configFile({ siteName: "Atelier", contactUrl }), { release: true }));
  }
});

test("the placeholder contact builds locally but not for release", () => {
  const path = configFile({ siteName: "Atelier", contactUrl: "mailto:contact@example.org" });
  assert.ok(loadConfig(path, { release: false }));
  assert.throws(() => loadConfig(path, { release: true }), /placeholder/);
});

test("a trademark in the name is refused", () => {
  for (const siteName of ["Claude Conseil", "Atelier anthropic"]) {
    assert.throws(() => loadConfig(configFile({ siteName, contactUrl: "mailto:a@b.fr" }), { release: false }), /trademark/);
  }
});

test("a missing name or a malformed contact is refused, naming both", () => {
  assert.throws(() => loadConfig(configFile({ siteName: " ", contactUrl: "bonjour@cabinet.fr" }), { release: false }), /siteName[\s\S]*contactUrl/);
});

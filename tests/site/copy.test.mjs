import { test } from "node:test";
import assert from "node:assert/strict";
import { RELEASE_CONFIG, buildWith } from "./build-fixture.mjs";

const html = buildWith(RELEASE_CONFIG, { release: true }).read("index.html");
const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

test("every section of the offer is on the page", () => {
  for (const id of ["pour-qui", "installation", "deroule", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`), id);
  }
});

test("we sell consulting and change management, never a training", () => {
  // "organismes de formation" names a kind of client, not what we sell.
  const withoutClientType = text.replace(/organismes de formation/gi, "");
  assert.doesNotMatch(withoutClientType, /formations?\b|formateur/i);
  assert.match(text, /accompagnement au changement/i);
});

test("the page shows no price", () => {
  assert.doesNotMatch(text, /€|\bHT\b|tarif|formules?\b/i);
});

test("the copy speaks of AI and Anthropic, never of Claude", () => {
  assert.doesNotMatch(html, /claude/i);
  assert.match(text, /l'IA d'Anthropic/);
});

test("the journey has its four steps, in order", () => {
  const steps = ["Premier échange", "Atelier de découverte", "Mise en place et ateliers", "Bilan"];
  const positions = steps.map((step) => html.indexOf(`<h3>${step}</h3>`));
  assert.ok(positions.every((p) => p > 0), positions.join());
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test("the legal frame is named: AI Act article 4 and GDPR", () => {
  assert.match(text, /AI Act \(article\s4\)/);
  assert.match(text, /RGPD/);
});

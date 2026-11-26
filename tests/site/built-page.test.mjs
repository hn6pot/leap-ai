import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { RELEASE_CONFIG, buildWith } from "./build-fixture.mjs";
import { FORBIDDEN } from "../support/forbidden-words.mjs";

const site = buildWith(RELEASE_CONFIG, { release: true });
const html = site.read("index.html");
const attributes = (name) => [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map((m) => m[1]);

test("the page is in French, with a title and a description", () => {
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
});

test("no script, no iframe, nothing loaded from another host", () => {
  assert.doesNotMatch(html, /<script|<iframe|<object|<embed/i);
  for (const src of attributes("src")) assert.doesNotMatch(src, /^(https?:)?\/\//, src);
  for (const [, tag] of html.matchAll(/<link ([^>]*)>/g)) assert.doesNotMatch(tag, /href="(https?:)?\/\//, tag);
  assert.doesNotMatch(site.read("assets/site.css"), /url\("?(https?:)?\/\//);
});

test("every internal link and every font leads to a file that exists", () => {
  const internal = [...attributes("href"), ...attributes("src")].filter((url) => !/^(https?:|mailto:|#)/.test(url));
  assert.ok(internal.length >= 3);
  for (const url of internal) assert.ok(existsSync(join(site.outDir, url)), url);
  for (const [, font] of site.read("assets/site.css").matchAll(/url\("([^"]+)"\)/g)) {
    assert.ok(existsSync(join(site.outDir, "assets", font)), font);
  }
});

test("every anchor leads to an id of the page", () => {
  for (const anchor of attributes("href").filter((url) => url.startsWith("#"))) {
    assert.match(html, new RegExp(`id="${anchor.slice(1)}"`), anchor);
  }
});

test("every illustration is named, every decorative drawing is hidden", () => {
  const figures = [...html.matchAll(/<[^>]+role="img"[^>]*>/g)].map(([tag]) => tag);
  assert.ok(figures.length > 0);
  for (const tag of figures) assert.match(tag, /aria-label="[^"]+"/, tag);
  for (const [svg] of html.matchAll(/<svg [^>]*>/g)) assert.match(svg, /aria-hidden="true"|aria-label="[^"]+"/, svg);
  for (const [img] of html.matchAll(/<img [^>]*>/g)) assert.match(img, /alt="[^"]*"/, img);
});

test("no forbidden word, and no e-mail address but the contact one", () => {
  assert.doesNotMatch(html, FORBIDDEN);
  const emails = html.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? [];
  assert.deepEqual([...new Set(emails)], ["bonjour@cabinet-test.fr"]);
});

test("the name comes from the configuration only", () => {
  assert.match(html, /<title>Atelier Test · /);
  assert.ok(html.split("Atelier Test").length - 1 >= 3, "header, title and footer");
  assert.doesNotMatch(html, /IA formateur/i);
});

test("the contact button leads to the configured contact", () => {
  assert.match(html, /<a class="btn btn-primary" href="mailto:bonjour@cabinet-test\.fr">/);
});

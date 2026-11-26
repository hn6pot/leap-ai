import { test } from "node:test";
import assert from "node:assert/strict";
import { renderTemplate } from "../../scripts/build/render-template.mjs";

test("values are escaped and partials share the context", () => {
  const out = renderTemplate("<h1>{{site.name}}</h1>{{> foot}}", { site: { name: "A & <B>", year: 2026 } }, { foot: "<p>{{site.year}}</p>" });
  assert.equal(out, "<h1>A &amp; &lt;B&gt;</h1><p>2026</p>");
});

test("a missing key or partial is an error", () => {
  assert.throws(() => renderTemplate("{{site.nope}}", { site: {} }, {}), /site\.nope/);
  assert.throws(() => renderTemplate("{{> nope}}", {}, {}), /nope/);
});

test("rendered text is never read again as template syntax", () => {
  assert.equal(renderTemplate("{{a}}", { a: "{{b}}" }, {}), "{{b}}");
});

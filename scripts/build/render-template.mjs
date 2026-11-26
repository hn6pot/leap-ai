// A minimal template language, enough for one page:
//   {{a.b}}    the value, HTML-escaped
//   {{> name}} a partial, rendered with the same context
// Anything missing is an error: a page never ships with a hole in it.

import { escapeHtml } from "./escape-html.mjs";

function lookup(context, path) {
  const value = path.split(".").reduce((node, key) => (node == null ? undefined : node[key]), context);
  if (typeof value === "number") return String(value);
  if (typeof value !== "string") throw new Error(`Template: key "${path}" is missing or not text`);
  return value;
}

/**
 * @param {string} template
 * @param {object} context
 * @param {Record<string, string>} partials
 * @returns {string}
 */
export function renderTemplate(template, context, partials) {
  // One pass, so that rendered text is never read again as template syntax.
  return template.replace(/\{\{>\s*([\w-]+)\s*\}\}|\{\{\s*([\w.-]+)\s*\}\}/g, (_, partial, key) => {
    if (partial) {
      if (!(partial in partials)) throw new Error(`Template: partial "${partial}" is missing`);
      return renderTemplate(partials[partial], context, partials);
    }
    return escapeHtml(lookup(context, key));
  });
}

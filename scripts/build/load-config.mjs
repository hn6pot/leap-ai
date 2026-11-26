import { readFileSync } from "node:fs";

// The contact link: an e-mail address or a Tally form share link.
const CONTACT = /^(mailto:[^\s@]+@[^\s@]+\.[^\s@]+|https:\/\/tally\.so\/r\/[\w-]+)$/;
// The placeholder address the repository ships with, until a real one exists.
const PLACEHOLDER = /example\.(org|com)/;
// Trademarks: they may appear in the copy, never in our own name.
const TRADEMARKS = /claude|anthropic/i;

/**
 * Reads site.config.json and checks it. Throws one Error naming every field at fault.
 * contactUrl may be null (no contact yet); a release build refuses the placeholder one.
 * @param {string} path
 * @param {{ release: boolean }} options
 */
export function loadConfig(path, { release }) {
  const config = JSON.parse(readFileSync(path, "utf8"));
  const problems = [];
  const { siteName, contactUrl } = config;
  if (typeof siteName !== "string" || siteName.trim() === "") {
    problems.push("siteName: a non-empty name is required");
  } else if (TRADEMARKS.test(siteName)) {
    problems.push(`siteName: "${siteName}" must not contain a trademark (Claude, Anthropic)`);
  }
  // null means no contact yet: the button reads "bientôt".
  if (contactUrl !== null && (typeof contactUrl !== "string" || !CONTACT.test(contactUrl))) {
    problems.push(`contactUrl: "${contactUrl}" is not a mailto: address or a https://tally.so/r/… link`);
  } else if (contactUrl !== null && release && PLACEHOLDER.test(contactUrl)) {
    problems.push(`contactUrl: "${contactUrl}" is still the placeholder; put the real contact before release`);
  }
  if (problems.length > 0) {
    throw new Error(`Invalid site configuration (${path}):\n- ${problems.join("\n- ")}`);
  }
  return config;
}

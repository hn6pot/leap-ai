# Consulting site: the rules

Applies to every session that touches this repository. The offer itself (audience, journey, prices) lives outside Git, in the project's `docs/` folder and on the partners' shared Notion page: the site copy follows it, never the other way round.

## What it is

A one-page static site, in French, that presents a small consulting offer: helping small, non-technical French companies and associations adopt Claude (organization setup, connectors, skills, MCP, team workshops, a light legal part).

**Positioning: consulting and change management, never "formation".** The page must not call what we sell a training (`tests/site/copy.test.mjs` checks it; "organismes de formation" as a client type is the only exception).

## Language

- Code, file names, comments, README, this file and commits in English. Commits follow Conventional Commits: `feat(site): …`.
- The site copy is in French (the clients are French) and uses « vous ». It lives in `src/partials/`.

## The name

- The name (Leap AI) lives in **one place**: `siteName` in `site.config.json`. Never hard-code it in `src/`.
- No trademark in our own name: no "Claude", no "Anthropic" (`load-config.mjs` refuses it). Both may appear in the copy, as the product we deploy.

## Public repository rules

- No person's name, no employer name, anywhere on the page (`tests/support/forbidden-words.mjs`, kept encoded).
- No real client, no real data: examples are invented.
- No third-party resource and no script: fonts are self-hosted from `@fontsource`, no analytics, no iframe (`tests/site/built-page.test.mjs`).

## The code

- One file, one responsibility, 300 lines at most (`tests/lint/file-length.test.mjs`).
- All tests live in `tests/`, mirroring the code tree (`tests/lint/tests-location.test.mjs`). `npm test` runs them all.
- Node 24, no build dependency. The only dependencies are the `@fontsource` fonts, copied into `dist/`.
- Colors are tokens in `src/styles/tokens.css`, with a dark-mode set; components never hard-code a color.

## Publishing

- `contactUrl` may be `null` (the button reads « bientôt »); `npm run build -- --release` refuses a placeholder on `example.org`.
- Nothing is pushed, and the GitHub repository is not created, without the owner's written yes.
- Once on GitHub: one PR per change, merged by the owner after review. A merge on `main` publishes to GitHub Pages.

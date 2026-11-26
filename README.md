# Leap AI site

The one-page public site of a small consulting offer: helping small French companies and associations adopt Claude, from the first call to the 30-day review. The copy is in French.

The name (Leap AI) lives in one place: `siteName` in `site.config.json`.

## Build and preview

Node 24 or later.

    npm install
    npm test
    npm run build
    python3 -m http.server 4173 --directory dist

Then open http://localhost:4173/.

## Configuration

`site.config.json`:

| Field | What goes there |
|---|---|
| `siteName` | The brand name, shown in the header, the title and the footer. No "Claude" or "Anthropic" (refused by the build). |
| `contactUrl` | Where "Réserver un premier échange" leads: a `mailto:` address or a Tally share link (`https://tally.so/r/…`). `null` until there is one: the button then reads « bientôt ». A placeholder on `example.org` is refused by `npm run build -- --release`. |

## Publishing

GitHub Actions (`.github/workflows/site.yml`) runs the tests and the `--release` build on every PR; a merge on `main` publishes to GitHub Pages (Settings › Pages › Source: "GitHub Actions").

## The code

`src/page.html` and `src/partials/` the page and its copy · `src/styles/` the CSS · `src/brand/` the favicon · `scripts/build/` the build · `tests/` every test. The rules are in `CLAUDE.md`.

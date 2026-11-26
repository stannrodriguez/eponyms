# Copy Audit: Laws & Adages (eponyms)

## Issues found and changes made

- **Missing meta, Open Graph, and Twitter tags (`build.mjs`)**: Added `<meta name="description">`, `og:*`, and `twitter:*` tags across the collection, entry, and Today pages so search results and link previews describe each page accurately.
- **Vague and em-dash page titles (`build.mjs`, `src/scripts/app.js`)**: Expanded the home title to include the collection size (`Laws & Adages: 20 Eponymous Laws and Adages`), renamed `Today` to `Today's Law`, and replaced em-dash separators with `|` across static and dynamic titles.
- **Card quote button hid the quote from screen readers (`build.mjs`)**: `aria-label="Show name"` overrode the visible quote text for assistive technology; updated to include the quote followed by `Show name.` so users hear the quote without spoiling the law's name.
- **Em dash in card front label (`build.mjs`)**: Replaced the em-dash separator in the card front `aria-label` with a colon (`<name>: show quote`).
- **Identical vague link text across 20 cards (`build.mjs`)**: Added `aria-label="Read <name>"` and capitalized source text (`Read`) while keeping lowercase CSS presentation so screen reader link lists distinguish each entry.
- **Vague toggle group and pagination labels (`build.mjs`, `src/scripts/sheet.js`)**: Changed `Card face` to `Show cards by` and `Other laws` to `Previous and next laws` so controls describe their purpose.
- **Empty no-JS banner and ambiguous "Today" tags (`build.mjs`)**: Changed banner and page tags from `Today` to `Today's law`, and added fallback text (`Law of the day` and `Open today's entry`) inside the banner spans so the link makes sense before or without JavaScript.
- **Internal jargon in Today `<noscript>` fallback (`build.mjs`)**: Replaced `Revisit mode picks the law from the date, which needs JavaScript. Browse the collection instead.` with plain copy (`Today's law is chosen from your local date and requires JavaScript. Browse all laws instead.`).
- **Vague side-sheet link label (`src/scripts/sheet.js`)**: Changed `full page` to `Open full page` with a dynamic `aria-label` (`Open full page for <name>`) and capitalized `Close` in HTML source (rendered lowercase by CSS).
- **Em dashes and minor phrasing issues in `README.md`**: Replaced all six em dashes, removed leftover changelog phrasing (`as before`), matched the close button symbol (`×`), and tightened wording around `localStorage` and frontmatter fields.

## Left alone on purpose

- **All 20 entry files (`content/laws/*.md`)**: Authored definitions, quotes, dates, and four-section essays (`Origin`, `Mechanism`, `Where it breaks`, `Example`). Preserved untouched per audit rules, including quotes and date ranges.
- **Wordmark (`Laws & Adages`), toggle labels (`Names`, `Quotes`), and entry chrome (`All laws`, `Named for ...`, `Previous`, `Next`)**: Clear, concise, and consistent with the site's restrained voice.
- **README `## Voice` section and British spelling (`judgements`)**: Author's own style guide and spelling convention.
- **Source code comments (`build.mjs`, `src/scripts/*.js`, `src/styles/*.css`)**: Internal developer notes, not user-facing copy.

## Not done (next pass)

- **Accessible read-state text**: Read cards currently show only a visual CSS dot (`.is-read`); exposing read status to screen readers (for example, via `aria-description` or visually hidden text) would require JS and DOM changes outside a copy-only pass.

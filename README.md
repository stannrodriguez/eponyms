# Laws & Adages

A static learning micro-app for twenty eponymous laws and adages. No database,
no accounts, no runtime framework — content lives as files in this repo and is
compiled to plain HTML.

## Build

```sh
node build.mjs      # writes dist/
```

No dependencies and no install step — Node 18 or newer is the only requirement.
`dist/` is not committed; pushing to `main` builds and deploys it to GitHub
Pages. The output uses relative URLs throughout, so it also opens directly from
disk: `open dist/index.html`.

## Pages

- `index.html` — the card wall. The Names/Quotes toggle flips every card and
  resets individual flips.
- `laws/<slug>.html` — one entry per law.
- `today/index.html` — revisit mode. The law is `dayOfYear % 20`, computed in
  the browser from the reader's local date rather than baked in at build time,
  which would go stale the day after a deploy.

Which laws have been read is kept in `localStorage` and shown as a single muted
dot on the card. Nothing is sent anywhere, and the site works unchanged when
storage is unavailable.

## Content

One file per law in `content/laws/`. Frontmatter carries the scalars:

```yaml
---
order: 7                # position in the collection; also drives /today
name: Goodhart's Law
slug: goodharts-law     # filename and entry-page URL
quote: When a measure becomes a target, it ceases to be a good measure.
namesake: Charles Goodhart
dates: born 1936
---
```

Prose sections follow as `## Origin`, `## Mechanism`, `## Where it breaks` and
`## Example` headings. Paragraphs are plain text — no markdown syntax beyond
blank-line paragraph breaks.

## Voice

Entry copy is plain, concrete and confident. No metaphor hooks, no first-person
commentary, no value judgements, no hedging. Wit only where the material
supplies it.

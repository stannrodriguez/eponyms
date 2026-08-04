# Laws & Adages

A static learning micro-app for twenty eponymous laws and adages. No database,
no accounts, no runtime framework — content lives as files in this repo and is
compiled to plain HTML.

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

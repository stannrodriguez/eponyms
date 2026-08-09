// Laws & Adages — zero-dependency static site generator.
// Reads content/laws/*.md, writes a self-contained site to dist/ that works
// from file:// or any GitHub Pages subpath (all URLs are relative).

import { readdir, readFile, mkdir, writeFile, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CONTENT = path.join(ROOT, 'content/laws');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- content -----------------------------------------------------------

/** Frontmatter scalars + `## Section` prose blocks. */
function parseLaw(source, file) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source);
  if (!m) throw new Error(`${file}: missing frontmatter`);
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([a-z]+):\s*(.*)$/.exec(line.trim());
    if (kv) data[kv[1]] = kv[2];
  }
  for (const key of ['order', 'name', 'slug', 'quote', 'namesake', 'dates']) {
    if (!data[key]) throw new Error(`${file}: missing "${key}"`);
  }
  data.order = Number(data.order);

  data.sections = {};
  const body = m[2].trim();
  if (body) {
    for (const block of body.split(/^##\s+/m).slice(1)) {
      const nl = block.indexOf('\n');
      const heading = block.slice(0, nl < 0 ? block.length : nl).trim();
      data.sections[heading.toLowerCase()] = {
        heading,
        paragraphs: block.slice(nl + 1).trim().split(/\n{2,}/)
          .map((p) => p.trim().replace(/\s*\n\s*/g, ' ')).filter(Boolean),
      };
    }
  }
  return data;
}

async function loadLaws() {
  const files = (await readdir(CONTENT)).filter((f) => f.endsWith('.md'));
  const laws = await Promise.all(files.map(async (f) =>
    parseLaw(await readFile(path.join(CONTENT, f), 'utf8'), f)));
  laws.sort((a, b) => a.order - b.order);
  laws.forEach((law, i) => {
    law.prev = laws[(i - 1 + laws.length) % laws.length];
    law.next = laws[(i + 1) % laws.length];
  });
  return laws;
}

// --- templates ---------------------------------------------------------

const FONTS = 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital@1'
  + '&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400'
  + '&family=Schibsted+Grotesk:wght@400;700&display=swap';

/** @param {{title:string, base:string, body:string, scripts?:string[], bodyAttrs?:string}} o */
function page({ title, base, body, scripts = [], bodyAttrs = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${base}assets/base.css">
<link rel="stylesheet" href="${base}assets/marks.css">
</head>
<body${bodyAttrs}>
${body}
${scripts.map((s) => `<script src="${base}assets/${s}"></script>`).join('\n')}
</body>
</html>
`;
}

// How many `<i>` primitives each mark is drawn from. See src/styles/marks.css,
// which positions them; anything extra comes from pseudo-elements.
const MARK_PARTS = {
  'murphys-law': 3,             // square, ground line, fallen dot
  'parkinsons-law': 3,          // dial, hour hand, minute hand
  'sturgeons-law': 10,          // ten dots
  'sayres-law': 3,              // two squares, one diamond
  'chestertons-fence': 5,       // five pickets; the rail is ::after
  'hanlons-razor': 2,           // circle, slash
  'goodharts-law': 4,           // three rings, one orbit arm
  'campbells-law': 3,           // three bars
  'hofstadters-law': 3,         // two nested squares, one echo
  'the-lindy-effect': 2,        // dot, line
  'cunninghams-law': 2,         // question bubble, reply bubble
  'brandolinis-law': 10,        // nine squares, one dot
  'the-region-beta-paradox': 2, // short bar, tall bar
  'conways-law': 5,             // root, two edges, two leaves
  'postels-law': 3,             // bracket, slot, travelling dot
  'the-streisand-effect': 7,    // centre plus six
  'the-peter-principle': 3,     // three steps
  'betteridges-law': 2,         // question mark, period
  'occams-razor': 3,            // three dots
  'amaras-law': 2,              // two bars
};

function card(law, base) {
  const parts = '<i></i>'.repeat(MARK_PARTS[law.slug] ?? 3);
  return `<div class="card" data-slug="${esc(law.slug)}">
  <div class="card__inner">
    <button class="card__face card__front" type="button" aria-label="${esc(law.name)} — show quote">
      <span class="card__name">${esc(law.name)}</span>
      <span class="card__rule"></span>
      <span class="mark mark--${esc(law.slug)}" aria-hidden="true">${parts}</span>
    </button>
    <div class="card__face card__back">
      <button class="card__quote-btn" type="button" aria-label="Show name">
        <span class="card__quote">${esc(law.quote)}</span>
      </button>
      <a class="card__read" href="${base}laws/${esc(law.slug)}.html">read <span aria-hidden="true">→</span></a>
    </div>
  </div>
</div>`;
}

function collectionPage(laws) {
  const body = `<header class="topbar">
  <h1 class="wordmark">Laws &amp; Adages</h1>
  <div class="toggle" role="group" aria-label="Card face">
    <button class="toggle__seg is-active" type="button" data-face="names" aria-pressed="true">Names</button>
    <button class="toggle__seg" type="button" data-face="quotes" aria-pressed="false">Quotes</button>
  </div>
</header>
<main>
  <a class="banner" href="today/index.html" data-today-banner>
    <span class="banner__tag">Today</span>
    <span class="banner__name" data-today-name></span>
    <span class="banner__quote" data-today-quote></span>
  </a>
  <div class="grid">
${laws.map((l) => card(l, '')).join('\n')}
  </div>
</main>`;
  return page({ title: 'Laws & Adages', base: '', body, scripts: ['laws-data.js', 'app.js', 'read-state.js', 'sheet.js'] });
}

// Rendered in this order regardless of the order they appear in the file.
const SECTIONS = ['origin', 'mechanism', 'where it breaks', 'example'];

function entryArticle(law) {
  const parts = '<i></i>'.repeat(MARK_PARTS[law.slug] ?? 3);
  const sections = SECTIONS
    .filter((key) => law.sections[key])
    .map((key) => {
      const { heading, paragraphs } = law.sections[key];
      return `<section class="entry__section">
  <h2 class="entry__heading">${esc(heading)}</h2>
  ${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n  ')}
</section>`;
    }).join('\n');

  return `<article class="entry">
  <header class="entry__head">
    <span class="mark mark--${esc(law.slug)} entry__mark" aria-hidden="true">${parts}</span>
    <h1 class="entry__name">${esc(law.name)}</h1>
    <p class="entry__statement">${esc(law.quote)}</p>
    <p class="entry__caption">Named for ${esc(law.namesake)}, ${esc(law.dates)}</p>
  </header>
${sections}
</article>`;
}

function entryPage(law) {
  const body = `<div class="entry__top">
  <a class="backlink" href="../index.html"><span aria-hidden="true">←</span> All laws</a>
</div>
${entryArticle(law)}
<nav class="pager" aria-label="Other laws">
  <a class="pager__link" href="${esc(law.prev.slug)}.html">
    <span class="pager__dir"><span aria-hidden="true">←</span> Previous</span>
    <span class="pager__name">${esc(law.prev.name)}</span>
  </a>
  <a class="pager__link pager__link--next" href="${esc(law.next.slug)}.html">
    <span class="pager__dir">Next <span aria-hidden="true">→</span></span>
    <span class="pager__name">${esc(law.next.name)}</span>
  </a>
</nav>`;
  return page({
    title: `${law.name} — Laws & Adages`,
    base: '../',
    body,
    bodyAttrs: ` data-law="${esc(law.slug)}"`,
    scripts: ['read-state.js'],
  });
}

function todayPage() {
  const body = `<div class="entry__top">
  <a class="backlink" href="../index.html"><span aria-hidden="true">←</span> All laws</a>
</div>
<main class="today" data-today>
  <p class="today__tag">Today</p>
  <div class="today__card" data-today-card></div>
  <div data-today-entry></div>
  <noscript><p class="today__fallback">Revisit mode picks the law from the date, which needs
    JavaScript. <a href="../index.html">Browse the collection instead.</a></p></noscript>
</main>`;
  return page({
    title: 'Today — Laws & Adages',
    base: '../',
    body,
    scripts: ['laws-data.js', 'app.js', 'read-state.js'],
  });
}

// --- build -------------------------------------------------------------

const laws = await loadLaws();
await rm(DIST, { recursive: true, force: true });
await mkdir(path.join(DIST, 'assets'), { recursive: true });

for (const file of await readdir(path.join(SRC, 'styles'))) {
  await cp(path.join(SRC, 'styles', file), path.join(DIST, 'assets', file));
}
for (const file of await readdir(path.join(SRC, 'scripts'))) {
  await cp(path.join(SRC, 'scripts', file), path.join(DIST, 'assets', file));
}

const data = laws.map((law) => ({
  name: law.name,
  slug: law.slug,
  quote: law.quote,
  card: card(law, '../'),
  entry: entryArticle(law),
}));
await writeFile(path.join(DIST, 'assets/laws-data.js'),
  `window.LAWS = ${JSON.stringify(data, null, 1)};\n`);

await writeFile(path.join(DIST, 'index.html'), collectionPage(laws));

await mkdir(path.join(DIST, 'laws'), { recursive: true });
for (const law of laws) {
  await writeFile(path.join(DIST, 'laws', `${law.slug}.html`), entryPage(law));
}

await mkdir(path.join(DIST, 'today'), { recursive: true });
await writeFile(path.join(DIST, 'today/index.html'), todayPage());

console.log(`built ${laws.length} laws -> dist/`);
if (!existsSync(path.join(SRC, 'styles/marks.css'))) console.warn('note: marks.css missing');

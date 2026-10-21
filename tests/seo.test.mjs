import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const title = 'Atmospheric Pressure Calculator by Altitude | Atmospheric Pressure Visualizer';
const description = 'Estimate air pressure at different altitudes with an interactive chart. Compare familiar heights and switch between hPa, inHg, kPa and other pressure units.';
const canonical = 'https://atmosphericpressurevisualizer.com/';
const image = 'https://i.ibb.co/pZgHQGV/Earth-from-space.jpg';
const html = readFileSync(new URL('index.html', root), 'utf8');
const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1] ?? '';

// Scoped to the project's static head; accept reordered attributes and either quote style.
function tags(name) {
  return [...head.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map((match) => {
    const attributes = {};
    for (const attribute of match[1].matchAll(/([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attributes[attribute[1].toLowerCase()] = attribute[2] ?? attribute[3] ?? attribute[4];
    }
    return attributes;
  });
}

function meta(key, value, attribute = 'name') {
  const matches = tags('meta').filter((tag) => tag[attribute]?.toLowerCase() === key);
  assert.equal(matches.length, 1, `Exactly one ${key} meta tag`);
  assert.equal(matches[0].content, value, `${key} content`);
}

function read(name) {
  // Read inside each test so absent crawl files do not prevent other checks running.
  return readFileSync(new URL(name, root), 'utf8');
}

test('homepage has the unique approved document title and description', () => {
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)];
  assert.equal(titles.length, 1);
  assert.equal(titles[0][1], title);
  meta('description', description);
});

test('canonical is unique and points to the HTTPS root', () => {
  const links = tags('link').filter((tag) => tag.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  assert.equal(links.length, 1);
  assert.equal(links[0].href, canonical);
});

test('Open Graph metadata is unique and consistent', () => {
  for (const [key, value] of Object.entries({
    'og:title': title, 'og:description': description, 'og:url': canonical,
    'og:type': 'website', 'og:image': image,
  })) meta(key, value, 'property');
});

test('Twitter metadata is unique and consistent', () => {
  for (const [key, value] of Object.entries({
    'twitter:card': 'summary_large_image', 'twitter:title': title,
    'twitter:description': description, 'twitter:image': image,
  })) meta(key, value);
});

test('homepage remains indexable', () => {
  meta('robots', 'index, follow');
});

test('robots allows crawling and advertises only the canonical sitemap', () => {
  assert.equal(read('robots.txt').replace(/\r\n/g, '\n'),
    `User-agent: *\nAllow: /\n\nSitemap: ${canonical}sitemap.xml\n`);
});

test('sitemap contains only the canonical homepage in the sitemap namespace', () => {
  const xml = read('sitemap.xml');
  // This deliberately validates the complete tiny approved grammar, not arbitrary XML.
  const structure = /^\s*(?:<\?xml\s+version=["']1\.0["']\s+encoding=["']UTF-8["']\s*\?>\s*)?<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']\s*>\s*<url>\s*<loc>([^<]+)<\/loc>\s*<\/url>\s*<\/urlset>\s*$/;
  const match = xml.match(structure);
  assert.ok(match, 'Well-formed single-entry sitemap with the standard root namespace and no extra fields');
  assert.equal(match[1], canonical);
  assert.doesNotMatch(xml, /<lastmod\b|index\.html/i);
  assert.doesNotMatch(match[1], /[?#]/);
  const location = new URL(match[1]);
  assert.equal(location.search, '');
  assert.equal(location.hash, '');
});

test('existing visible heading, controls, and head resources remain available', () => {
  assert.match(html, /<h1>Atmospheric Pressure Visualizer<\/h1>/);
  assert.match(html, /<p>Explore the relationship between altitude and atmospheric pressure<\/p>/);
  for (const id of ['sea-level-pressure-number', 'pressure-unit-select', 'standard-temperature-number', 'altitude-number', 'scaleSwitch', 'pressure-chart']) {
    assert.ok(html.includes(`id="${id}"`), `Preserve ${id}`);
  }
  assert.equal(tags('meta').filter((tag) => tag.charset?.toLowerCase() === 'utf-8').length, 1);
  meta('viewport', 'width=device-width, initial-scale=1.0');
  assert.deepEqual(tags('link').filter((tag) => tag.rel === 'stylesheet').map((tag) => tag.href), [
    'https://cdn.jsdelivr.net/npm/nouislider@14.6.3/distribute/nouislider.min.css', 'styles.css',
  ]);
  assert.deepEqual(tags('script').map((tag) => tag.src), [
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/nouislider@14.6.3/distribute/nouislider.min.js',
  ]);
});

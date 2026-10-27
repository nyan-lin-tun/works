import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}

test('exported routes and assets stay under /works without double-prefixing', () => {
  for (const filename of ['index.html', '404.html']) {
    const html = fs.readFileSync(path.join('out', filename), 'utf8');
    for (const [, reference] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
      assert.ok(reference.startsWith('/works/'), `${filename}: escaped base path: ${reference}`);
      assert.ok(!reference.startsWith('/works/works/'), `${filename}: duplicate base path`);
      let relative = reference.slice('/works/'.length).split('?')[0];
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      assert.ok(
        fs.existsSync(path.join('out', relative)),
        `${filename}: missing asset or page ${reference}`,
      );
    }
  }
  assert.ok(fs.existsSync('out/.nojekyll'));
  assert.ok(!fs.existsSync('out/CNAME'), 'project site must inherit the account domain');
  assert.ok(!fs.existsSync('out/projects'), 'projects belongs to a separate repository');
});

test('Markdown content is pre-rendered into the static pages', () => {
  const works = fs
    .readFileSync('out/index.html', 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const intro = matter(fs.readFileSync('content/README.md', 'utf8')).data;
  assert.ok(works.includes(escapeHtml(intro.headline)), 'introduction must be in the HTML');
  for (const filename of fs.readdirSync('content/works').filter((file) => file.endsWith('.md'))) {
    const { data } = matter(fs.readFileSync(path.join('content/works', filename), 'utf8'));
    assert.ok(works.includes(escapeHtml(data.title)), `${filename}: title must be in the HTML`);
    assert.ok(
      new RegExp(`datetime="${data.start}"`, 'i').test(works),
      `${filename}: start date must be rendered`,
    );
  }
  assert.match(works, /https:\/\/nyanlintun\.me\/works\//);
});

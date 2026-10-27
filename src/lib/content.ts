import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

function readMarkdown(relativePath: string) {
  const file = path.join(contentDirectory, relativePath);
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return { data, body: content.trim(), file: relativePath };
}

function required(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`content/${file}: "${key}" must be non-empty text.`);
  }
  return value;
}

export function getPage(file: string) {
  const { data, body } = readMarkdown(file);
  return {
    title: required(data, 'title', file),
    headline: required(data, 'headline', file),
    description: required(data, 'description', file),
    body,
  };
}

export function getSite() {
  const file = 'README.md';
  const { data } = readMarkdown(file);
  return {
    ...getPage(file),
    name: required(data, 'name', file),
    footer: required(data, 'footer', file),
  };
}

export function getWorks() {
  return fs
    .readdirSync(path.join(contentDirectory, 'works'))
    .filter((file) => file.endsWith('.md'))
    .map((filename) => {
      const { data, body, file } = readMarkdown(`works/${filename}`);
      const start = required(data, 'start', file);
      const end = required(data, 'end', file);
      const datePattern = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!datePattern.test(start) || (end !== 'present' && !datePattern.test(end))) {
        throw new Error(`content/${file}: quote dates as "YYYY-MM", or use end: present.`);
      }
      if (end !== 'present' && end < start) {
        throw new Error(`content/${file}: end cannot be before start.`);
      }
      const url = typeof data.url === 'string' ? data.url : undefined;
      if (url && !/^https?:\/\//.test(url)) {
        throw new Error(`content/${file}: url must start with https:// or http://.`);
      }
      const icon = typeof data.icon === 'string' ? data.icon : undefined;
      if (
        icon &&
        (!/^\/companies\/[a-z0-9-]+\.(ico|svg|png)$/.test(icon) ||
          !fs.existsSync(path.join(process.cwd(), 'public', icon)))
      ) {
        throw new Error(`content/${file}: icon must reference an existing file in /companies/.`);
      }
      return {
        id: filename.replace(/\.md$/, ''),
        title: required(data, 'title', file),
        role: required(data, 'role', file),
        mark: required(data, 'mark', file),
        status: typeof data.status === 'string' ? data.status : undefined,
        draft: data.draft === true,
        start,
        end,
        url,
        icon,
        body,
      };
    })
    .sort((a, b) => b.start.localeCompare(a.start) || a.id.localeCompare(b.id));
}

export function formatDate(value: string) {
  if (value === 'present') return 'Now';
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${value}-01T00:00:00Z`),
  );
}

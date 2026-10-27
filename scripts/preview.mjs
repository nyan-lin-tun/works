import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
const port = Number(process.env.PORT || 4322);
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

async function sendFile(response, file, status = 200) {
  const content = await fs.readFile(file);
  response.writeHead(status, {
    'Content-Type': types[path.extname(file)] || 'application/octet-stream',
  });
  response.end(content);
}

await fs.access(path.join(root, 'index.html'));
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/works') {
        response.writeHead(308, { Location: '/works/' });
        return response.end();
      }
      if (!pathname.startsWith('/works/')) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        return response.end('This preview only serves /works/.');
      }
      const file = path.resolve(root, pathname.slice('/works/'.length) || '.');
      if (file !== root && !file.startsWith(root + path.sep)) {
        response.writeHead(403);
        return response.end();
      }
      const stat = await fs.stat(file);
      await sendFile(response, stat.isDirectory() ? path.join(file, 'index.html') : file);
    } catch {
      await sendFile(response, path.join(root, '404.html'), 404);
    }
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Portfolio preview: http://127.0.0.1:${port}/works/`);
  });

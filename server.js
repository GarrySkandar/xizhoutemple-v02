const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
};

function send(response, status, body, headers = {}) {
  response.writeHead(status, headers);
  response.end(body);
}

function toLocalPath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }

  if (pathname === '/') pathname = '/zh/';
  if (pathname === '/en') pathname = '/en/';
  if (pathname === '/zh') pathname = '/zh/';
  if (pathname.startsWith('/en/')) pathname = `/EN/${pathname.slice(4)}`;

  const normalized = path.normalize(path.join(root, pathname));
  if (!normalized.startsWith(root)) return null;
  return normalized;
}

function serveFile(filePath, response) {
  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      send(response, 404, 'Not found', { 'content-type': 'text/plain; charset=utf-8' });
      return;
    }

    let resolvedPath = filePath;
    if (stats.isDirectory()) {
      resolvedPath = path.join(filePath, 'index.html');
    }

    fs.readFile(resolvedPath, (readError, content) => {
      if (readError) {
        send(response, 404, 'Not found', { 'content-type': 'text/plain; charset=utf-8' });
        return;
      }

      const type = contentTypes[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream';
      send(response, 200, content, { 'content-type': type });
    });
  });
}

const server = http.createServer((request, response) => {
  const localPath = toLocalPath(request.url || '/');
  if (!localPath) {
    send(response, 400, 'Bad request', { 'content-type': 'text/plain; charset=utf-8' });
    return;
  }
  serveFile(localPath, response);
});

server.listen(port, () => {
  console.log(`TempV02 local server running: http://localhost:${port}/zh/`);
  console.log(`English version: http://localhost:${port}/en/`);
});

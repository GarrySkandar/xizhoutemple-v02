const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = __dirname;
const dist = path.join(root, 'dist');
const assets = path.join(dist, 'assets');
const excluded = new Set(['.git', '.openai', 'dist', 'build-sites.js', 'server.js']);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(assets, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  const outputName = entry.name === 'EN' ? 'en' : entry.name;
  fs.cpSync(path.join(root, entry.name), path.join(assets, outputName), { recursive: true });
}

// Locale builds contain identical copies of shared media. Sites serves one shared
// copy and the worker transparently rewrites locale media requests to it.
for (const locale of ['zh', 'en']) {
  for (const shared of ['assets', 'images', 'music']) {
    fs.rmSync(path.join(assets, locale, shared), { recursive: true, force: true });
  }
}

function walk(dir, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    entry.isDirectory() ? walk(fullPath, visit) : visit(fullPath);
  }
}

// Convert large lossless artwork to high-quality WebP for a much smaller upload.
const pngFiles = [];
walk(assets, (file) => {
  if (path.extname(file).toLowerCase() === '.png') pngFiles.push(file);
});
for (const input of pngFiles) {
  const output = input.replace(/\.png$/i, '.webp');
  const result = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-q:v', '80', output]);
  if (result.status !== 0) throw new Error(`Unable to optimize ${input}: ${result.stderr}`);
  fs.rmSync(input);
}

const textExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.txt', '.xml']);
walk(assets, (file) => {
  if (!textExtensions.has(path.extname(file).toLowerCase())) return;
  const source = fs.readFileSync(file, 'utf8');
  const updated = source.replace(/\.png\b/g, '.webp');
  if (updated !== source) fs.writeFileSync(file, updated);
});

fs.mkdirSync(path.join(dist, 'server'), { recursive: true });
fs.writeFileSync(
  path.join(dist, 'server', 'index.js'),
  `export default {\n  async fetch(request, env) {\n    const url = new URL(request.url);\n    url.pathname = url.pathname.replace(/^\\/(?:zh|en)\\/(assets|images|music)\\//, '/$1/');\n    return env.ASSETS.fetch(new Request(url, request));\n  }\n};\n`,
);

console.log('Sites build created in dist/');

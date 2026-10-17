// A dependency-free LOCAL server for the included dist/ build.
// Supports byte ranges so the bundled videos can seek correctly.
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.WESHARE_PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('WESHARE_PORT must be an integer from 1024 to 65535.');
try { statSync(resolve(root, 'index.html')); } catch { console.error('The dist folder is missing. Run npm ci and npm run build first.'); process.exit(1); }
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const target = resolve(root, `.${path === '/' ? '/index.html' : path}`);
    if (target !== root && !target.startsWith(root + sep)) { res.writeHead(403); return res.end('Forbidden'); }
    const stat = statSync(target);
    if (!stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
    const headers = { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
    let start = 0, end = stat.size - 1, status = 200;
    if (req.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!range || (!range[1] && !range[2])) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end(); }
      if (!range[1]) start = Math.max(0, stat.size - Number(range[2]));
      else { start = Number(range[1]); if (range[2]) end = Math.min(Number(range[2]), stat.size - 1); }
      if (start > end || start >= stat.size || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end(); }
      status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length'] = Math.max(0, end - start + 1);
    res.writeHead(status, headers);
    if (req.method === 'HEAD' || stat.size === 0) return res.end();
    const stream = createReadStream(target, { start, end });
    stream.on('error', () => res.destroy()); stream.pipe(res);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', err => { console.error(err.code === 'EADDRINUSE' ? `Port ${port} is busy. Close the other server, or set WESHARE_PORT to another port.` : err.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`\nWeShare is ready: ${url}\nKeep this window open. Press Ctrl+C to stop.\n`);
  if (process.argv.includes('--open')) {
    const command = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
    const child = spawn(command[0], command[1], { detached: true, stdio: 'ignore' }); child.on('error', () => {}); child.unref();
  }
});

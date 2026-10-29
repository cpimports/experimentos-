const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let rawUrl = (req.url || '/').split('?')[0];
  let reqPath;
  try {
    reqPath = decodeURI(rawUrl);
  } catch (e) {
    reqPath = rawUrl;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  // Previne Directory Traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const range = req.headers.range;
    if (range && stats.size > 0) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      const stream = fs.createReadStream(filePath, { start, end });
      stream.on('error', (streamErr) => {
        console.error('Erro de leitura do arquivo (range):', streamErr);
        res.end();
      });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => {
      console.error('Erro de leitura do arquivo:', streamErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      }
      res.end('500 Internal Server Error');
    });
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[AVISO] Porta ${PORT} em uso. Tentando porta ${PORT + 1}...`);
    PORT += 1;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`  Site rodando em: http://localhost:${PORT}/ ou http://127.0.0.1:${PORT}/`);
      console.log(`======================================================\n`);
    });
  } else {
    console.error('Erro no servidor:', err);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  Servidor ativo com sucesso!`);
  console.log(`  Acesse: http://localhost:${PORT}/ ou http://127.0.0.1:${PORT}/`);
  console.log(`======================================================\n`);
});

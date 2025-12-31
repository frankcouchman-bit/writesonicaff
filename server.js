/*
 * A lightweight Node.js HTTP server for serving a static affiliate website.
 *
 * This server uses only the built‑in `http` and `fs` modules to serve files
 * from the repository root (including /images) and top‑level HTML pages. It
 * maps the root URL to `index.html` and will respond with 404 if a file is not
 * found.
 * To run the server locally, execute `node server.js` from the root of
 * the repository.  The server listens on port defined by the `PORT`
 * environment variable or defaults to 3000.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Determine the root directory for pages and assets
const ROOT = __dirname;

// Simple MIME type mapping for common file types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

/**
 * Serves a file over the response stream.  Reads the file from disk
 * asynchronously and writes it to the response with the appropriate
 * content type.  If the file doesn't exist, the function will call
 * `respondNotFound`.
 *
 * @param {http.ServerResponse} res The server response object.
 * @param {string} filePath The absolute path to the requested file.
 */
function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      respondNotFound(res);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

/**
 * Responds with a 404 Not Found status and a simple HTML message.
 *
 * @param {http.ServerResponse} res The server response object.
 */
function respondNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1>');
}

/**
 * Request handler for all incoming HTTP requests.  Determines which file
 * should be served based on the URL path.  Static assets are served from
 * the public directory, articles from the posts directory, and top level
 * pages from the root folder.
 *
 * @param {http.IncomingMessage} req The incoming HTTP request.
 * @param {http.ServerResponse} res The server response object.
 */
function handleRequest(req, res) {
  // Normalize and decode URL to prevent directory traversal attacks
  const urlPath = decodeURI(req.url.split('?')[0]);
  const requestPath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;

  // Serve the root path by defaulting to index.html
  if (urlPath === '/' || urlPath === '') {
    const indexFile = path.join(ROOT, 'index.html');
    serveFile(res, indexFile);
    return;
  }

  // Serve posts from the posts directory. If the requested path already
  // includes an extension, use it as is; otherwise append ".html". This
  // ensures URLs like "/posts/writesonic-vs-jasper" resolve correctly
  // while still allowing explicit ".html" requests.
  if (requestPath.startsWith('posts/')) {
    let filePath = path.join(ROOT, requestPath);
    // Append .html only if no file extension is present
    if (path.extname(filePath) === '') {
      filePath += '.html';
    }
    serveFile(res, filePath);
    return;
  }

  // Serve other HTML pages directly (e.g., /ai-writing-tools.html)
  if (requestPath.endsWith('.html')) {
    const filePath = path.join(ROOT, requestPath);
    serveFile(res, filePath);
    return;
  }

  // Serve static assets from the project root (including /images, CSS, JS)
  const assetPath = path.join(ROOT, requestPath);
  if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
    serveFile(res, assetPath);
    return;
  }

  // If none of the above match, respond with 404
  respondNotFound(res);
}

// Create and start the HTTP server
const port = process.env.PORT || 3000;
const server = http.createServer(handleRequest);
server.listen(port, () => {
  console.log(`Affiliate website server is running on http://localhost:${port}`);
});

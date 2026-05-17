import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf"
};

http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const file = path.join(root, pathname);

  if (!file.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
        response.writeHead(fallbackError ? 404 : 200, { "content-type": "text/html; charset=utf-8" });
        response.end(fallbackError ? "Not found" : fallback);
      });
      return;
    }

    response.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    response.end(data);
  });
}).listen(4173, "127.0.0.1", () => {
  console.log("Apex static server listening on http://127.0.0.1:4173");
});

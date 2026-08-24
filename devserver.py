#!/usr/bin/env python3
"""
Local dev-preview server for /dist.

Plain `python3 -m http.server` sends no Cache-Control header at all, only
Last-Modified — which lets browsers apply heuristic caching and keep serving
a stale copy of site.css/site.js across edits, even on a normal reload. This
wrapper adds Cache-Control: no-store so every request always hits disk.

Local dev tooling only — has no effect on how Netlify serves the real site.
"""
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5181
    directory = sys.argv[2] if len(sys.argv) > 2 else "dist"
    handler = lambda *args, **kwargs: NoCacheHandler(*args, directory=directory, **kwargs)
    http.server.ThreadingHTTPServer(("", port), handler).serve_forever()

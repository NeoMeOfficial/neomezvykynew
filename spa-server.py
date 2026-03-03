#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class SPAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        requested_path = parsed_path.path
        
        # Remove leading slash for file system
        if requested_path.startswith('/'):
            requested_path = requested_path[1:]
        
        # If no path specified, serve index.html
        if not requested_path:
            requested_path = 'index.html'
        
        # Full file system path
        full_path = os.path.join(self.directory, requested_path)
        
        # If it's a file that exists, serve it normally
        if os.path.isfile(full_path):
            return super().do_GET()
        
        # If it's not a file, serve index.html (SPA routing)
        self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = 9000
    
    # Change to dist directory
    os.chdir('dist')
    
    with socketserver.TCPServer(("", PORT), SPAHTTPRequestHandler) as httpd:
        print(f"🚀 NeoMe SPA Server running at:")
        print(f"   http://localhost:{PORT}/")
        print(f"   http://192.168.1.183:{PORT}/")
        print(f"\n✅ SPA routing enabled - all routes will work!")
        print("Press Ctrl+C to stop...")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            httpd.shutdown()
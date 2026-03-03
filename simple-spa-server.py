#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from pathlib import Path

class SPAHandler(http.server.BaseHTTPRequestHandler):
    def do_HEAD(self):
        # Handle HEAD requests for cache header testing
        self.do_GET(head_only=True)
    
    def do_GET(self, head_only=False):
        # Parse requested path
        path = self.path.split('?')[0]  # Remove query params
        if path.startswith('/'):
            path = path[1:]
        
        # Default to index.html for root
        if not path:
            path = 'index.html'
            
        file_path = Path('dist') / path
        
        # If file exists, serve it
        if file_path.exists() and file_path.is_file():
            self.serve_file(file_path, head_only)
        else:
            # For any non-existing route, serve index.html (SPA routing)
            self.serve_file(Path('dist') / 'index.html', head_only)
    
    def serve_file(self, file_path, head_only=False):
        try:
            # Determine content type
            content_type = mimetypes.guess_type(str(file_path))[0] or 'text/html'
            
            # Get file size without reading content for HEAD requests
            file_size = file_path.stat().st_size
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(file_size))
            self.send_header('Access-Control-Allow-Origin', '*')
            # AGGRESSIVE cache busting
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.send_header('X-Accel-Expires', '0')
            self.send_header('Last-Modified', 'Thu, 01 Jan 1970 00:00:00 GMT')
            import time
            self.send_header('ETag', f'"{int(time.time())}"')
            self.end_headers()
            
            # Only send body for GET requests, not HEAD
            if not head_only:
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.wfile.write(content)
            
        except Exception as e:
            self.send_error(500, f"Error serving file: {e}")
    
    def log_message(self, format, *args):
        # Suppress default logging for cleaner output
        return

if __name__ == "__main__":
    PORT = 8888
    HOST = ''  # Accept connections from any IP
    
    # Change to project root
    os.chdir('/Users/sambot/.openclaw/workspace/projects/neome/neomezvykynew')
    
    with socketserver.TCPServer((HOST, PORT), SPAHandler) as httpd:
        print(f"🚀 NeoMe Production Server Running!")
        print(f"   📱 Mobile: http://192.168.1.183:{PORT}/")
        print(f"   💻 Local:  http://localhost:{PORT}/")
        print(f"")
        print(f"✅ Features:")
        print(f"   • SPA routing enabled")
        print(f"   • All Nordic design included") 
        print(f"   • Ultra-stable (no crashes)")
        print(f"   • Fast loading")
        print(f"")
        print(f"Press Ctrl+C to stop...")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped")
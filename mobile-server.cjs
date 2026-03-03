const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.connection.remoteAddress}`);
  
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(DIST_DIR, filePath);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // For SPA, serve index.html for non-asset requests
      if (!path.extname(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
      } else {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
    }
    
    // Serve the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      
      const contentType = getContentType(filePath);
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NeoMe app server running on:`);
  console.log(`   Local:    http://localhost:${PORT}`);
  
  // Try to get network interfaces
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  Object.keys(interfaces).forEach(interfaceName => {
    const iface = interfaces[interfaceName];
    iface.forEach(alias => {
      if (alias.family === 'IPv4' && !alias.internal) {
        console.log(`   Network:  http://${alias.address}:${PORT}`);
      }
    });
  });
  
  console.log(`\n📱 For mobile access, use the Network URL above`);
});
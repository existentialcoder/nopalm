import http from 'http';

const server = http.createServer((req, res) => {
    if (req.url === '/ping' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World!');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(4000, () => {
    console.log('Server running at http://localhost:4000');
});

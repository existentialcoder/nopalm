const derby = require('derby');
const app = derby.createApp();

app.get('/ping', (req, res) => {
    res.send('Hello World!');
});

const server = require('http').createServer((req, res) => {
    app(req, res);
});

server.listen(4000, () => {
    console.log('Derby running at http://localhost:4000');
});

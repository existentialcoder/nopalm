import derby from 'derby';
import { createServer } from 'http';

const app = derby.createApp();

app.get('/ping', (req, res) => {
    res.send('Hello World!');
});

const server = createServer((req, res) => {
    app(req, res);
});

server.listen(4000, () => {
    console.log('Derby running on http://localhost:4000');
});

const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
    res.send('Hello World!');
});

app.listen(4000, () => {
    console.log('Express running on http://localhost:4000');
});

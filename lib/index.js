const express = require('express');
var cors = require('cors');

const routes = require('./routes');

const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

// Home page route
if (process.env.NODE_ENV === 'development') {
  app.get('/', (req, res) => res.send('Use /api for apis'))
}
else {
  app.use('/', express.static('public'));
}

// Other routes
app.use(routes);

app.listen(port, () => {
  console.log(`Visit http://localhost:${port} to manage your node project`)
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Table = require('./server/controllers/Table');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/table', function (req, res) {
    Table.get({ route: req.query.route, stop: req.query.stop }).then(result => res.json(result));
});

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});

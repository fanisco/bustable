const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Table = require('./server/controllers/Table');
require('dotenv').config();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/table', function (req, res) {
    Table.get({ stopName: req.query.stop }).then(result => res.json(result));
});

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${process.env.PORT}!`);
});

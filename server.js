const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Table = require('./server/controllers/Table');
const Stop = require('./server/models/Stop');
require('dotenv').config();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/api/stop/:id', function (req, res) {
    Stop.where({ id: req.params.id }).then(result => res.json(result[0]));
});

app.get('/api/table', function (req, res) {
    console.log(req.query);
    Table.get({ stopId: req.query.stopId }).then(result => res.json(result));
});

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${process.env.PORT}!`);
});

import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import Stop from './server/models/Stop';
import Route from './server/models/Route';
import Table from './server/controllers/Table';

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/route/:id', function (req, res) {
    Route.where({ id: req.params.id }).then(result => res.json(result[0]));
});

app.get('/api/stop/:id', function (req, res) {
    Stop.where({ id: req.params.id }).then(result => res.json(result[0]));
});

app.get('/api/table', function (req, res) {
    Table.get({ stopId: req.query.stopId }).then(result => res.json(result));
});

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${process.env.PORT}!`);
});

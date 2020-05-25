import 'dotenv/config';
import express from 'express';
import path from 'path';
import Stop from './server/models/Stop';
import Route from './server/models/Route';
import Table from './server/controllers/Table';
import thirdparty from './server/adapters/thirdparty';

const app = express();
const middle = (fn, req, res) => {
    try {
        fn();
    } catch(e) {
        res.json({error: e.message});
    }
};

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

app.get('/api/gpstable', function (req, res) {
    thirdparty.get({ stopId: req.query.stopId }).then(result => res.json(result));
});

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${process.env.PORT}!`);
});

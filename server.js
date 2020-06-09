import 'dotenv/config';
import express from 'express';
import path from 'path';
import Stop from './server/models/Stop';
import Route from './server/models/Route';
import Table from './server/controllers/Table';
import thirdparty from './server/adapters/thirdparty';
import wrap from './server/core/wrap';

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/route/:id', wrap(async(req) => {
    return Route.getById({id: req.params.id});
}));

app.get('/api/stop/:id', wrap(async(req) => {
    return Stop.getById({id: req.params.id});
}));

app.get('/api/table', wrap(async(req) => {
    return Table.get({stopId: req.query.stopId});
}));

app.get('/api/gpstable/:id', wrap(async(req) => {
    return thirdparty.get({stopId: req.params.id});
}));

app.get('/api/checkway', wrap(async(req) => {
    return thirdparty.isStopOnTheWay({
        stopId: req.query.stopId,
        objectId: req.query.objectId
    });
}));

app.listen(process.env.SERVER_PORT, function() {
    console.log(`App listening on port ${process.env.SERVER_PORT}!`);
});

import Stop from '../models/Stop';
import Route from '../models/Route';
import Table from '../controllers/Table';
import thirdparty from '../adapters/thirdparty';
const routes = [
    // ['/api/route/:id', async(req) => Route.getById({id: req.params.id})],
    ['/api/stop/:id', async(req) => Stop.getById({id: req.params.id})],
    // ['/api/table', async(req) => Table.get({stopId: req.query.stopId})],
    ['/api/gpstable/:id', async(req) => thirdparty.get({stopId: req.params.id})],
    ['/api/checkway', async(req) => thirdparty.isStopOnTheWay({
        stopId: req.query.stopId,
        objectId: req.query.objectId
    })]
];
export default routes;

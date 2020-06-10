import Connection from '../db/connection';
import Model from './Model';

export default class Stop extends Model {
    static _table = 'logistics.stops';
    static _fields = ['id', 'name', 'zoneId'];

    constructor({ id, name, zoneId }) {
        super();
        this.id = id;
        this.name = name;
        this.zoneId = zoneId;
    }

    /**
     * @param {Object} params
     * @return {Route[]}
     */
    static async where(params) {
        return Model._where(params, Stop);
    }
    static async getById(id) {
        return Model._getById(id, Stop);
    }
    static async getByName(name) {
        return Stop.where({ name });
    }
    async getRoutes() {
        const query = `SELECT route_id AS routeId FROM logistics.routes_stops WHERE stop_id = '${this.id}'`;
        const result = await Connection.query(query);
        return result.map(row => row.routeId);
    }
}

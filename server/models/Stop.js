const connection = require('../db/connection').getInstance();

class Stop {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
    async getRoutes() {
        const query = `SELECT route_id AS routeId FROM logistics.routes_stops WHERE stop_id = '${this.id}'`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                resolve(Array.from(rows).map(row => row.routeId));
            });
        });
    }
    static async where(params) {
        const query = `SELECT id, name FROM logistics.stops ${Stop.analyzeWhere(params)}`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                resolve(Array.from(rows).map(row => new Stop(row)));
            });
        });
    }
    static async getByName(name) {
        return Stop.where({ name });
    }
    static analyzeWhere(params) {
        const answer = Object.keys(params).map(param => {
            return `${param} = '${params[param]}'`;
        });
        return answer.length ? `WHERE ${answer.join(' AND ')}` : '';
    }
}

module.exports = Stop;

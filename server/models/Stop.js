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
    static async getByName(name) {
        const query = `SELECT id, name FROM logistics.stops WHERE name = '${name}'`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                resolve(Array.from(rows).map(row => new Stop(row)));
            });
        });
    }
}

module.exports = Stop;

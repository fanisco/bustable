const connection = require('../db/connection').getInstance();
const Statistic = require('./Statistic');
const Stop = require('../models/Stop');
const { timeSub, timeFormat } = require('../../src/helpers/Time');

const Table = {
    query: ({ routeId, time, timeLimit, delay } = {}) => `
SELECT
    r.number AS route, s1.name AS destination, date_add(t.time, INTERVAL ${delay} MINUTE) AS arrival
FROM
    logistics.timetable AS t
    LEFT JOIN logistics.routes AS r
        ON t.route_id = r.id
    LEFT JOIN logistics.stops AS s1
        ON t.dest_id = s1.id
WHERE 1
    AND r.id = '${routeId}'
    AND date_add(t.time, INTERVAL ${delay} MINUTE) >= '${time}'
    AND date_add(t.time, INTERVAL ${delay} MINUTE) <= '${timeLimit}'
ORDER BY t.time ASC
`,

    /**
     * Get rows from database with given params.
     */
    async get({ stopId }) {
        return new Promise(async (resolve, reject) => {

            // Current time
            const now = new Date();
            const time = timeFormat(now);
            const timeLimit = timeFormat(new Date(now.getTime() + 3 * 60 * 60 * 1000));

            // Get busstop and its routes
            const [stop] = await Stop.where({ id: stopId });
            const routes = await stop.getRoutes();

            // Get stats by routes of stop and calculate delays
            const stats = await this.getStatistics(stop.id, routes);
            const delayedRoutes = this.mergeDelays(routes, stats);

            // With resulted data get rows
            const tables = await this.getTableRoutes(delayedRoutes, time, timeLimit);

            resolve(this.mergeTables(tables));
        });
    },

    /**
     *
     */
    async getStatistics(stopId, routes) {
        return Promise.all(routes.map(routeId => Statistic.get({ stopId, routeId })));
    },

    /**
     *
     */
    mergeDelays(routes, stats) {
        return routes.map((routeId, i) => {
            return {
                routeId,
                delay: stats[i].map(item => item.mx).reduce((sum, i) => sum + i, 0)
            }
        });
    },

    /**
     *
     */
    mergeTables(tables) {
        const sort = [];
        for (const table of tables) {
            for (const row of table) {
                sort.push(row);
            }
        }
        sort.sort((a, b) => a.route - b.route);
        sort.sort((a, b) => a.timestamp - b.timestamp);
        return sort;
    },

    /**
     *
     */
    async getTableRoutes(routes, time, timeLimit) {
        return Promise.all(routes.map(({ routeId, delay }) => this.getTableRoute(routeId, time, timeLimit, delay)));
    },

    /**
     *
     */
    async getTableRoute(routeId, time, timeLimit, delay) {
        return new Promise((resolve, reject) => {
            connection.query(this.query({ routeId, time, timeLimit, delay }), (err, rows) => {

                // Calculate estimate time for each row
                resolve(rows.map(row => {
                    const arrivalTime = timeSub(row.arrival, time);
                    return {
                        ...row,
                        timestamp: arrivalTime
                    };
                }));
            });
        });
    }
};

module.exports = Table;

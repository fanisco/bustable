import Connection from '../db/connection';
import Statistic from './Statistic';
import Stop from '../models/Stop';
import precise from './precise';

const { timeSub, timeFormat } = require('../../src/helpers/Time');

const Table = {
    query: ({ routeId, time, timeLimit, delay } = {}) => `
SELECT
    r.number AS route, s1.name AS destination, date_add(t.time, INTERVAL ${delay} MINUTE_SECOND) AS arrival
FROM
    logistics.timetable AS t
    LEFT JOIN logistics.routes AS r
        ON t.route_id = r.id
    LEFT JOIN logistics.stops AS s1
        ON t.dest_id = s1.id
WHERE 1
    AND r.id = '${routeId}'
    AND date_add(t.time, INTERVAL ${delay} MINUTE_SECOND) >= '${time}'
    AND date_add(t.time, INTERVAL ${delay} MINUTE_SECOND) <= '${timeLimit}'
ORDER BY t.time ASC
`,

    /**
     * Get rows from database with given params.
     */
    async get({ stopId }) {

        // Current time
        const now = new Date();
        const time = timeFormat(now);

        // Get busstop and its routes
        const [stop] = await Stop.where({ id: stopId });
        const routes = await stop.getRoutes();

        // Get stats by routes of stop and calculate delays
        const stats = await this.getStatistics(stop.id, routes);
        const delayedRoutes = this.mergeData(routes, stats);

        // With resulted data get rows
        const busesByRoutes = await this.getTableRoutes(delayedRoutes, time);
        const buses = this.mergeTables(busesByRoutes);
        await this.addCurrentStops(buses, Statistic.getRouteMapped(stats));
        return buses;
    },

    /**
     *
     */
    async addCurrentStops(buses, allStats) {
        for (const bus of buses) {
            const routeId = bus.routeId;
            const stats = allStats[routeId];

            if (!stats || !stats.length) {
                return;
            }

            // Time left
            let delta = bus.delta / 60 / 1000;

            // Iterating from the end, until delta is over - so we find current bus's stop from our position
            for (const stat of [...stats].reverse()) {
                if (delta >= stat.mx) {
                    delta -= stat.mx;
                } else {
                    const [stop] = await Stop.where({ id: stat.stopId });
                    bus.currentStop = stop;
                    break;
                }
            }
        }
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
    mergeData(routes, stats) {
        return routes.map((routeId, i) => {
            const duration = stats[i].map(item => item.mx).reduce((sum, i) => sum + i, 0);
            return {
                routeId,
                delay: precise(duration, 60 * 1000)
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
        sort.sort((a, b) => a.delta - b.delta);
        return sort;
    },

    /**
     *
     */
    async getTableRoutes(routes, time) {
        return Promise.all(routes.map(({ routeId, delay }) => this.getTableRoute(routeId, time, delay)));
    },

    /**
     * @param {Number} routeId
     * @param {String} time
     * @param {Number} duration Average route duration from A to our position.
     */
    async getTableRoute(routeId, time, duration) {
        const maxLimit = 3;
        const minInMils = 60 * 1000;
        const hrsInMils = 60 * minInMils;

        // Max limit is 3 hours, compare it with duration
        const limit = Math.min(Math.ceil(duration * minInMils), maxLimit * hrsInMils);
        const timeLimit = timeFormat(new Date((new Date()).getTime() + limit));

        // Query with limit by time
        const result = await Connection.query(this.query({ routeId, time, timeLimit, delay: duration }));
        return result.map(row => {
            return { ...row, routeId, duration, delta: timeSub(row.arrival, time) };
        });
    }
};

export default Table;

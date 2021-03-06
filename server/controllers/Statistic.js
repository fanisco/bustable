import Connection from '../db/connection';
import { expected, variance, standard } from '../math/RandomVariable';
import precise from './precise';

const Statistic = {
    query: ({ stopId, routeId }) => `
SELECT
    rs.route_id AS routeId, rs.dest_id AS destId, rs.stop_id AS stopId, rs.number, ms.values
FROM
    logistics.movement_statistic ms,
    logistics.routes_stops rs
WHERE 1
    AND rs.number < (
        SELECT
            number
        FROM
            logistics.routes_stops
        WHERE 1
            AND stop_id = '${stopId}'
            AND route_id = '${routeId}'
    )
    AND ms.route_id = '${routeId}'
    AND ms.route_id = rs.route_id
    AND ms.stop_id = rs.stop_id
ORDER BY rs.number ASC
`,

    /**
     * Get rows from database with given params.
     */
    async get({ stopId, routeId }) {
        const minInMils = 60 * 1000;
        const result = await Connection.query(this.query({ stopId, routeId }));
        return result.map(row => {
            const values = row.values.split(',').map(value => parseFloat(value));
            return {
                ...row,
                values,
                mx: precise(expected(values), minInMils),
                dx: precise(variance(values), minInMils),
                sd: precise(standard(values), minInMils)
            };
        });
    },
    getRouteMapped(stats) {
        const result = {};
        for (const routeStats of stats) {
            result[routeStats[0].routeId] = routeStats;
        }
        return result;
    }
};

export default Statistic;

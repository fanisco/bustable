const connection = require('../db/connection');
const rv = require('../math/RandomVariable');

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
        return new Promise((resolve, reject) => {
            connection.query(this.query({ stopId, routeId }), (err, rows) => {
                const result = [];
                for (const row of rows) {
                    const values = row.values.split(',').map(value => parseFloat(value));
                    result.push({
                        ...row,
                        values,
                        mx: rv.mx(values),
                        dx: rv.dx(values),
                        sd: rv.standard(values)
                    });
                }
                resolve(result);
            });
        });
    }
};

module.exports = Statistic;

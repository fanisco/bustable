const connection = require('../db/connection');
const rv = require('../math/RandomVariable');

const Statistic = {
    query: ({ route, stop }) => `
SELECT
    rs.route_id AS routeId, rs.dest_id AS destId, rs.stop_id AS stopId, rs.number, ms.values
FROM
    logistics.movement_statistic ms,
    logistics.routes_stops rs,
    logistics.routes r
WHERE 1
    AND rs.number < (
        SELECT
            rs.number
        FROM
            logistics.stops s,
            logistics.routes r,
            logistics.routes_stops rs
        WHERE 1
            AND s.name = '${stop}'
            AND r.number = '${route}'
            AND s.id = rs.stop_id
            AND r.id = rs.route_id
    )
    AND r.number = '${route}'
    AND ms.route_id = rs.route_id
    AND ms.stop_id = rs.stop_id
    AND r.id = rs.route_id
ORDER BY rs.number ASC
`,

    /**
     * Get rows from database with given params.
     */
    async get(params) {
        return new Promise((resolve, reject) => {
            connection.query(this.query(params), (err, rows) => {
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

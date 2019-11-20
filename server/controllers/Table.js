const connection = require('../db/connection');
const Statistic = require('./Statistic');
const { timeSub, timeFormat } = require('../../src/helpers/Time');

const Table = {
    query: ({ route, time, delay } = {}) => `
SELECT
    r.number AS route, s1.name AS destination, date_add(t.time, INTERVAL ${delay} MINUTE) AS arrival
FROM
    logistics.timetable AS t
    LEFT JOIN logistics.routes AS r
        ON t.route_id = r.id
    LEFT JOIN logistics.stops AS s1
        ON t.dest_id = s1.id
WHERE 1
    AND r.number = '${route}'
    AND date_add(t.time, INTERVAL ${delay} MINUTE) >= '${time}'
ORDER BY t.time ASC
`,

    /**
     * Get rows from database with given params.
     */
    async get({ route, stop }) {
        return new Promise((resolve, reject) => {

            // First get statistic avg travel time
            Statistic.get({ route, stop }).then(stats => {

                // Calculate delay and current time
                const delay = stats.map(item => item.mx).reduce((sum, i) => sum + i, 0);
                const time = timeFormat(new Date());

                // With resulted data get rows
                connection.query(this.query({ route, delay, time }), (err, rows) => {

                    // Calculate estimate time for each row
                    resolve(rows.map(row => {
                        return { ...row, time: timeFormat(timeSub(row.arrival, time)) };
                    }));
                });
            });
        });
    },
};

module.exports = Table;

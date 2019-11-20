const connection = require('../db/connection');
const Statistic = require('./Statistic');

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
                const time = this.timeFormat(new Date());

                // With resulted data get rows
                connection.query(this.query({ route, delay, time }), (err, rows) => {

                    // Calculate estimate time for each row
                    resolve(rows.map(row => {
                        return { ...row, time: this.timeFormat(this.timeSub(row.arrival, time)) };
                    }));
                });
            });
        });
    },

    /**
     * Substract one time from another.
     */
    timeSub(time1, time2) {
        return new Date('1970-01-01T' + time1 + 'Z') - new Date('1970-01-01T' + time2 + 'Z');
    },

    /**
     * Format date object or timestamp.
     */
    timeFormat(dateTime) {
        let h, m, s;
        if (dateTime instanceof Date) {
            h = dateTime.getHours();
            m = dateTime.getMinutes();
            s = dateTime.getSeconds();
        } else {
            const time = dateTime / 1000;
            h = Math.floor(time / 3600);
            m = Math.floor((time - h * 3600) / 60);
            s = Math.floor(time - (h * 3600) - (m * 60));
        }
        h = (h < 10 ? '0' : '') + h;
        m = (m < 10 ? '0' : '') + m;
        s = (s < 10 ? '0' : '') + s;
        return `${h}:${m}:${s}`;
    }
};

module.exports = Table;

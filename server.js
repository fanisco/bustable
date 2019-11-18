const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./server/db/connection');

const app = express();
const query = `SELECT
    r.number AS route,
    s1.name AS destination,
    t.time AS arrival
FROM logistics.timetable AS t
    LEFT JOIN logistics.routes AS r 
        ON t.route_id = r.id
    LEFT JOIN logistics.stops AS s1
        ON t.dest_id = s1.id
WHERE t.route_id = 4`;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/table', function (req, res) {
    return connection.query(query, (err, rows, fields) => {
        res.json(rows);
    });
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});

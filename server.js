const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('./server/db/connection');
const Route = require('./server/db/models/Route');

// Route.find({ type: 'bus' }, (err, rows) => {
//     console.log(rows);
// });

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    return res.send('serve');
    // res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/table', function (req, res) {
    return res.json([
        { route: '1',  destination: 'Destination test bust stop 1', arrival: '0:35' },
        { route: '7',  destination: 'Destination test bust stop 2', arrival: '2:10' },
        { route: '27', destination: 'Destination test bust stop 3', arrival: '5:30' },
        { route: '32', destination: 'Destination test bust stop 4', arrival: '10:10' },
        { route: '37', destination: 'Destination test bust stop 5', arrival: '14:00' },
    ]);
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});

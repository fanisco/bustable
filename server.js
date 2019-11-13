const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    return res.send('serve');
    // res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/table', function (req, res) {
    return res.json([
        { route: '1',  stop: 'Test bus stop', destination: 'Destination test bust stop 1' },
        { route: '7',  stop: 'Test bus stop', destination: 'Destination test bust stop 2' },
        { route: '27', stop: 'Test bus stop', destination: 'Destination test bust stop 3' },
        { route: '32', stop: 'Test bus stop', destination: 'Destination test bust stop 4' },
        { route: '37', stop: 'Test bus stop', destination: 'Destination test bust stop 5' },
    ]);
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});

import 'dotenv/config';
import express from 'express';
import path from 'path';
import wrap from './server/core/wrap';
import routes from './server/core/routes';

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

for (const [url, handler] of routes)
    app.get(url, wrap(handler));

app.listen(process.env.SERVER_PORT, function() {
    console.log(`App listening on port ${process.env.SERVER_PORT}!`);
});

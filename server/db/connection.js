const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'usr_dev',
    password: 'RKqG^YzA#wzB9d^R'
});

connection.connect();

module.exports = connection;

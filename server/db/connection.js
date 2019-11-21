const mysql = require('mysql');
require('dotenv').config();

/**
 * Mysql connection.
 */
const Connection = {
    instance: null,
    getInstance() {
        if (!this.instance) {
            this.instance = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS
            });
            this.instance.connect();
        }
        return this.instance;
    }
};

module.exports = Connection;

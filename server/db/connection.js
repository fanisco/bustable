import mysql from 'mysql';
import 'dotenv/config';

const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
connection.connect();

/**
 * Mysql connection.
 */
const Connection = {
    async query(query) {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                resolve(Array.from(rows));
            });
        });
    }
};

export default Connection;

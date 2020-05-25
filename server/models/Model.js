import Connection from '../db/connection';
import {type} from "mathjs";

export default class Model {

    /**
     * @param {Object} params
     * @param {Function} constructor
     * @return {Promise}
     */
    static async _where(params, constructor) {
        const { _table, _fields } = constructor;
        if (!_table) {
            throw Error('Table is not specified.');
        }
        if (!_fields || !_fields.length) {
            throw Error('Fields are not specified.');
        }
        const query = `SELECT ${_fields.join(', ')} FROM ${_table} ${Model.analyzeWhere(params)}`;
        const result = await Connection.query(query);
        return result.map(row => new constructor(row));
    }

    /**
     * @param {Object} params
     * @return {String}
     */
    static analyzeWhere(params) {
        const statement = Object.keys(params).map(param => {
            switch (true) {
                case Array.isArray(params[param]) && params[param].length > 0:
                    return `${param} IN ('${params[param].join('\',\'')}')`;
                case typeof params[param] === 'string':
                case typeof params[param] === 'number':
                    return `${param} = '${params[param]}'`;
                default:
                    return '1=1';
            }
        });
        return statement.length ? `WHERE ${statement.join(' AND ')}` : '';
    }
}

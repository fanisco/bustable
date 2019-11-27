import Connection from '../db/connection';

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
        const answer = Object.keys(params).map(param => {
            return `${param} = '${params[param]}'`;
        });
        return answer.length ? `WHERE ${answer.join(' AND ')}` : '';
    }
}

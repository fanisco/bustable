import Model from './Model';

export default class Route extends Model {
    static _table = 'logistics.routes';
    static _fields = ['id', 'number'];

    constructor({ id, number }) {
        super();
        this.id = id;
        this.number = number;
    }

    /**
     * @param {Object} params
     * @return {Route[]}
     */
    static async where(params) {
        return Model._where(params, Route);
    }
}

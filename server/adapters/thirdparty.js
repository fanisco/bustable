import Stop from '../models/Stop';
const fetch = require('node-fetch');
const base = ['https://', 'go', '2', 'bus', '.ru'];

/**
 * Получаем геопозиции автобусов из стороннего источника.
 */
const thirdparty = {
    _types: {
        bus: 'b',
        routeTaxi: 'rt',
        trolleyBus: 'tb',
        tram: 'tr',
    },
    _typesRus: {
        b: 'автобус',
        rt: 'маршрутное такси',
        tb: 'троллейбус',
        tr: 'трамвай',
    },
    async api(action, ...args) {
        let url;
        switch (action) {
            case 'comings':
                url = this._getNextComingsUrl(...args);
                break;
            case 'stops':
                url = this._getNextStopsUrl(...args);
                break;
        }
        const req = await fetch(url);
        return req.json();
    },
    async get({stopId, types}) {
        if (!types) {
            types = [
                this._types.bus,
                this._types.routeTaxi,
                this._types.trolleyBus,
                this._types.tram
            ];
        }
        const stop = await Stop.getById(stopId);
        const comings = await this.api('comings', stop.zoneId);
        return Promise.all(comings.map(coming => this._getMoreInfoForComming(coming)));
    },
    async _getMoreInfoForComming(coming) {
        const stops = await this.api('stops', coming.object.id);
        return {
            route: {
                name: coming.route.name.replace(/\d\./g, ''),
                type: this._typesRus[coming.route.vt],
            },
            destination: {
                name: coming.direction.endName
            },
            stop: {
                name: stops.priorStop && stops.priorStop.zones[0].name
            },
            arrival: {
                time: coming.time,
                wait: coming.wait,
            }
        };
    },
// Response example:
// [{
//     "time":"2020-05-25T20:53:13",
//     "wait":"00:00:28.8590000",
//     "route":{
//         "name":"7",
//         "vt":"b"
//     },
//     "object":{
//         "id":"7831d9da-e2a7-4b41-a11e-8f64ba968dda",
//         "model":"Автобус",
//         "stateNum":"Р270УК39",
//         "garageNum":"63050"
//     },
//     "direction":{
//         "letter":"M",
//         "endName":"СНТ "Победа" (конечная)"
//     }
// }]
    _getNextComingsUrl: (zoneId, city = 'kal') => `${base.join('')}/infonextcomings?zoneId=${zoneId}&srv=${city}`,
    _getNextStopsUrl: (objectId, city = 'kal') => `${base.join('')}/infonextstops?objectId=${objectId}&srv=${city}`,
    _getStatesUrl: (routes, types, city = 'kal') => `${base.join('')}/inforoutestates?vt=${types.join(';')}&srv=${city}&route=${routes.join(';')}`
};

export default thirdparty;

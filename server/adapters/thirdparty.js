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
        // return [{"route":{"name":"87","type":"маршрутное такси"},"destination":{"name":"Ул. Крымская"},"stop":{"name":"Музей изобразительных искусств (в центр)"},"arrival":{"time":"2020-05-26T12:22:23","wait":"00:00:34.4070000"}}];
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
        return Promise.all(comings.map((coming, i) => this._getMoreInfoForComming(coming, i + 1)));
    },
    async isStopOnTheWay({stopId, objectId}) {
        const stop = await Stop.getById(stopId);
        const objInfo = await this.api('stops', objectId);
        if (objInfo.nextStops) {
            for (const nextStop of objInfo.nextStops) {
                if (nextStop.zones) {
                    for (const zone of nextStop.zones) {
                        if (zone.id === stop.zoneId) {
                            return {objectId, stopId, is: true};
                        }
                    }
                }
            }
        }
        return {objectId, stopId, is: false};
    },
    async _getMoreInfoForComming(comming, n) {
        let stops;
        if (n <= 10) {
            stops = await this.api('stops', comming.object.id);
        }
        return {
            objectId: comming.object.id,
            route: {
                name: comming.route.name.replace(/\d\./g, ''),
                type: this._typesRus[comming.route.vt],
            },
            destination: {
                name: comming.direction.endName
            },
            stop: {
                name: stops && stops.priorStop && stops.priorStop.zones[0].name
            },
            arrival: {
                time: comming.time,
                wait: comming.wait,
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

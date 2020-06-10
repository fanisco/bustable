import Stop from '../models/Stop';
import {typeNames, typeCodes, typeSeats} from './g2b/types';
import {atob} from 'atob';
import CoreException from '../core/CoreException';
import random from '../helpers/random';

const fetch = require('node-fetch');
const base = atob('aHR0cHM6Ly9nbzJidXMucnU=');
const example = [{
    objectId: '',
    route: {
        name: 87,
        type: 'маршрутное такси',
        code: 'M'
    },
    destination: {
        name: 'Ул. Крымская',
        type: ''
    },
    stop: {
        name:'Музей изобразительных искусств',
        type: ''
    },
    arrival: {
        time: '2020-05-26T12:22:23',
        wait: '00:00:34.4070000'
    },
    seats: {
        occupied: 12,
        total: 32
    }
}];

/**
 * Получаем геопозиции автобусов из стороннего источника.
 */
const thirdparty = {
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
        console.log(url);
        const req = await fetch(url);
        return req.json();
    },

    /**
     * Таблица с геолокоцией и статистическими корректировками.
     */
    async get({stopId}) {
        if (!stopId) {
            throw new CoreException('Внутренняя ошибка сервера');
        }
        // return example;
        const stop = await Stop.getById(stopId);
        const comings = await this.api('comings', stop.zoneId);
        return Promise.all(comings.map((coming, i) => this._getMoreInfoForComming(coming, i + 1)));
    },

    /**
     * Проверка: есть ли у автобуса в пути данная остановка.
     */
    async isStopOnTheWay({stopId, objectId}) {
        if (!stopId || !objectId) {
            throw new CoreException('Внутренняя ошибка сервера');
        }
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

    /**
     * Информация строчки таблицы.
     */
    async _getMoreInfoForComming(comming, n) {
        let stops;
        if (n <= 10) {
            stops = await this.api('stops', comming.object.id);
        }
        return {
            objectId: comming.object.id,
            route: {
                name: comming.route.name.replace(/\./g, ''),
                type: typeNames[comming.route.vt],
                code: typeCodes[comming.route.vt],
            },
            destination: this._parseStop(comming.direction.endName),
            ...(stops && stops.priorStop ? {
                stop: this._parseStop(stops.priorStop.zones[0].name)
            } : {}),
            arrival: {
                time: comming.time,
                wait: comming.wait,
            },
            seats: this._getSeats(comming.route.vt)
        };
    },
    _getSeats(type) {
        const seats = typeSeats[type];
        return {
            occupied: random(1, seats),
            total: seats
        }
    },
    _parseStop(stop) {
        const [parts] = stop.matchAll(/(.+)\s\((.+)\)$/g, '');
        if (!parts) {
            return {
                name: stop
            };
        }
        return {
            name: parts[1],
            type: parts[2]
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
    _getNextComingsUrl: (zoneId, city = 'kal') => `${base}/infonextcomings?zoneId=${zoneId}&srv=${city}`,
    _getNextStopsUrl: (objectId, city = 'kal') => `${base}/infonextstops?objectId=${objectId}&srv=${city}`,
    _getStatesUrl: (routes, types, city = 'kal') => `${base}/inforoutestates?vt=${types.join(';')}&srv=${city}&route=${routes.join(';')}`
};

export default thirdparty;

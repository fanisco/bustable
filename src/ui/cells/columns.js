import Route from './Route';
import Stop from './Stop';
import Arrival from './Arrival';
import Seats from './Seats';

const columns = [{
    name: 'route',
    title: '№',
    align: 'left',
    width: '8em',
    template: Route
}, {
    name: 'stop',
    title: '',
    align: 'left',
    width: '1fr',
    template: Stop,
    visibility: (width) => width > 1024
}, {
    name: 'seats',
    title: '',
    align: 'left',
    width: '8em',
    template: Seats,
    visibility: (width) => width > 1360
}, {
    name: 'destination',
    title: 'Направление',
    align: 'left',
    width: '1fr',
    template: Stop
}, {
    name: 'arrival',
    title: 'Прибытие',
    align: 'right',
    width: '15em',
    template: Arrival
}];

export default columns;

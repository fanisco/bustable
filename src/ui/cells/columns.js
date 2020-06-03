import Route from './Route';
import Stop from './Stop';
import Arrival from './Arrival';

const columns = [
    {name: 'route', title: '№', align: 'left', width: '10%', template: Route},
    {name: 'stop', title: '', align: 'left', width: '1fr', template: Stop, visibility: (width) => width > 1024},
    {name: 'destination', title: 'Направление', align: 'left', width: '1fr', template: Stop},
    {name: 'arrival', title: 'Прибытие', align: 'right', width: '20%', template: Arrival}
];

export default columns;

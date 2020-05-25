import React, { Component } from 'react';
import axios from 'axios';
import Timetable from './ui/Timetable';
import Route from './ui/cells/Route';
import Stop from './ui/cells/Stop';
import Arrival from './ui/cells/Arrival';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { table: [], stop: {}, stopId: process.env.REACT_APP_STOP_ID };
    }
    // https://stackoverflow.com/questions/47970276/is-using-async-componentdidmount-good
    async componentDidMount(props) {

        // Stop data
        const stop = await this.getStop(this.state.stopId);
        this.setState({ stop });

        // Table rows
        const table = await this.getTable(stop.id);
        this.setState({ table });

        // Repeating XHR
        const repeating = async () => {
            const table = await this.getTable(stop.id);
            this.setState({ table });
            return runAtZero(repeating);
        };

        // Refresh data
        await repeating();
    }
    async getStop(stopId) {
        const url = `/api/stop/${stopId}`;
        const res = await axios(url);
        return res.data;
    }
    async getTable(stopId) {
        const url = `/api/gpstable?stopId=${stopId}`;
        const res = await axios(url);
        return res.data;
    }
    render() {
        return (
            <div>
                <Timetable
                    stop={this.state.stop}
                    table={this.state.table}
                    columns={{
                        route: { title: '№', align: 'left', width: '10%', template: Route },
                        destination: { title: '', align: 'left', width: '1fr', template: Stop },
                        stop: { title: 'Направление', align: 'left', width: '1fr', template: Stop },
                        arrival: { title: 'Прибытие', align: 'right', width: '20%', template: Arrival }
                    }}
                />
            </div>
        );
    }
}

const interval = process.env.REACT_APP_REFRESH_INTERVAL;

const runAtZero = (fn) => {
    const date = new Date();
    const ms = date.getSeconds() * 1000 + date.getMilliseconds();
    return setTimeout(fn, lim(interval - ms, 0, interval));
};

const lim = (val, min, max) => Math.max(Math.min(val, max), min);

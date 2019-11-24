import React, { Component } from 'react';
import axios from 'axios';
import Timetable from "./ui/Timetable";

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
        const table = await this.getTable(stop.name);
        this.setState({ table });

        // Refresh data
        setInterval(async () => {
            const table = await this.getTable();
            this.setState({ table });
        }, 60000);
    }
    async getStop(stopId) {
        const url = `/api/stop/${stopId}`;
        const res = await axios(url);
        return res.data;
    }
    async getTable(stopId) {
        const url = `/api/table?stop=${stopId}`;
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
                        route: { title: '№', align: 'left', width: '10%' },
                        destination: { title: 'Направление', align: 'left', width: '1fr' },
                        time: { title: 'Прибытие', align: 'right', width: '20%' }
                    }}
                />
            </div>
        );
    }
}

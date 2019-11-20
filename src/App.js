import React, { Component } from 'react';
import axios from 'axios';
import Timetable from "./ui/Timetable";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }
    componentDidMount() {
        this.getTable().then(() => {
            setInterval(() => this.getTable(), 60000);
        });
    }
    async getTable() {
        const url = '/api/table?route=11&stop=Гостиница Калининград';
        const result = await axios(url);
        this.setState({ data: result.data });
    }
    render() {
        return (
            <div>
                <Timetable
                    data={this.state.data}
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

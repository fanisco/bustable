import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timetable from "./ui/Timetable";

export default function App() {
    const data = useAxios('/api/table');
    return (
        <div>
            <Timetable
                data={data}
                columns={{
                    route: { title: '№', align: 'left', width: '10%' },
                    destination: { title: 'Направление', align: 'left', width: '1fr' },
                    arrival: { title: 'Прибытие', align: 'right', width: '20%' }
                }}
            />
        </div>
    );
}

const useAxios = (url) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(url).then((request) => {
            setData(request.data);
        })
    }, []);
    return data;
};

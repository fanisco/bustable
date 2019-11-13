import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timetable from "./ui/Timetable";

export default function App() {
    const data = useAxios('/api/table');
    return (
        <div>
            <Timetable data={data}/>
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

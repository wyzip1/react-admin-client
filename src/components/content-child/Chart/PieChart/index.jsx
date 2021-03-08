import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import axios from 'axios'
import { Card, Button, message } from 'antd';


export default function Index() {
    const [options, setOptions] = useState({});
    const [loading, setLoadings] = useState(false);
    function getOptions() {
        return new Promise((res, rej) => {
            setLoadings(true);
            setTimeout(() => {
                axios.get('/chart/groupBycategoryTotalSales').then(({ data: { status, meta: { msg, data } } }) => {
                    setLoadings(false);
                    if (status) return rej(msg);
                    let options = {
                        legend: {
                            top: 'top'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        series: [
                            {
                                name: '销量占比',
                                type: 'pie',
                                radius: [50, 250],
                                center: ['50%', '50%'],
                                roseType: 'area',
                                itemStyle: {
                                    borderRadius: 8
                                },
                                data: data.map(item => ({ name: item.name, value: item.total }))
                            }
                        ]
                    };
                    setOptions(options);
                    res(msg);
                }).catch(err => {
                    setLoadings(false);
                    rej(err.message)
                });
            }, 500);
        })
    }

    useEffect(() => {
        getOptions();
    }, [])
    return (
        <Card title={
            <div>
                <h1><strong>各类销量统计</strong></h1>
                <Button type="primary" onClick={() => {
                    getOptions().then(msg => message.success(msg)).catch(err => message.error(err));
                }} loading={loading}>更新</Button>
            </div>
        }>
            <ReactECharts option={options} style={{ height: "65vh" }} />
        </Card>
    )
}
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
                    let xdata = data.map(item => item.name);
                    let ydata = data.map(item => item.total);

                    let options = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: xdata,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '销量',
                                type: 'line',
                                barWidth: '60%',
                                data: ydata
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

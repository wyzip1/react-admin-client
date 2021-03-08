import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Card, Statistic, Tabs, DatePicker, Steps } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import moment from 'moment'

const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { Step } = Steps
const options1 = {
    tooltip: { trigger: 'axis' },
    legend: {},
    dataset: {
        source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 10, 82.1, 45.7, 70.1, 53.4, 45.1],
            ['Matcha Latte', 100, 51.4, 95.1, 53.3, 3.8, 118.7],
            ['Cheese Cocoa', 20, 62.2, 29.5, 36.4, 125.2, 32.5],
            ['Walnut Brownie', 25, 37.1, 141.2, 18, 33.9, 149.1]
        ]
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, },
    yAxis: { gridIndex: 0 },
    series: [
        { name: 'Milk Tea', type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { name: 'Matcha Latte', type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { name: 'Cheese Coco', type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { name: 'Walnut Brownie', type: 'line', smooth: true, seriesLayoutBy: 'row' },
    ]
}
const options2 = {
    tooltip: { trigger: 'axis' },
    grid: {
        top: '3%',
        bottom: '0%',
        left: '3%',
        right: '4%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [40, 50, 60, 150, 55, 38, 25, 38, 68, 39, 57, 36],
        type: 'bar'
    }]
};
export default function Index() {
    const [op1, setop1] = useState({});
    const [op2, setop2] = useState({});
    useEffect(() => {
        let c = setTimeout(() => {
            setop1(options1);
            setop2(options2);
        }, 100);
        return () => {
            clearTimeout(c);
        }
    }, []);
    return (
        <div className={styles.home}>
            <Card title="商品总量" className={styles.shopping} extra={<QuestionCircleOutlined />}>
                <h1 className={styles.shoppingCount}><Statistic value={1128163} />个</h1>
                <p>
                    周同比 15 % <ArrowUpOutlined className={styles.up} />
                    <br />
                    日同比 15 % <ArrowDownOutlined className={styles.down} />
                </p>
            </Card>
            <ReactECharts option={op1} className={styles.echart1} />
            <Card className={styles.xb} title={
                <Tabs defaultActiveKey="1">
                    <TabPane tab="访问量" key="1" />
                    <TabPane tab="销售量" disabled key="2" />
                </Tabs>
            } extra={<RangePicker defaultValue={[moment('2021-02-26'), moment('2021-03-06')]} disabled />}>
                <div className={styles.xbContent}>
                    <Card style={{ flex: 3, marginRight: '10%' }} title="访问趋势" extra={<ReloadOutlined />}>
                        <ReactECharts option={op2} style={{ height: '230px' }} />
                    </Card>
                    <Card style={{ flex: 2 }} title="任务" extra={<ReloadOutlined />} >
                        <Steps progressDot direction="vertical" style={{ height: '230px' }}>
                            <Step title="完成网站设计初版" status="finish" />
                            <Step title="联调接口" status="finish" description="功能验收" />
                            <Step title="登陆功能设计" status="finish" description={<span>权限验证<br />页面排版</span>} />
                        </Steps>
                    </Card>
                </div>
            </Card>
        </div>
    )
}

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import BarChart from './BarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'

export default function index() {
    return (
        <Switch>
            <Route path="/chart/barchart" component={BarChart} />
            <Route path="/chart/linechart" component={LineChart} />
            <Route path="/chart/piechart" component={PieChart} />
        </Switch>
    )
}

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Class from './Class'
import Goods from './Goods'

export default function index() {
    return (
        <Switch>
            <Route path="/shopping/class" component={Class} />
            <Route path="/shopping/goods" component={Goods} />
        </Switch>
    )
}

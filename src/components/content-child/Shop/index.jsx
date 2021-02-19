import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Category from './Category'
import Goods from './Goods'

export default function index() {
    return (
        <Switch>
            <Route path="/shopping/category" component={Category} />
            <Route path="/shopping/goods" component={Goods} />
            <Redirect to="/shopping/category" />
        </Switch>
    )
}

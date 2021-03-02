import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Category from './Category'
import Goods from './Goods'
import Add from './AddAndUpdate/Add'
import Update from './AddAndUpdate/Update'

export default function index() {
    return (
        <Switch>
            <Route path="/shopping/category" component={Category} />
            <Route path="/shopping/goods" component={Goods} />
            <Route path="/shopping/add" component={Add} />
            <Route path="/shopping/update" component={Update} />
            <Redirect to="/shopping/category" />
        </Switch>
    )
}

import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Category from './Category'
import Goods from './Goods'
import AddAndUpdate from './AddAndUpdate'

export default function index() {
    return (
        <Switch>
            <Route path="/shopping/category" component={Category} />
            <Route path="/shopping/goods" component={Goods} />
            <Route path="/shopping/addAndUpdate" component={AddAndUpdate} />
            <Redirect to="/shopping/category" />
        </Switch>
    )
}

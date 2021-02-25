import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { routes } from './router'

export default function index() {
    return (
        <main>
            <Switch>
                {routes.map(({ path, component }, index) =>
                    <Route key={index} path={path} component={component} />)}
            </Switch>
        </main>
    )
}

import { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom'
import { routes } from './router'

function routesMap() {
    return routes.map(({ path, component }, index) =>
        <Route key={index} path={path} component={component} />);
}

function App({ location: { pathname }, history: { replace } }) {
    let _token = localStorage.getItem('token');
    const [token, setToken] = useState(_token);
    let routesRender = routesMap();
    useEffect(() => {
        if (pathname !== '/login' && !token)
            replace('/login');
    }, [token]);
    return (
        <main>
            <Switch>
                {routesRender}
            </Switch>
        </main>
    );
}

export default withRouter(App);

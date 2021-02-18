import { Route, Switch, withRouter } from 'react-router-dom'
import { routes } from './router'

function routesMap() {
    return routes.map(({ path, component }, index) =>
        <Route key={index} path={path} component={component} />);
}

function App({ location: { pathname }, history: { replace } }) {
    let _token = sessionStorage.getItem('token');
    if (!_token && pathname !== '/login') {
        replace('/login');
    }
    let routesRender = routesMap();
    return (
        <main>
            <Switch>
                {routesRender}
            </Switch>
        </main>
    );
}

export default withRouter(App);

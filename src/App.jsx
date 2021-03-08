import { Route, Switch, withRouter } from 'react-router-dom'
import { routes } from './router'

function routesMap() {
    return routes.map(({ path, component }, index) =>
        <Route key={index} path={path} component={component} />);
}

function App({ location: { pathname }, history: { replace } }) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const authurls = user ? user.role : null;
    let _token = sessionStorage.getItem('token');
    if (!_token && pathname !== '/login') {
        replace('/login');
    } else if (pathname !== '/' && pathname !== '/login' && (!authurls || !authurls.includes(pathname))) {
        replace('/');
    }
    return (
        <main>
            <Switch>
                {routesMap()}
            </Switch>
        </main>
    );
}

export default withRouter(App);

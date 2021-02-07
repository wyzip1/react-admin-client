import { Route, Switch } from 'react-router-dom'
import Login from './views/Login'
import Main from './views/main'

function App() {
    return (
        <main>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/" component={Main} />
            </Switch>
        </main>
    );
}

export default App;

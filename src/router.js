import Main from './views/Main'
import Login from './views/Login'

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: 'main',
        component: Main
    },
]
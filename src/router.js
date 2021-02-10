import Main from './views/main'
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
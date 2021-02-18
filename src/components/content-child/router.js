import Home from '../../components/content-child/Home'
import Shop from '../../components/content-child/Shop'
import User from '../../components/content-child/User'
import Role from '../../components/content-child/Role'
import Chart from '../../components/content-child/Chart'

export const routes = [
    {
        path: '/shopping',
        name: 'Shop',
        component: Shop
    },
    {
        path: '/user',
        name: 'User',
        component: User
    },
    {
        path: '/role',
        name: 'Role',
        component: Role
    },
    {
        path: '/chart',
        name: 'Chart',
        component: Chart
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
]
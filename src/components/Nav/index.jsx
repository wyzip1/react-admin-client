import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import { nav } from './nav-config'
import styles from './styles.module.css'
import logo from '../../asset/logo.svg'


export default function Nav({ collapsed, setCollapsed, path }) {
    path = path === '/shopping' ? '/shopping/category' :
        path === '/chart' ? '/chart/barchart' : path;
    // 找出有二级菜单的 key
    const hasChild = nav.filter(({ children }) => children ? true : false).map(item => item.key);
    // 递归渲染左侧菜单
    const menuItem = ({ title, key, icon, children }) => !children ?
        (<Menu.Item key={key} icon={icon}><Link to={key}>{title}</Link></Menu.Item>) :
        (<Menu.SubMenu key={key} icon={icon} title={title}>
            {children.map(menuItem)}
        </Menu.SubMenu>)

    return (
        <div className={styles.leftNav}>
            <div className={styles.logo}>
                <img src={logo} />
                <h1 className={collapsed ? styles.hide : ''}>react 后台</h1>
            </div>
            <Button
                className={styles.collapseBtn + ` ${collapsed ? styles.auto : ''}`}
                type="primary" onClick={() => setCollapsed(!collapsed)}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
            <Menu selectedKeys={[path]} defaultOpenKeys={hasChild} mode='inline' theme="light">
                {nav.map(menuItem)}
            </Menu>
        </div>
    )
}

import React, { useState } from 'react'
import { Layout, Spin } from 'antd'
import Nav from '../../components/Nav'
import HeaderChild from '../../components/Header-Child'
import ContentChild from '../../components/content-child'
import styles from './styles.module.css'
// import { connect } from 'react-redux'


const { Header, Sider, Content, Footer } = Layout;
export default function Main({ location: { pathname } }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width='270px' className={styles['bg-white'] + ' ' + styles['bd']} collapsed={collapsed}>
                <Nav path={pathname} setCollapsed={setCollapsed} collapsed={collapsed} />
            </Sider>
            <Layout className={styles['height-100']}>
                <Header className={styles['bg-white'] + ' ' + styles['p-0'] + ' ' + styles['h-1']}>
                    <HeaderChild />
                </Header>
                <Content className={styles.content}>
                    <ContentChild />
                </Content>
                <Footer className={styles.footer}>推荐使用Google浏览器，获得更好的页面体验</Footer>
            </Layout>
        </Layout>
    )
}

// export default connect(
//     state => ({ user: state.user })
// )(Main);



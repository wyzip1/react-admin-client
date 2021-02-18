import React from 'react'
import { Layout } from 'antd'
// import { connect } from 'react-redux'
// import { Switch } from 'react-router-dom'
// import { routes } from './router'

const { Header, Sider, Content } = Layout;

export default function Main() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return (
        <Layout style={{ height: '100vh' }}>
            <Sider>Sider</Sider>
            <Layout>
                <Header>Header</Header>
                <Content>Content</Content>
            </Layout>
        </Layout>
    )
}

// export default connect(
//     state => ({ user: state.user })
// )(Main);



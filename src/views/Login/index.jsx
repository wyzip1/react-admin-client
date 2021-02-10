import React from 'react'
import styles from './styles.module.css'
import Logo from '../../asset/logo.svg'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function Login({ history: { push } }) {
    function onFinish(values) {
        axios.post('/manager/login', values).then(({ data: { status, meta } }) => {
            if (status === 0) {
                message.success(meta.msg);
                localStorage.setItem('token', meta.token);
                push('/');
            } else message.warning(meta.msg);
        }).catch(err => {
            message.error(err)
        });
    }
    return (
        <div className={styles.login}>
            <header>
                <img src={Logo} alt="Logo" />
                <strong>React项目：后台管理系统</strong>
            </header>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
                initialValues={{ username: 'admin', password: 'admin' }}>

                <h2>Login</h2>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input autoComplete="off" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}>
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

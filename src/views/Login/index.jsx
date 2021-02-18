import React from 'react'
import styles from './styles.module.css'
import Logo from '../../asset/logo.svg'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'
// import { connect } from 'react-redux'
// import { loginUser } from '../../redux/actions/user'

export default function Login({ history: { push } }) {
    let isRequest = false;
    function onFinish(values) {
        if (isRequest) return message.info('请求过于频繁');
        // 开启登录请求
        isRequest = true;
        axios.post('/login', values).then(({ data: { status, meta } }) => {
            // 登录请求结束
            isRequest = false;
            // 登陆失败
            if (status !== 0) return message.warning(meta.msg);
            // 登录成功
            message.success(meta.msg);
            sessionStorage.setItem('token', meta.token);
            sessionStorage.setItem('user', JSON.stringify(meta.user));
            // loginUser(meta.user);
            push('/');
        }).catch(err => {
            isRequest = false;
            message.error(err.message);
        })
    }
    // 统一验证完毕出错时的函数
    function onFinishFailed({ errorFields }) {
        message.warn(errorFields[0].errors);
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
                onFinishFailed={onFinishFailed}
                initialValues={{ username: 'admin', password: 'admin' }}>

                <h2>Login</h2>
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: '请输入用户名' },
                        { min: 4, max: 18, message: '请输入长度4-18的用户名', validateTrigger: 'onChange' }
                    ]}>
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

// export default connect(
//     state => ({ user: state.user }),
//     { loginUser }
// )(Login)
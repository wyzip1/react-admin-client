import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import styles from './styles.module.css'
import { Button, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import { nav } from '../Nav/nav-config.js'
import logo from '../../asset/logo.png'

function Index({ history: { replace, listen }, location: { pathname } }) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    // 使用 hooks 存储状态
    const [time, setTime] = useState();
    const [weather, setWeather] = useState({});
    const [page, setPage] = useState('首页');
    // 不监听任何值
    useEffect(() => {
        // 获取当前页面标题
        const activePage = (path) => {
            let second = [];
            function map(arr) {
                arr.map(item => item.children ? map(item.children) : second.push(item));
            }
            map(nav);
            let filter = second.filter(item => item.key === path);
            return filter.length ? filter.map(item => item.title).join() : '';
        }
        // 使用 moment 插件对 Date.now()获取的当前时间戳进行日期格式化
        const nowTime = () => moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        // 初始化部分状态值
        pathname = pathname === '/shopping' ? '/shopping/category' :
            pathname === '/chart' ? '/chart/barchart' :
                pathname === '/shopping/add' || pathname === '/shopping/update' ? '/shopping/goods' : pathname;
        setTime(nowTime());
        setPage(activePage(pathname));
        // 定时更改 hooks 状态的 time 值
        const getTime = setInterval(() => { setTime(nowTime()) }, 1000);
        // 具备token时发起天气请求
        if (sessionStorage.getItem('token')) {
            axios.get('/weather').then(res => {
                if (res.data.status === 0)
                    return setWeather(res.data.lives[0])
            }).catch(err => console.log(err));
        }
        let unlisten = listen(({ pathname }) => {
            let path = pathname === '/shopping/add' || pathname === '/shopping/update' ? '/shopping/goods' : pathname;
            setPage(activePage(path));
        })
        return () => {
            unlisten();
            clearInterval(getTime);
        }
    }, [])

    const sureModal = () => {
        Modal.confirm({
            title: '退出登录',
            icon: <ExclamationCircleOutlined />,
            content: '确认退出登录',
            okText: '确认',
            cancelText: '取消',
            // onOk的返回值为Promise的时候会触发异步的Loading效果
            onOk: () => new Promise(res => {
                setTimeout(() => {
                    res();
                    sessionStorage.clear();
                    message.success('退出登录成功')
                    replace('/login');
                }, 500);
            })
        });
    }

    return (
        <div className={styles.header}>
            <div className={styles.top}>
                <span>欢迎，{user?.username}</span>
                <Button type="danger" onClick={sureModal}>退出</Button>
            </div>
            <img src={logo} className={styles.headLogo} />
            <div className={styles.down}>
                <div className={styles.page}>
                    {page}
                </div>
                <span className={styles.dayInfo}>
                    {time} / {weather.weather} / {weather.province}省 / {weather.city}
                </span>
            </div>
        </div>
    )
}

export default withRouter(Index)

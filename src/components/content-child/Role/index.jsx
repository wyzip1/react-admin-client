import React, { useEffect, useState } from 'react'
import { Card, Form, Modal, message, Button, Table, Input, Tree } from 'antd'
import axios from 'axios';
import moment from 'moment'
import { nav } from '../../Nav/nav-config'


let cancel;
const authTree = [{ title: '平台权限', key: 'root', children: nav }]
export default function Role() {
    const [data, setData] = useState();
    const [total, setTotal] = useState(0);
    const [searhLoading, setSearchLoading] = useState(false);
    const [createRole, setCreateRole] = useState(false);
    const [createForm] = Form.useForm();
    const [pcLoading, setPcLoading] = useState(false);
    const [authModal, setAuthModal] = useState(false);
    const [authFrom] = Form.useForm();
    const [roleInfo, setRoleInfo] = useState({});
    const [auths, setauths] = useState([]);
    const [putLoading, setPutLoading] = useState(false);
    const [putNLoading, setPutNLoading] = useState(false);
    const [updNameModal, setUpdNameModal] = useState(false);
    const [nameForm] = Form.useForm();
    const [nRoleInfo, setNRoleInfo] = useState();
    const [pageSize, setPageSize] = useState(5);
    const [pageNum, setPageNum] = useState(1);
    const columns = [
        { title: '角色名称', dataIndex: 'name', key: 'name' },
        {
            title: '创建时间', dataIndex: 'create_time', key: 'create_time',
            render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '授权时间', dataIndex: 'auth_time', key: 'auth_time',
            render: (time) => time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : null
        },
        { title: '授权人', dataIndex: 'auth_name', key: 'auth_name' },
        {
            title: '操作', align: 'center', width: '200px',
            render: state => {
                const isRoot = state.auth_id === 'init';
                return (
                    <div>
                        <Button type="primary" disabled={isRoot} onClick={() => {
                            setNRoleInfo(state);
                            setTimeout(() => {
                                setUpdNameModal(true);
                                nameForm.resetFields();
                            }, 10);
                        }} style={{ marginRight: '10px' }}>修改</Button>
                        <Button type="danger" disabled={isRoot} onClick={() => { showdelConfirm(state) }}>删除</Button>
                    </div>
                )
            }
        },
    ];


    function getData({ pageSize = 5, pageNum = 1, }) {
        setSearchLoading(true);
        axios.get('/role/list',
            {
                params: { pageNum, pageSize },
                cancelToken: new axios.CancelToken(function executor(c) {
                    cancel = c;
                })
            }
        ).then(({ data: { status, meta: { msg, data, total, pageNum, pageSize } } }) => {
            setSearchLoading(false);
            if (status) return message.warn(msg);
            setData(data);
            setTotal(total);
            setPageNum(pageNum);
            setPageSize(pageSize);
        }).catch(err => {
            if (!axios.isCancel(err)) {
                console.log('查询角色列表失败：', err);
                message.error(err.message);
                setSearchLoading(false);
            }
        });
    }

    function change(pageNum, pageSize) {
        getData({ pageNum, pageSize })
    }

    function postRole({ name }) {
        setPcLoading(true);
        axios.post('/role/add', { name }).then((
            { data: { status, meta: { msg, data } } }
        ) => {
            setPcLoading(false);
            if (status) return message.warn(msg);
            message.success(msg);
            setCreateRole(false);
            createForm.resetFields();
            getData({ pageSize });
        }).catch(err => {
            setPcLoading(false);
            console.log('添加角色错误：', err);
            message.error(err.message);
        });
    }

    function showdelConfirm(state) {
        Modal.confirm({
            title: `确认删除【${state.name}】角色信息？`,
            onOk: dcRole(state),
            okText: "确认",
            cancelText: "取消",
            cancelButtonProps: { type: 'danger' }
        });
    }

    function dcRole(state) {
        return () => {
            return new Promise((res, rej) => {
                axios.delete('/role/delete',
                    { params: { id: state._id } }
                ).then(({ data: { status, meta: { msg, data } } }) => {
                    if (status) {
                        message.warn(msg);
                        return rej();
                    }
                    message.success(msg);
                    if (data._id === roleInfo._id) {
                        setauths([]);
                        setRoleInfo({});
                    }
                    getData({ pageNum, pageSize });
                    res();
                }).catch(err => {
                    console.log('删除角色失败：', err);
                    message.error(err.message);
                    rej();
                })
            });
        }
    }

    function changeRoleInfo(roleInfo) {
        setRoleInfo(roleInfo);
        if (roleInfo.menus.includes('/shopping/add')) {
            let i1 = roleInfo.menus.indexOf('/shopping/add');
            roleInfo.menus.splice(i1, 1);
            let i2 = roleInfo.menus.indexOf('/shopping/update');
            roleInfo.menus.splice(i2, 1);
            setauths(roleInfo.menus);
        } else setauths(roleInfo.menus);
    }

    function changeAuth(keys) {
        setauths(keys);
    }

    function putAuth() {
        const { username, _id } = JSON.parse(sessionStorage.getItem('user'));
        let menus;
        if (auths.includes('/shopping/goods')) {
            menus = [...auths, '/shopping/add', '/shopping/update']
        } else menus = auths;
        setPutLoading(true);
        axios.put('/role/update',
            { id: roleInfo._id, menus, auth_name: username, auth_id: _id }
        ).then(({ data: { status, meta: { msg, data } } }) => {
            setPutLoading(false);
            if (status) return message.warn(msg);
            message.success(msg);
            setAuthModal(false);
            getData({ pageSize, pageNum });
        }).catch(err => {
            setPutLoading(false);
            console.log('修改角色权限失败：', err);
            message.error(err.message);
        });
    }

    async function putName({ name }) {
        setPutNLoading(true);
        try {
            const { data: { status, meta: { msg, data } } } =
                await axios.put('/role/update', { id: nRoleInfo._id, name });
            setPutNLoading(false);
            if (status) return message.warn(msg);
            setUpdNameModal(false);
            message.success(msg);
            getData({ pageSize, pageNum });
        } catch (err) {
            setPutNLoading(false);
            message.error(err.message);
            console.log('角色名称修改失败', err)
        }
    }

    useEffect(() => {
        getData({});
        return () => {
            cancel('Operation canceled by the user.');
        }
    }, [])
    return (
        <Card title={
            <div>
                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => { setCreateRole(true) }}>创建角色</Button>
                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => {
                    if (roleInfo.name) {
                        setAuthModal(true);
                        setTimeout(() => {
                            authFrom.resetFields();
                        }, 10)
                    } else message.warn('请选择需要设置权限的角色');
                }}>设置角色权限</Button>
                <Button loading={searhLoading} onClick={() => { getData({ pageSize, pageNum }) }}>刷新列表</Button>
            </div>
        }>
            <Table
                loading={searhLoading}
                columns={columns}
                dataSource={data}
                bordered rowKey="_id"
                rowSelection={{
                    type: 'radio',
                    columnWidth: '80px',
                    onSelect: changeRoleInfo,
                    getCheckboxProps: a => ({ disabled: a.auth_id === 'init' })
                }}
                pagination={{
                    total: total,
                    showSizeChanger: true,
                    current: parseInt(pageNum),
                    defaultPageSize: 5,
                    pageSizeOptions: [5, 10, 15],
                    onShowSizeChange: change,
                    onChange: change
                }}
            />
            <Modal
                visible={createRole} confirmLoading={pcLoading}
                title="创建角色" cancelButtonProps={{ type: 'danger' }}
                onCancel={() => { setCreateRole(false); createForm.resetFields(); }}
                okText="确定" cancelText="取消"
                onOk={() => { createForm.submit(); }}
            >
                <Form form={createForm} onFinish={postRole}>
                    <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                visible={authModal} onCancel={() => { setAuthModal(false) }}
                title="设置权限" okText="确定" cancelText="取消" confirmLoading={putLoading}
                cancelButtonProps={{ type: 'danger' }} onOk={() => { authFrom.submit() }}
            >
                <Form form={authFrom} onFinish={putAuth}>
                    <Form.Item label="角色名称" name="name" initialValue={roleInfo.name}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item>
                        <Tree
                            treeData={authTree} checkable
                            defaultExpandedKeys={['root', 'shopping', 'chart']}
                            checkedKeys={auths} onCheck={changeAuth}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                visible={updNameModal} cancelText="取消" onOk={() => { nameForm.submit(); }}
                title="更新角色名称" okText="确定" cancelButtonProps={{ type: 'danger' }}
                confirmLoading={putNLoading} onCancel={() => { setUpdNameModal(false); }}
            >
                <Form form={nameForm} onFinish={putName}>
                    <Form.Item label="角色名称" name="name" initialValue={nRoleInfo ? nRoleInfo.name : ''}
                        rules={[{ required: true, message: '请输入新的角色名称' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card >
    )
}

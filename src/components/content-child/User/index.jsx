import React, { useEffect, useState } from 'react'
import { Card, Table, Button, message, Modal, Form, Select, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Search from './Search'
import axios from 'axios'


export default function Index() {
    const columns = [
        { title: "用户名称", dataIndex: 'username', key: "username" },
        {
            title: "角色", dataIndex: 'role_id', key: "role_id",
            render: (id) => {
                for (let i of roles) {
                    if (i._id === id)
                        return i.name;
                }
            }
        },
        { title: "用户邮箱", dataIndex: 'email', key: "email" },
        { title: "用户电话", dataIndex: 'phone', key: "phone" },
        {
            title: "操作", width: '200px', align: 'center',
            render: (state) => {
                return <div>
                    <Button type="primary" disabled={state.isRoot} onClick={() => {
                        setUpdFormInit(state);
                        setTimeout(() => {
                            updForm.resetFields();
                        }, 50);
                        setUpdModal(true);
                    }} style={{ marginRight: '10px' }}>修改</Button>
                    <Button disabled={state.isRoot} onClick={dc(state._id)} type="danger">删除</Button>
                </div>
            }
        },
    ]
    const [data, setData] = useState();
    const [searchLoading, setSearchLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [updModal, setUpdModal] = useState(false);
    const [updModalLoading, setUpdModalLoading] = useState(false);
    const [updForm] = Form.useForm();
    const [addForm] = Form.useForm();
    const [updFormInit, setUpdFormInit] = useState({});
    const [addModal, setAddModal] = useState(false);
    const [addModalLoading, setAddModalLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [total, setTotal] = useState(0);

    function getRoles() {
        axios.get('/role/lists').then(res => {
            if (!res.data.status) setRoles(res.data.meta.data);
        })
    }

    function getData({ pageNum = 1, pageSize = 5, username = '' }) {
        return new Promise((res, rej) => {
            setSearchLoading(true);
            axios.get('/user/list',
                { params: { pageNum, pageSize, username } }
            ).then(({ data: { status, meta: { msg, data, total, pageNum, pageSize } } }) => {
                setSearchLoading(false);
                if (status) return rej(msg);
                setData(data);
                setTotal(total);
                setPageNum(pageNum);
                setPageSize(pageSize);
                res(msg);
            }).catch(err => {
                setSearchLoading(false);
                console.log(err);
                rej(err.message)
            });
        });
    }

    function update(state) {
        setUpdModalLoading(true);
        axios.put('/user/update',
            { ...state, id: updFormInit._id }
        ).then(({ data: { status, meta: { msg, data } } }) => {
            setUpdModalLoading(false);
            if (status) return message.warn(msg);
            message.success(msg);
            setUpdModal(false);
            getData({ pageNum, pageSize });
        }).catch(err => {
            setUpdModalLoading(false);
            console.log(err);
            message.error(err.message);
        });
    }

    function add(state) {
        setAddModalLoading(true);
        axios.post('/user/add', state).then(({ data: { status, meta: { msg } } }) => {
            setAddModalLoading(false);
            if (status) return message.warn(msg);
            message.success(msg);
            addForm.resetFields();
            setAddModal(false);
            getData({ pageSize });
        }).catch(err => {
            setAddModalLoading(false);
            console.log(err);
            message.error(err.message);
        });
    }

    function dc(id) {
        return () => {
            Modal.confirm({
                title: "删除用户再次确认",
                cancelText: '取消', okText: '确认',
                cancelButtonProps: { type: 'danger' },
                onOk: () => {
                    return new Promise((res, rej) => {
                        axios.delete('/user/delete',
                            { params: { id } }
                        ).then(({ data: { status, meta: { msg } } }) => {
                            if (status) {
                                rej();
                                return message.warn(msg);
                            }
                            message.success(msg);
                            getData({ pageNum, pageSize });
                            res();
                        }).catch(err => {
                            console.log(err);
                            message.error(err.message);
                            rej();
                        });
                    })
                }
            })
        }
    }

    function changePage(pageNum, pageSize) {
        getData({ pageNum, pageSize });
    }

    function changeSize(pageNum, pageSize) {
        getData({ pageNum, pageSize });
    }

    useEffect(async () => {
        await getRoles();
        getData({}).catch(err => message.error(err));
    }, [])

    return (
        <Card
            title={<Search loading={searchLoading} getData={getData} />}
            extra={<Button type="primary" onClick={() => { setAddModal(true) }} icon={<PlusOutlined />}>添加用户</Button>}
        >
            <Table
                loading={searchLoading}
                columns={columns}
                rowKey="_id"
                bordered dataSource={data}
                pagination={{
                    current: parseInt(pageNum),
                    showSizeChanger: true,
                    onShowSizeChange: changeSize,
                    total: total,
                    pageSize: parseInt(pageSize),
                    onChange: changePage,
                    pageSizeOptions: [5, 10, 15]
                }}
            />
            <Modal
                confirmLoading={updModalLoading}
                visible={updModal} title="修改用户信息"
                onCancel={() => { setUpdModal(false); }}
                cancelText="取消" cancelButtonProps={{ type: 'danger' }}
                okText="确定" onOk={() => { updForm.submit() }}
            >
                <Form form={updForm} onFinish={update}>
                    <Form.Item label="用户名称" name="username"
                        initialValue={updFormInit.username}
                        rules={[{ required: true, message: '请输入用户名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="角色名称" name="role_id"
                        initialValue={updFormInit.role_id}
                        rules={[{ required: true, message: '请选择角色' }]}
                    >
                        <Select>
                            {roles.map(item => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="用户邮箱" name="email"
                        initialValue={updFormInit.email}
                        rules={[{ required: true, message: '请输入用户邮箱' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="用户电话" name="phone"
                        initialValue={updFormInit.phone}
                        rules={[{ required: true, message: '请输入用户电话' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                confirmLoading={addModalLoading}
                visible={addModal} title="添加用户"
                onCancel={() => { addForm.resetFields(); setAddModal(false); }}
                cancelText="取消" cancelButtonProps={{ type: 'danger' }}
                okText="确定" onOk={() => { addForm.submit() }}
            >
                <Form form={addForm} onFinish={add}>
                    <Form.Item label="用户名称" name="username"
                        rules={[{ required: true, message: '请输入用户名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="用户密码" name="password"
                        rules={[{ required: true, message: '请输入用户密码' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="角色名称" name="role_id"
                        rules={[{ required: true, message: '请选择角色' }]}
                    >
                        <Select>
                            {roles.map(item => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="用户邮箱" name="email"
                        rules={[{ required: true, message: '请输入用户邮箱' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="用户电话" name="phone"
                        rules={[{ required: true, message: '请输入用户电话' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

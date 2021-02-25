import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Button, Modal, Form, Input, Table, Select, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import Breadcrumb from './categoryBreadcrumb'

let cancel;
export default function Index() {
    // hook 状态
    const [editInfo, setEditInfo] = useState({});
    const [lvlist, setlvlist] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [uvisible, usetVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [uconfirmLoading, usetConfirmLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [form] = Form.useForm();
    const [uform] = Form.useForm();
    // 方法区
    const getCategoryList = (parentId) => {
        setTableLoading(true);
        axios.get('/category/list',
            {
                params: { parentId }, cancelToken: new axios.CancelToken(function executor(c) {
                    cancel = c;
                })
            }
        ).then(res => {
            setTableLoading(false);
            if (res.data.status !== 0) return message.warn(res.data.meta.msg)
            setTableData(res.data.meta.data);
        }).catch(err => {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            } else {
                setTableLoading(false);
                console.log('获取分类列表错误：', err);
                message.error(err.message);
            }
        })
    }
    const addCategory = value => {
        setConfirmLoading(true);
        axios.post('/category/add', { ...value }).then(res => {
            setConfirmLoading(false);
            if (res.data.status !== 0) return message.warning(res.data.meta.msg);
            message.success(res.data.meta.msg);
            form.resetFields();
            setVisible(false);
            getCategoryList([...lvlist].pop()?._id || '0');
        }).catch(err => {
            setConfirmLoading(false);
            message.warning(err.message);
        })
    }
    const lookChild = ct => () => {
        setlvlist([...lvlist, ct]);
        getCategoryList(ct._id);
    }
    function changeList(id, list) {
        getCategoryList(id);
        setlvlist(list);
    }
    const update = value => {
        usetConfirmLoading(true);
        axios.put('/category/update',
            { categoryId: editInfo._id, categoryName: value.categoryName }
        ).then(({ data: { status, meta: { msg } } }) => {
            usetConfirmLoading(false);
            if (status !== 0) return message.warning(msg);
            message.success(msg);
            usetVisible(false);
            uform.resetFields();
            getCategoryList([...lvlist].pop()?._id || '0');
        }).catch(err => {
            usetConfirmLoading(false);
            message.warning(err.message);
        })
    }
    const dC = id => {
        return new Promise(async (res, rej) => {
            try {
                const { data: { status, meta: { msg } } } =
                    await axios.delete('/category/delete', { params: { categoryId: id } });

                if (status !== 0) {
                    message.warn(msg);
                    return rej();
                }
                message.success(msg);
                getCategoryList([...lvlist].pop()?._id || '0');
                return res();
            } catch (err) {
                message.err(err);
                return rej();
            }
        });
    }
    // 配置
    const columns = [
        { title: '分类名称', dataIndex: 'name', key: 'name' },
        {
            title: '操作',
            width: 300,
            render: (data) => {
                return (
                    <div>
                        <Button type="primary" onClick={() => {
                            setEditInfo(data);
                            usetVisible(true);
                            setTimeout(() => {
                                uform.resetFields();
                            }, 100);
                        }}>修改</Button>
                        <Button type="link" onClick={lookChild(data)}>查看子分类</Button>
                        <Button type="danger" onClick={
                            () => {
                                Modal.confirm({
                                    title: '删除确认',
                                    icon: <ExclamationCircleOutlined />,
                                    content: `确认将【${data.name}】及其所有子类删除么？`,
                                    okText: '确认',
                                    cancelText: '取消',
                                    cancelButtonProps: { type: 'danger' },
                                    onOk: () => dC(data._id)
                                });
                            }
                        }>删除</Button>
                    </div>
                )
            },
        }
    ];
    useEffect(() => {
        getCategoryList('0');
        return () => {
            // 中断请求
            cancel('Operation canceled by the user.');
        }
    }, [])
    return (
        <div style={{ height: '100%' }}>
            <Card
                style={{ height: '100%', padding: '40px', overflow: 'auto', border: 0 }}
                title={<Breadcrumb list={lvlist} changeList={changeList} />}
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>添加</Button>} >
                <Table columns={columns} bordered dataSource={tableData} rowKey="_id" loading={tableLoading} />
            </Card>
            {/* 添加 Modal */}
            <Modal maskClosable={false}
                confirmLoading={confirmLoading} cancelButtonProps={{ type: 'danger' }}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setVisible(false)
                }} title="添加分类"
                visible={visible} okText="确认" cancelText="取消">
                <Form onFinish={addCategory} form={form}>
                    <Form.Item label="选择分类" name="parentId"
                        rules={[{ required: true, message: '请输入分类名称' }]}>
                        <Select style={{ width: 200 }}>
                            <Select.Option disabled value="disable">-- 请选择分类 --</Select.Option>
                            {!lvlist.length ? <Select.Option value="0">根级分类</Select.Option> :
                                <Select.Option value={lvlist[lvlist.length - 1]._id}>{lvlist[lvlist.length - 1].name}</Select.Option>}
                            {tableData.map(item =>
                                <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="categoryName"
                        label="分类名称"
                        rules={[{ required: true, message: '请输入分类名称' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            {/* 修改 Modal */}
            <Modal
                visible={uvisible} cancelText="取消" okText="确认"
                onOk={() => { uform.submit(); }}
                onCancel={() => { uform.resetFields(); usetVisible(false); }}
                cancelButtonProps={{ type: "danger" }}
                confirmLoading={uconfirmLoading} title="修改分类"
                maskClosable={false}>
                <Form
                    form={uform} onFinish={update} initialValues={{ categoryName: editInfo.name }}
                    onFinishFailed={() => { usetConfirmLoading(false) }}>
                    <Form.Item rules={[{ required: true, message: '请输入修改名称' }]} name="categoryName">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
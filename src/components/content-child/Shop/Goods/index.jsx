import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Search from './Search'
import { Card, Button, Table, message, Switch, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

let cancel;
export default function Index({ history: { push } }) {
    const [shopData, setShopData] = useState();
    const [total, setTotal] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [detail, setDetail] = useState(false);
    const [content, setContent] = useState();
    const [pageNum, setPageNum] = useState();
    const [pageSize, setPageSize] = useState();
    const columns = [
        { title: '商品名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true, fixed: 'left' },
        { title: '商品描述', dataIndex: 'desc', key: 'desc', ellipsis: true },
        {
            title: '商品价格', dataIndex: 'price', key: 'price', width: 100, align: 'center',
            render: (price) => '￥' + price
        },
        {
            title: '商品售卖', dataIndex: 'status', key: 'status', width: 110, align: 'center',
            render: (status, state) => {
                return <Switch defaultChecked={status ? true : false} onChange={update(state._id)} checkedChildren="售卖中" unCheckedChildren="已下架" />
            }
        },
        {
            title: '操作', width: 260, align: 'center', ellipsis: true, fixed: 'right',
            render: (state) => {
                return (
                    <div>
                        <Button type="primary" onClick={() => {
                            push({ pathname: '/shopping/update', state: { ...state } })
                        }}>修改</Button>
                        <Button type="link" onClick={() => { setContent(state.detail); setDetail(true); }}>详情</Button>
                        <Button type="danger" onClick={() => { showDelConfirm(state) }}>删除</Button>
                    </div >
                )
            }
        },
    ];

    // 请求商品数据
    function getData({ type = 'name', value = '', pageNum = 1, pageSize = 5 }) {
        return new Promise((res, rej) => {
            setSearchLoading(true);
            axios.get('/product/list',
                {
                    params: { type, productValue: value, pageSize, pageNum }, cancelToken: new axios.CancelToken(function executor(c) {
                        cancel = c;
                    })
                }
            ).then(({ data: { status, meta: { msg, data, total, pageNum, pageSize } } }) => {
                setSearchLoading(false);
                // 数据请求异常
                if (status) return rej(msg);
                // 数据请求成功
                res(msg);
                setPageNum(pageNum);
                setPageSize(pageSize);
                setShopData(data);
                setTotal(total);
            }).catch(err => {
                if (!axios.isCancel(err)) {
                    setSearchLoading(false);
                    console.log('获取商品信息错误：', err);
                    rej(err.message);
                }
            })
        })
    }

    // 显示删除商品的确认模态框
    function showDelConfirm(state) {
        Modal.confirm({
            title: `确认要删除【${state.name}】商品么`,
            okText: "确认", cancelText: "取消",
            cancelButtonProps: { type: "danger" },
            onOk: dc(state)
        });
    }

    // 删除此商品
    function dc(state) {
        return () => {
            return new Promise((res, rej) => {
                axios.delete('/product/delete', {
                    params: { id: state._id }
                }).then(({ data: { status, meta: { msg } } }) => {
                    if (status) {
                        message.warn(msg);
                        return rej();
                    }
                    message.success(msg);
                    getData({ pageNum, pageSize });
                    res();
                }).catch(err => {
                    message.error(err.message);
                    rej();
                });
            })
        }
    }

    // 修改商品售卖状态
    function update(id) {
        return (c) => {
            let status = c ? 1 : 0;
            axios.put('/product/update', { id, status }).then(({
                data: { status, meta: { msg, data } }
            }) => {
                if (status) message.warn(msg);
            }).catch(err => {
                console.log('修改售卖状态失败: ', err);
                message.error(err.message);
            });
        }
    }

    function onShowSizeChange(pageNum, pageSize) {
        getData({ pageNum, pageSize });
    }

    function changePage(pageNum, pageSize) {
        getData({ pageNum, pageSize });
    }


    useEffect(() => {
        getData({});
        return () => {
            cancel('Operation canceled by the user.');
        }
    }, [])

    return (
        <div style={{ height: '100%' }}>
            <Card style={{ height: '100%', padding: '40px' }}
                title={<Search data={(type, value) => {
                    getData({ type, value }).then(msg => message.success(msg)).catch(err => message.error(err));
                }} searchLoading={searchLoading} />}
                extra={<Link to="/shopping/add">
                    <Button type="primary" icon={<PlusOutlined />}>添加商品</Button>
                </Link>}>

                <Table
                    pagination={{
                        pageSizeOptions: [5, 10, 15],
                        pageSize: parseInt(pageSize),
                        current: parseInt(pageNum),
                        showSizeChanger: true,
                        onChange: changePage,
                        total: total,
                        onShowSizeChange: onShowSizeChange
                    }}
                    scroll={{ x: 900 }}
                    bordered rowKey="goodName"
                    loading={searchLoading}
                    dataSource={shopData}
                    columns={columns} rowKey="_id" />

            </Card>
            <Modal
                visible={detail} title="查看详情"
                onCancel={() => { setDetail(false) }}
                cancelText="取消" okText="确定"
                onOk={() => { setDetail(false) }}
            >
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Modal>
        </div >
    )
}

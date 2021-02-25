import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Search from './Search'
import { Card, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function Index() {
    const [shopData, setShopData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const columns = [];

    function getData(cb) {
        setSearchLoading(true);
        cb().then(({ msg, data }) => {
            setSearchLoading(false);
            if (data) {
                message.success(msg);
                return setShopData(data);
            }
            message.warn(msg);
        }).catch(err => message.error(err));
    }
    return (
        <div style={{ height: '100%' }}>
            <Card style={{ height: '100%', padding: '40px' }}
                title={<Search data={getData} searchLoading={searchLoading} />}
                extra={<Link to="/shopping/addAndUpdate">
                    <Button type="primary" icon={<PlusOutlined />}>添加商品</Button>
                </Link>}>

                <Table
                    bordered
                    loading={searchLoading}
                    dataSource={shopData}
                    columns={columns} />
            </Card>
        </div >
    )
}

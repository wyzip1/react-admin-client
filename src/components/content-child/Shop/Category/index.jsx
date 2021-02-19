import React, { useState } from 'react'
import { Card, Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

export default function Index() {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const addCategory = () => {
        setConfirmLoading(true);
        // setTimeout(() => {
        //     setConfirmLoading(false);
        //     setVisible(false);
        // }, 300);
    }
    const finish = (values) => {
        console.log(values);
    }
    return (
        <div style={{ height: '100%' }}>
            <Card
                style={{ height: '100%', padding: '40px' }}
                title="Default size card"
                extra={<Button
                    onClick={() => setVisible(true)}
                    type="primary"
                    icon={<PlusOutlined />}>添加</Button>} >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
            <Modal
                visible={visible} onCancel={() => setVisible(false)}
                confirmLoading={confirmLoading} maskClosable={false}
                cancelText="取消" onOk={addCategory}
                okText="添加" title="添加品类">
                <Form onFinish={finish}>
                    <Form.Item name="categoryName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

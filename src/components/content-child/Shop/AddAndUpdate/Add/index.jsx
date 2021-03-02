import React, { Component, createRef } from 'react'
import { Card, Button, Form, Input, Cascader, message, Upload, Spin } from 'antd'
import RichTextEditor from '../RichTextEditor'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

export default class AddAndUpdate extends Component {
    state = {
        options: [],
        fileList: [],
        content: '',
        submitLoading: false,
        checkValue: [],
        form: createRef(),
        richTextEditor: createRef()
    }

    getOptions = () => {
        axios.get('/category/tree').then(({ data: { status, meta: { msg, data } } }) => {
            if (status) return;
            this.setState({ options: data });
        }).catch(err => {
            if (axios.isCancel(err)) console.log('Request canceled', err.message);
            else {
                console.log('获取分类列表错误：', err);
                message.error(err.message);
            }
        });
    }

    changeSelect = (value) => {
        this.setState({ checkValue: value });
    }

    componentDidMount() {
        this.getOptions();
    }

    changeImg = ({ file, fileList }) => {
        const allow = ['image/jpeg', 'image/png'];
        if (allow.includes(file.type)) this.setState({ fileList });
        else message.warn('请选择 jpg/png 格式的文件');
    }

    getContent = content => {
        this.setState({ content })
    }

    submit = async ({ goodsName, goodsDesc, goodsPrice }) => {
        const dataUrlToBlob = (dataurl) => {
            let arr = dataurl.split(',')
            let data = window.atob(arr[1])
            let mime = arr[0].match(/:(.*?);/)[1]
            let ia = new Uint8Array(data.length)
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i)
            }
            return new Blob([ia], { type: mime })
        }
        try {
            const { content, fileList, checkValue } = this.state;
            this.setState({ submitLoading: true });
            const uploadImgs = [];
            for (let i of fileList) {
                let formData = new FormData();
                formData.append('avatar', dataUrlToBlob(i.thumbUrl), i.name);
                let data = await axios.post('/uploadImg', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                uploadImgs.push(data.data);
            }
            const { data: { status, meta: { msg } } } = await axios.post('/product/add', {
                categoryList: checkValue,
                name: goodsName, desc: goodsDesc,
                price: goodsPrice, detail: content,
                imgs: uploadImgs
            })
            this.setState({ submitLoading: false });

            if (status) return message.warn(msg);
            this.state.form.current.resetFields();
            this.state.richTextEditor.current.onEmptyEditor();
            this.setState({ fileList: [], checkValue: [] });
            message.success(msg);

        } catch (err) {
            this.setState({ submitLoading: false });
            console.log('数据上传出错: ', err);
            message.error(err.message);
        }

    }



    render() {
        const { options, fileList, submitLoading, checkValue, richTextEditor } = this.state;
        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <Spin spinning={submitLoading} size="large">
                <Card style={{ height: '100%' }} title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button icon={<ArrowLeftOutlined />} type="link" onClick={() => {
                            this.props.history.replace('/shopping/goods')
                        }}></Button> 添加商品
                </div>
                }>
                    <Form onFinish={this.submit} ref={this.state.form}>
                        <Form.Item label="商品名称" {...layout} name="goodsName"
                            rules={[{ required: true, message: '请输入商品名称' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="商品描述" {...layout} name="goodsDesc">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="商品价格" {...layout} name="goodsPrice"
                            rules={[{ required: true, message: '请输入商品价格' }]}>
                            <Input type="number" addonAfter="元" />
                        </Form.Item>
                        <Form.Item label="商品分类" {...layout} name="goodsCategoryList"
                            rules={[{ required: true, message: '请选择商品分类' }]}>
                            <Cascader
                                fieldNames={{ label: 'name', value: '_id' }}
                                expandTrigger="hover" onChange={this.changeSelect}
                                placeholder="请选择"
                                options={options} value={checkValue} />
                        </Form.Item>
                        <Form.Item label="商品图片" labelCol={{ span: 2 }} wrapperCol={{ span: 14 }}>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                fileList={fileList}
                                showUploadList={true}
                                headers={{ authorization: sessionStorage.getItem('token') }}
                                action="/manager/uploadImg"
                                onChange={this.changeImg}
                                beforeUpload={() => false}
                            >
                                {fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 14 }}>
                            <RichTextEditor ref={richTextEditor} getContent={this.getContent} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 2, span: 14 }}>
                            <Button loading={submitLoading} block type="primary" htmlType="submit" size="middle">提交</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Spin>
        )
    }
}

import React, { Component } from 'react'
import { Card, Button, Form, Input, Cascader, message, Upload, Spin } from 'antd'
import RichTextEditor from '../RichTextEditor'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

export default class AddAndUpdate extends Component {


    constructor(props) {
        super(props);
        const { imgs, detail, categoryList }
            = this.props.location.state;
        this.state = {
            options: [],
            fileList: imgs.map(item => {
                item.url = '/upload/' + item.restName;
                return item;
            }),
            checkValue: categoryList,
            content: detail,
            submitLoading: false,
        }
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
        this.setState({ checkValue: value }, () => { console.log(this.state.checkValue) });
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
            const hasFile = fileList.filter(item => item.restName);
            const addFile = fileList.filter(item => !item.restName);
            for (let i of addFile) {
                let formData = new FormData();
                formData.append('avatar', dataUrlToBlob(i.thumbUrl), i.name);
                let data = await axios.post('/uploadImg', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                uploadImgs.push(data.data);
            }
            const { data: { status, meta: { msg } } } = await axios.put('/product/update', {
                name: goodsName, desc: goodsDesc, price: goodsPrice, id: this.props.location.state._id,
                categoryList: checkValue, detail: content, imgs: [...hasFile, ...uploadImgs]
            });
            this.setState({ submitLoading: false });
            if (status) return message.warn(msg);
            message.success(msg);
            this.props.history.replace('/shopping/goods');
        } catch (err) {
            this.setState({ submitLoading: false });
            console.log('数据修改出错: ', err);
            message.error(err.message);
        }
    }



    render() {
        const { options, fileList, submitLoading, checkValue, content } = this.state;
        const { name, desc, price } = this.props.location.state;
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
                        }}></Button> 修改商品信息
                </div>
                }>
                    <Form
                        onFinish={this.submit} ref={this.state.form}
                        initialValues={{ goodsName: name, goodsDesc: desc, goodsPrice: price }}>
                        <Form.Item label="商品名称" {...layout} name="goodsName">
                            <Input />
                        </Form.Item>
                        <Form.Item label="商品描述" {...layout} name="goodsDesc">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="商品价格" {...layout} name="goodsPrice">
                            <Input type="number" addonAfter="元" />
                        </Form.Item>
                        <Form.Item label="商品分类" {...layout}>
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
                            <RichTextEditor content={content} getContent={this.getContent} />
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

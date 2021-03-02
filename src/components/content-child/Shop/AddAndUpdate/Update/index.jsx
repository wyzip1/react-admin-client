import React, { Component } from 'react'
import { Card, Button, Form, Input, Cascader, message, Upload, Spin, Modal } from 'antd'
import RichTextEditor from '../RichTextEditor'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

function getBase64(file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => res(reader.result);
        reader.onerror = err => rej(err);
    })
}

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

export default class AddAndUpdate extends Component {
    constructor(props) {
        super(props);
        const { imgs, detail, categoryList }
            = this.props.location.state;
        const fileList = imgs.map(item => {
            item.url = '/upload/' + item.restName;
            item.uid = item.restName;
            return item;
        });
        this.state = {
            options: [], fileList,
            checkValue: categoryList,
            content: detail,
            removeFileList: [],
            submitLoading: false,
            previewImg: '',
            previewVisible: false,
            previewTitle: ''
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
        if (allow.includes(file.type) || file.restName) this.setState({ fileList });
        else message.warn('请选择 jpg/png 格式的文件');
    }

    onPreview = async file => {
        let previewImg, previewTitle;
        if (file.restName) {
            previewTitle = file.restName;
            previewImg = '/upload/' + file.restName;

        } else {
            if (!file.preview)
                file.preview = await getBase64(file.originFileObj);
            previewTitle = file.name;
            previewImg = file.preview;
        }
        this.setState({ previewImg, previewTitle, previewVisible: true });

    }

    onRemove = async file => {
        if (file.restName) {
            this.setState(state => ({ removeFileList: [...state.removeFileList, file.restName] }))
        }
        return true;
    }

    getContent = content => {
        this.setState({ content })
    }

    submit = async ({ goodsName, goodsDesc, goodsPrice }) => {
        try {
            const { content, fileList, checkValue, removeFileList } = this.state;
            this.setState({ submitLoading: true });
            // 存储所有选中的图片信息
            const uploadImgs = [];
            // 过滤出已经上传的图片
            const hasFile = fileList.filter(item => item.restName);
            // 过滤出需要上传的图片
            const addFile = fileList.filter(item => !item.restName);
            // 上传新图片
            for (let i of addFile) {
                let formData = new FormData();
                formData.append('avatar', dataUrlToBlob(await getBase64(i.originFileObj)), i.name);
                let data = await axios.post('/uploadImg', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                uploadImgs.push(data.data);
            }
            // 删除已经上传但是又被移除的图片
            for (let i of removeFileList) {
                await axios.delete('/delete_img', { params: { fileName: i } });
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
        const {
            options, fileList, submitLoading,
            checkValue, content, previewImg,
            previewTitle, previewVisible
        } = this.state;
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
                        <Form.Item label="商品分类" {...layout}
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
                                onChange={this.changeImg}
                                beforeUpload={() => false}
                                onPreview={this.onPreview}
                                onRemove={this.onRemove}
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
                <Modal footer={null} visible={previewVisible} title={previewTitle} onCancel={() => { this.setState({ previewVisible: false }) }}>
                    <img src={previewImg} style={{ width: '100%' }} alt="example" />
                </Modal>
            </Spin>
        )
    }
}

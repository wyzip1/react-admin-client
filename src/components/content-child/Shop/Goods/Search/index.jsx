import React, { Component } from 'react'
import { Button, Select, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import axios from 'axios'

export default class Search extends Component {
    state = {
        value: '',
    }

    changeValue = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }

    getData = () => {
        this.props.data(function () {
            return new Promise((res, rej) => {
                axios.get('/product/list').then((
                    { data: { meta: { msg, data } } }
                ) => res({ msg, data })
                ).catch(err => rej(err.message));
            })
        });
    }

    render() {
        return (
            <div style={{ width: '400px', display: 'flex', justifyContent: 'space-between' }}>
                <Select defaultValue="name">
                    <Select.Option value="name">按名称搜索</Select.Option>
                    <Select.Option value="describe">按描述搜索</Select.Option>
                </Select>
                <Input style={{ margin: '0 12px' }} onBlur={this.changeValue} placeholder="关键字" />
                <Button type="primary" loading={this.props.searchLoading} icon={<SearchOutlined />} onClick={this.getData}>搜索</Button>

            </div>
        )
    }
}

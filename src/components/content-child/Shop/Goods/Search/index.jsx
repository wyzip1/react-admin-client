import React, { Component } from 'react'
import { Button, Select, Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default class Search extends Component {
    state = {
        value: '',
        type: 'name'
    }

    changeValue = (e) => {
        const value = e.target.value.trim();
        this.setState({ value });
    }

    changeType = (e) => this.setState({ type: e })

    getData = () => {
        const { value, type } = this.state;
        this.props.data(type, value);
    }

    componentDidMount() {
        // this.getData();
    }

    render() {
        return (
            <div style={{ width: '400px', display: 'flex', justifyContent: 'space-between' }}>
                <Select defaultValue={this.state.type} onChange={this.changeType}>
                    <Select.Option value="name">按名称搜索</Select.Option>
                    <Select.Option value="desc">按描述搜索</Select.Option>
                </Select>
                <Input style={{ margin: '0 12px' }} onBlur={this.changeValue} placeholder="关键字" />
                <Button type="primary" loading={this.props.searchLoading} icon={<SearchOutlined />} onClick={this.getData}>搜索</Button>
            </div>
        )
    }
}

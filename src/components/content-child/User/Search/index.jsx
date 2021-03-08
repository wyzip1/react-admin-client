import React, { Component } from 'react'
import { Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default class Search extends Component {
    search = (username) => {
        this.props.getData({ username }).then(msg => message.success(msg)).catch(err => message.error(err));
    }

    render() {
        const { search } = this;
        const { loading } = this.props;
        return (
            <div style={{ width: '300px' }}>
                <Input.Search placeholder="请输入用户名称" allowClear enterButton={<span>
                    <SearchOutlined /> 搜索
                </span>} loading={loading} onSearch={search}></Input.Search>
            </div>
        )
    }
}

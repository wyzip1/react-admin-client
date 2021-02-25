import { Breadcrumb } from 'antd'
import React from 'react'

export default function index({ list, changeList }) {
    function tonow(name, _id) {
        return () => {
            let toSelf = [];
            for (let i of list) {
                toSelf.push(i);
                if (i.name === name) break;
            }
            changeList(_id, toSelf);
        }
    }
    return (
        <Breadcrumb>
            <Breadcrumb.Item onClick={() => { if (list.length) changeList('0', []) }}>
                {list.length ? <a>一级分类</a> : '一级分类'}
            </Breadcrumb.Item>
            {list.map(({ name, _id }, index) => {
                return <Breadcrumb.Item key={_id}>
                    {index === list.length - 1 ? name : <a onClick={tonow(name, _id)}>{name}</a>}
                </Breadcrumb.Item>
            })}
        </Breadcrumb>
    )
}

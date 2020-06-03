/** 页面选择组件  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';
import LocationSelect from "./LocationSelect";

const Option = Select.Option;

class PageSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '0'
            }, {
                title: '首页',
                value: '1'
            }, {
                title: '启动页',
                value: '2'
            }, {
                title: '我的页面',
                value: '3'
            }, {
                title: '商品详情页',
                value: '4'
            }, {
                title: '悬浮窗',
                value: '5'
            }, {
                title: '我的收益页',
                value: '6'
            }, {
                title: '查看物流页',
                value: '7'
            },
            {
                title: '我的粉丝',
                value: '8'
            },
            {
                title: '搜索页',
                value: '9'
            },
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getShowPlace(val)
    }

    render() {
        return (
            <Select defaultValue={this.props.defaultValue} placeholder="请选择页面" style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}

PageSelect.propTypes = {
    width: PropTypes.number,
    getShowPlace: PropTypes.func
}
PageSelect.defaultProps = {
    width: 262,
    defaultValue: '0'
}
export default PageSelect;


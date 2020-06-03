/** 资源位选择组件  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';
import PageSelect from "./PageSelect";

const Option = Select.Option;

class ResourceSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: 'all'
            }, {
                title: 'banner页',
                value: 'banner'
            }, {
                title: '十大入口',
                value: 'entrance'
            }, {
                title: '邮票位',
                value: 'topResource'
            }, {
                title: '商品详情资源位',
                value: 'detailResource'
            }, {
                title: '收益页资源位',
                value: 'profit'
            }, {
                title: '我的资源位',
                value: 'personal'
            }, {
                title: '启动页',
                value: 'screenAd'
            }, {
                title: '悬浮窗',
                value: 'suspension'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getResourceType(val)
    }

    render() {
        return (
            <Select defaultValue='all'  style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}
ResourceSelect.propTypes = {
    width: PropTypes.number,
    getResourceType: PropTypes.func
}
ResourceSelect.defaultProps = {
    width: 262
}
export default ResourceSelect;


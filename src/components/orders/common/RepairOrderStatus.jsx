/** 补单状态  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';
const Option = Select.Option;

class OrderStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '-1'
            }, {
                title: '未处理',
                value: '0'
            }, {
                title: '补单成功',
                value: '1'
            }, {
                title: '未找到',
                value: '2'
            }, {
                title: '补单失败',
                value: '3'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getStatus(val)
    }

    render() {
        return (
            <Select defaultValue='-1'  style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}
OrderStatus.propTypes = {
    width: PropTypes.number,
    getStatus: PropTypes.func
}
OrderStatus.defaultProps = {
    width: 262
}
export default OrderStatus;


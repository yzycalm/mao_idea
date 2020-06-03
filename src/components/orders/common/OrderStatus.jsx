/** 订单状态  */

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
                value: '0'
            }, {
                title: '待结算',
                value: '1'
            }, {
                title: '已结算',
                value: '2'
            }, {
                title: '已失效',
                value: '3'
            }, {
                title: '维权中',
                value: '4'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getStatus(val)
    }

    render() {
        return (
            <Select defaultValue='0'  style={{width: this.props.width}}
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


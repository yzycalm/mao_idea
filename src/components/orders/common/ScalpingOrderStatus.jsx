/** 自营商品订单状态  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';
const Option = Select.Option;

class ScalpingOrderStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: ''
            }, {
                title: '未支付',
                value: '0'
            }, {
                title: '已支付',
                value: '1'
            }, {
                title: '已退款',
                value: '2'
            }, {
                title: '已发货',
                value: '3'
            },{
                title: '已完成',
                value: '4'
            }, {
                title: '已失效',
                value: '5'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getStatus(val)
    }

    render() {
        return (
            <Select defaultValue=''  style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}
ScalpingOrderStatus.propTypes = {
    width: PropTypes.number,
    getStatus: PropTypes.func
}
ScalpingOrderStatus.defaultProps = {
    width: 262
}
export default ScalpingOrderStatus;


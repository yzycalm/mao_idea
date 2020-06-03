/** 平台  */

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
                title: '淘宝',
                value: '2'
            }, {
                title: '京东',
                value: '3'
            }, {
                title: '唯品会',
                value: '4'
            }, {
                title: '拼多多',
                value: '7'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getPlatform(val)
    }

    render() {
        return (
            <Select defaultValue='0' style={{width: this.props.width}}
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


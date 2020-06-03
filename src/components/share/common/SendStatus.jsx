/** 分享管理发送状态  */

import React, {Component} from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types'
import {Select} from 'antd';
import {showConfirm} from "../../../utils"

const Option = Select.Option;

class SendStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '0'
            }, {
                title: '已发送',
                value: '1'
            }, {
                title: '待发送',
                value: '2'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getStatus(val)
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

SendStatus.propTypes = {
    width: PropTypes.number,
    getStatus: PropTypes.func
}
SendStatus.defaultProps = {
    width: 262
}
export default SendStatus;

export const showStopOrDelete = (text, record, callback) => {
    showConfirm(text, () => {
        callback()
    })
}



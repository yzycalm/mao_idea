/** 底部消息条状态选择组件  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';
import ResourceSelect from "./ResourceSelect";

const Option = Select.Option;

class StatusSelectBottom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '-1'
            }, {
                title: '展示中',
                value: '0'
            }, {
                title: '未开始',
                value: '1'
            }, {
                title: '已停止',
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
            <Select defaultValue="-1"  style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}
StatusSelectBottom.propTypes = {
    width: PropTypes.number,
    getStatus: PropTypes.func
}
StatusSelectBottom.defaultProps = {
    width: 262,
    defaultValue: '0'
}
export default StatusSelectBottom;


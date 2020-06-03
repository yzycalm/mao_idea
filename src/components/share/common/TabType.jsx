/** 分享管理素材类型  */

import React, {Component} from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types'
import {Select} from 'antd';
import {showConfirm} from "../../../utils"

const Option = Select.Option;

class TabType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '0'
            }, {
                title: '早安签到',
                value: '1'
            }, {
                title: '公司实力',
                value: '2'
            }, {
                title: '红人说',
                value: '3'
            }, {
                title: '红人公益',
                value: '4'
            }, {
                title: '热门活动',
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
            <Select defaultValue='0' style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}

TabType.propTypes = {
    width: PropTypes.number,
    getStatus: PropTypes.func
}
TabType.defaultProps = {
    width: 262
}
export default TabType;

export const showStopOrDelete = (text, record, callback) => {
    showConfirm(text, () => {
        callback()
    })
}



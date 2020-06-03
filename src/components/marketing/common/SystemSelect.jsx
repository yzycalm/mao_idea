/** 系统选择组件  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';
import StatusSelect from "./StatusSelect";

const Option = Select.Option;

class SystemSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '-1'
            }, {
                title: 'ios',
                value: '2'
            }, {
                title: '安卓',
                value: '1'
            }]
        };
    }

    handleSelectPage(val) {
        this.props.getSystem(val)
    }

    render() {
        return (
            <Select defaultValue={this.props.defaultValue}   style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}
SystemSelect.propTypes = {
    width: PropTypes.number,
    getSystem: PropTypes.func
}
SystemSelect.defaultProps = {
    width: 262,
    defaultValue: "-1"
}
export default SystemSelect;


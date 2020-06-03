/** 位置选择组件  */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';

const Option = Select.Option;

class LocationSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '全部',
                value: '0'
            }, {
                title: '搜索栏搜索',
                value: '1'
            }, {
                title: '大家正在搜',
                value: '2'
            }
            ]
        };
    }

    handleSelectPage(val) {
        this.props.getLocation(val)
    }
    render() {
        return (
            <Select defaultValue={this.props.defaultValue} style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}

LocationSelect.propTypes = {
    width: PropTypes.number,
    getLocation: PropTypes.func
}
LocationSelect.defaultProps = {
    width: 262,
    defaultValue: '0'
}
export default LocationSelect;


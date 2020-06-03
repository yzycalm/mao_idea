/** 商品发布状态  */

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Select} from 'antd';

const Option = Select.Option;

class GoodsStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: []
        };
    }
    componentDidMount() {
       const goodsType =  this.props.goodsType
        //  0 :运营商品 , 1 : 招商商品，2：精选商品, 3:自营商品
        switch (goodsType) {
            case 0:
                this.setState({
                    option: [{
                        title: '全部',
                        value: '0'
                    }, {
                        title: '待审核',
                        value: '1'
                    }, {
                        title: '不通过',
                        value: '2'
                    }, {
                        title: '已上架',
                        value: '3'
                    }, {
                        title: '已下架',
                        value: '4'
                    }, {
                        title: '草稿',
                        value: '6'
                    }, {
                        title: '待上架',
                        value: '7'
                    }
                    ]
                })
                break
            case 1:
            case 2:
                this.setState({
                    option: [{
                        title: '全部',
                        value: '0'
                    }, {
                        title: '待审核',
                        value: '1'
                    }, {
                        title: '不通过',
                        value: '2'
                    }, {
                        title: '已上架',
                        value: '3'
                    }, {
                        title: '已下架',
                        value: '4'
                    }, {
                        title: '已结算',
                        value: '5'
                    }, {
                        title: '草稿',
                        value: '6'
                    }, {
                        title: '待上架',
                        value: '7'
                    }
                    ]
                })
                break
            case 3:
                this.setState({
                    option: [{
                        title: '全部',
                        value: '0'
                    }, {
                        title: '已上架',
                        value: '1'
                    }, {
                        title: '已下架',
                        value: '2'
                    }]
                })
                break
            case 4:
                this.setState({
                option: [{
                    title: '全部',
                    value: '6'
                }, {
                    title: '已上架',
                    value: '2'
                }, {
                    title: '已下架',
                    value: '3'
                }]
            })
                break
            default:
                this.setState({
                    option: [{
                        title: '全部',
                        value: '0'
                    }, {
                        title: '待审核',
                        value: '1'
                    }, {
                        title: '不通过',
                        value: '2'
                    }, {
                        title: '已上架',
                        value: '3'
                    }, {
                        title: '已下架',
                        value: '4'
                    }, {
                        title: '已结算',
                        value: '5'
                    }, {
                        title: '草稿',
                        value: '6'
                    }, {
                        title: '待上架',
                        value: '7'
                    }
                    ]
                })
        }
    }

    handleSelectPage(val) {
        this.props.getStatus(val)
    }

    render() {
        return (
            <Select defaultValue={this.props.defaultValue + ''} style={{width: this.props.width}}
                    onChange={this.handleSelectPage.bind(this)}>
                {this.state.option.map(item => {
                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                })}
            </Select>
        )
    }
}

GoodsStatus.propTypes = {
    defaultValue: PropTypes.number,
    width: PropTypes.number,
    getStatus: PropTypes.func,
    goodsType: PropTypes.number
}
GoodsStatus.defaultProps = {
    width: 262,
    defaultValue: 0
}
export default GoodsStatus;


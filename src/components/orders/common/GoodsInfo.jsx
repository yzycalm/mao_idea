/** 商品信息信息  */
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Card, Checkbox} from 'antd';
import {findBackOrder} from '../../../api/orders/orderList'
import LocationSelect from "../../marketing/common/LocationSelect";

class GoodsInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                subOrderNo: []
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        const that = this
        if (that.props.params !== nextProps.params) {
            if (nextProps.params.orderNo && nextProps.params.platform) {
                this.getStoreDetail(nextProps)
            }
        }
    }

    getStoreDetail(nextProps) {
        const {...params} = nextProps.params
        delete params.type
        findBackOrder(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    data: data
                })
                this.props.getStoreInfo(data)
            }
        })
    }

    componentWillUnmount() {
    }

    // 判断补单状态
    getOrderStatus(val) {
        let tipText = '未找到该笔订单'
        console.log(val);
        if (val.subOrderNo.length > 0) {
            if (val.accountId) {
                tipText = `该订单已归属 会员 ID：${val.accountId}`
            } else {
                tipText = '' }
        } else {
            tipText = '未找到该笔订单'
        }
        return tipText
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };
        const data = this.state.data
        return (
            <Card style={{backgroundColor: '#F0F2F5'}}>
                <Form labelAlign={'left'} {...formItemLayout}>
                    <Form.Item label="商品名称">
                        <span>{data.productTitle}</span>
                    </Form.Item>
                    <Form.Item label="订单金额:">
                        <span>{data.totalPrice ? data.totalPrice + '元' : ''}</span>
                    </Form.Item>
                    <Form.Item label="下单时间:">
                        <span>{data.buildTime}</span>
                    </Form.Item>
                    <Form.Item label="父订单编码:">
                        <Checkbox style={{display: data.parentOrderNo ? 'block' : 'none'}} value={data.parentOrderNo}
                                  checked>{data.parentOrderNo}</Checkbox>
                    </Form.Item>
                    <Form.Item label="子订单编码:">
                        {
                            data.subOrderNo.map((item, index) => {
                                return <Checkbox key={item + index} value={item} checked>{item}</Checkbox>
                            })
                        }
                    </Form.Item>
                </Form>
                <p style={{color: 'red'}}>{this.getOrderStatus(data)}</p>
            </Card>
        )
    }
}

GoodsInfo.propTypes = {
    params: PropTypes.object,
    getStoreInfo: PropTypes.func
}
LocationSelect.defaultProps = {
    params: {}
}
export default GoodsInfo;

/** 商品信息  */
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Card} from 'antd';
import {doItemAnalyze} from '../../../api/commondity/attract'

class StoreInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                imgs: []
            }
        };
    }
    componentWillReceiveProps(nextProps) {
        const that = this
        if (that.props.params !== nextProps.params ) {
            if(nextProps.params.platform || nextProps.params.productId) {
                this.getStoreDetail(nextProps)
            }
        }
    }
    getStoreDetail(nextProps) {
        const {...params} = nextProps.params
        delete  params.type
        doItemAnalyze(params).then((res) => {
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
    render() {
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
            <Card style={{backgroundColor: '#F0F2F5'}}>
                <Form labelAlign={'left'} {...formItemLayout}>
                    <Form.Item label="商品名称:">
                        <span>{this.state.data.productName}</span>
                    </Form.Item>
                    <Form.Item label="券后价">
                           <span>{this.state.data.zkFinalPrice ? this.state.data.zkFinalPrice + '元' : ''}</span>
                    </Form.Item>
                    <Form.Item label="优惠券金额：">
                           <span>{this.state.data.couponPrice || +this.state.data.couponPrice === 0 ? this.state.data.couponPrice + '元' : ''}</span>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

StoreInfo.propTypes = {
    params: PropTypes.object,
    getStoreInfo: PropTypes.func
}
export default StoreInfo;

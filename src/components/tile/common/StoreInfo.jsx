/** 店铺信息  */
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Col, Card, Popover} from 'antd';
import {doItemAnalyze} from '../../../api/commondity/attract'
import {format} from '../../../utils/index'
import LocationSelect from "../../marketing/common/LocationSelect";

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
        if (that.props.params !== nextProps.params && nextProps.params.gsId) {
            nextProps.params.productId = nextProps.params.gsId
            nextProps.params.platform = 2
            this.getStoreDetail(nextProps)
        }
    }

    getStoreDetail(nextProps) {
        const {...params} = nextProps.params
        delete params.type
        doItemAnalyze(params).then((res) => {
            if (res && res.success) {
                let data = res.data
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
            labelCol: {span: 4},
            wrapperCol: {span: 20},
        };
        return (
            <Card style={{backgroundColor: '#F0F2F5'}}>
                <Form labelAlign={'left'} {...formItemLayout}>
                    <Form.Item label="店铺名称">
                        <span>{this.state.data.shopName}</span>
                    </Form.Item>
                    <Form.Item label="商品名称:">
                        <span>{this.state.data.productName}</span>
                    </Form.Item>
                    <Form.Item label="商品主图">
                        <div>
                            {
                                this.state.data.imgs.map((item, index) => {
                                    const content = <img
                                        style={{width: '500px', height: '400px', objectFit: 'contain'}} src={item}
                                        alt="图片"
                                                    />
                                    return <Popover content={content} key={item + index}>
                                        <img style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'contain',
                                            margin: '0 10px 10px 0'
                                        }}
                                             src={item} alt=""
                                        />
                                    </Popover>
                                })
                            }
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Col span={5}>
                            商品原价：
                        </Col>
                        <Col span={7} style={{textAlign: 'center'}}>
                            {this.state.data.zkFinalPrice ? this.state.data.zkFinalPrice + '元' : ''}
                        </Col>
                        <Col span={5}>
                            商品现价：
                        </Col>
                        <Col span={7} style={{textAlign: 'center'}}>
                            {this.state.data.finalPrice && this.state.data.finalPrice !== 0 ? this.state.data.finalPrice + '元' : ''}
                        </Col>
                    </Form.Item>
                    <Form.Item>
                        <Col span={5}>
                            优惠券金额：
                        </Col>
                        <Col span={7} style={{textAlign: 'center'}}>
                            {this.state.data.couponPrice && this.state.data.couponPrice !== 0 ? this.state.data.couponPrice + '元' : ''}
                        </Col>
                        <Col span={5}>
                            佣金比例：
                        </Col>
                        <Col span={7} style={{textAlign: 'center'}}>
                            {this.state.data.commissionShare ? parseFloat((this.state.data.commissionShare * 100).toFixed(2)) + '%' : ''}
                        </Col>
                    </Form.Item>
                    <Form.Item label="优惠券有效期:">
                        <span> &nbsp;&nbsp;&nbsp;{this.state.data.couponStartTime ? format(this.state.data.couponStartTime) + ' - ' : ''}{this.state.data.couponEndTime ? format(this.state.data.couponEndTime) : ''}</span>
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
LocationSelect.defaultProps = {
    params: {imgs: []}
}
export default StoreInfo;

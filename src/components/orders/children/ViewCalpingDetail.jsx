/**
 * Created by smart-yc
 */
import React from 'react';
import { Card, Divider, Row, Col, Timeline, List, Button, PageHeader, Popover } from 'antd';
import { clickCancel } from "../../../utils";
import { getScalpingOrderDetail } from '../../../api/orders/orderList'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            orderStatus: [{ create_time: '创建订单' }, { pay_time: '已支付' }, { success_time: '已完成' }, { refund_time: '已退款' }]
        }
    }
    // 获取活动弹窗信息
    componentDidMount () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id }
            sessionStorage.setItem('calping', JSON.stringify(params))
            if (params.id !== undefined) {
                this.initData(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('calping'))
            if (params && params.id !== 'undefined') {
                this.initData(params.id)
            }
        }
    }

    // 数据初始化
    initData (id) {
        getScalpingOrderDetail(id).then(res => {
            if (res) {
                this.setState({
                    data: res
                })
            }
        })
    }
    // 获取订单信息
    getOrderInfo (val, item) {
        let result = ''
        switch (val) {
            case 'goods_name':
                result = `${item[val] ? item[val] : '-'}`
                break
            case 'parent_ordernum':
                result = `父订单编号：${item[val] ? item[val] : '-'}`
                break
            case 'parent_pay':
                result = `父订单金额：${item[val] ? item[val] : '-'} 元`
                break
            case 'sub_order_num':
                result = `子订单数：${item[val] ? item[val] : '-'}`
                break
            case 'ordernum':
                result = `子订单编号：${item[val] ? item[val] : '-'}`
                break
            case 'pay':
                result = `子订单金额：${item[val] ? item[val] : '-'} 元`
                break
            case 'goods_price':
                result = `商品单价：${item[val] ? item[val] : '-'} 元`
                break
            case 'buy_num':
                result = `购买数量： ${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 获取会员信息
    getMemberInfo (val, item) {
        let result = ''
        switch (val) {
            case 'userid':
                result = `用户编号：${item[val] ? item[val] : '-'}`
                break
            case 'username':
                result = `用户昵称：${item[val] ? item[val] : '-'}`
                break
            case 'auth':
                result = `购买时的级别：${item[val] || +item[val] === 0 ? item[val] : '-'}`
                break
            case 'mobile':
                result = `红人装账号：${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 获取支付信息
    getPayInfo (val, item) {
        let result = ''
        switch (val) {
            case 'payed_at':
                result = `支付时间：${item[val] ? item[val] : '-'}`
                break
            case 'pay_way':
                result = `支付方式：${item[val] ? item[val] : '-'}`
                break
            case 'trade_no':
                result = `支付编号：${item[val] ? item[val] : '-'}`
                break
            case 'payed_money':
                result = `支付金额：${item[val] ? item[val] + '元' : '-'}`
                break
            case 'logistics_remark':
                result = `备注：${item[val] ? item[val] : '无'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 获取退款信息
    getRefundInfo (val, item) {
        let result = ''
        switch (val) {
            case 'refund_time':
                result = `退款时间：${item[val] ? item[val] : '-'}`
                break
            case 'refund_money':
                result = `退款金额：${item[val] ? item[val] : '-'}`
                break
            case 'refund_reason':
                result = `退款原因：${item[val] ? item[val] : '-'}`
                break
            case 'refund_remark':
                result = `退款备注：${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 物流信息
    getLogisticsInfo (val, item) {
        let result = ''
        switch (val) {
            case 'com':
                result = `快递公司：${item[val] ? item[val] : '-'}`
                break
            case 'logistics':
                result = `快递单号：${item[val] ? item[val] : '-'}`
                break
            case 'delivery_time':
                result = `发货时间：${item[val] ? item[val] : '-'}`
                break
            case 'logistic_fee':
                result = `附加运费：${item[val] ? item[val] : '-'} 元`
                break
            case 'consignee':
                result = `收件人：${item[val] ? item[val] : '-'}`
                break
            case 'mobile':
                result = `联系电话：${item[val] ? item[val] : '-'}`
                break
            case 'address':
                result = `收货地址：${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    getContent (url) {
        return (
            <div>
                <img src={url} alt="" />
            </div>
        )
    }
    render () {
        const listData = [];
        const { logistics_info, member_info, order_info, order_state, pay_info, refund_info, remark } = this.state.data
        if (order_info) listData.push(order_info);
        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="自营商品订单" subTitle="订单详情" />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col span={24}>
                                <section>
                                    <h3>订单状态</h3>
                                    <Divider />
                                    <Timeline>
                                        {console.log(order_state)}
                                        <Timeline.Item color={order_state && order_state.create_time ? 'green' : 'red'}>创建订单 &nbsp; {order_state ? order_state.create_time : ''}</Timeline.Item>
                                        <Timeline.Item color={order_state && order_state.pay_time ? 'green' : 'red'}>已支付 &nbsp; {order_state ? order_state.pay_time : ''}</Timeline.Item>
                                        <Timeline.Item color={order_state && order_state.success_time ? 'green' : 'red'}>已完成 &nbsp; {order_state ? order_state.success_time : ''}</Timeline.Item>
                                        <Timeline.Item color={order_state && order_state.refund_time ? 'green' : 'red'}>已退款 &nbsp; {order_state ? order_state.refund_time : ''}</Timeline.Item>
                                    </Timeline>
                                </section>
                                <section>
                                    <h3>订单信息</h3>
                                    <Divider />
                                    <Row>
                                        <Col span={18}>
                                            <List
                                                itemLayout="vertical"
                                                size="large"
                                                dataSource={listData}
                                                renderItem={item => (
                                                    <List.Item
                                                        key={item.title}
                                                        extra={
                                                            <Popover content={this.getContent(order_info.goods_thumb)}>
                                                                <img
                                                                    width={250}
                                                                    src={order_info.goods_thumb}
                                                                    alt=""
                                                                />
                                                            </Popover>
                                                        }
                                                    >
                                                        {
                                                            Object.keys(item).map((value, index) => {
                                                                return <p key={index}> {this.getOrderInfo(value, item)}</p>
                                                            })

                                                        }
                                                    </List.Item>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </section>
                                <section>
                                    <h3>会员信息</h3>
                                    <Divider />
                                    {
                                        member_info ? Object.keys(member_info).map((value, index) => {
                                            return <p key={index}>{this.getMemberInfo(value, member_info)}</p>
                                        }) : ''

                                    }
                                </section>
                                <section>
                                    <h3 style={{ marginTop: '20px' }}>支付信息</h3>
                                    <Divider />
                                    {
                                        pay_info ? Object.keys(pay_info).map((value, index) => {
                                            return <p key={index}>{this.getPayInfo(value, pay_info)}</p>
                                        }) : ""

                                    }
                                </section>
                                <section>
                                    <h3 style={{ marginTop: '20px' }}>物流信息</h3>
                                    <Divider />
                                    {
                                        logistics_info ? Object.keys(logistics_info).map((value, index) => {
                                            return <p key={index}>{this.getLogisticsInfo(value, logistics_info)}</p>
                                        }) : ''

                                    }
                                </section>
                                <section>
                                    <h3 style={{ marginTop: '20px' }}>退款信息</h3>
                                    <Divider />
                                    {
                                        refund_info ? Object.keys(refund_info).map((value, index) => {
                                            return <p key={index}>{this.getRefundInfo(value, refund_info)}</p>
                                        }) : ''

                                    }
                                </section>
                                <section>
                                    <h3 style={{ marginTop: '20px' }}>备注</h3>
                                    <Divider />
                                    <p>{remark ? remark : '暂无'}</p>
                                </section>
                            </Col>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Divider />
                                <Button type="primary" onClick={clickCancel}>确定</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Dashboard;

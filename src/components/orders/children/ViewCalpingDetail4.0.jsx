/**
 * Created by smart-yc
 */
import React from 'react';
import {Card, Divider, Row, Col, Timeline, List, Button, PageHeader,Popover} from 'antd';
import {clickCancel} from "../../../utils";
import {getScalpingOrder4, getUserLevel} from "../../../utils/order";
import {getScalpingOrderDetail4} from '../../../api/orders/orderList'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            orderStatus: [{create_time: '创建订单'},{pay_time: '已支付'},{success_time: '已完成'},{refund_time: '已退款'}]
        }
    }
    // 获取活动弹窗信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id}
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
    initData(id) {
        console.log(id)
        getScalpingOrderDetail4({subOrderNo: id}).then(res => {
            if(res && res.success) {
                console.log(res)
               this.setState({
                   data: res.data
               })
            }
        })
    }
    // 获取订单信息
    getOrderInfo(val, item) {
        let result = ''
        switch (val) {
            case 'goodsTitle':
                result = `${item[val] ? item[val] : '-'}`
                break
            case 'orderNo':
                result = `父订单编号：${item[val] ? item[val] : '-'}`
                break
            case 'totalAmount':
                result = `父订单金额：${item[val] ? item[val] + ' 元' : '-'}`
                break
            case 'orderNum':
                result = `子订单数：${item[val] ? item[val] : '-'}`
                break
            case 'subOrderNo':
                result = `子订单编号：${item[val] ? item[val] : '-'}`
                break
            case 'subOrderAmount':
                result = `子订单金额：${item[val] ? item[val] + ' 元' : '-'}`
                break
            case 'goodsPrice':
                result = `商品单价：${item[val] ? item[val] + ' 元' : '-'}`
                break
            case 'goodsNum':
                result = `购买数量： ${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 获取会员信息
    getMemberInfo(val, item) {
        let result = ''
        switch (val) {
            case 'payerId':
                result = `用户编号：${item[val] ? item[val] : '-'}`
                break
            case 'currentPayerName':
                result = `用户昵称：${item[val] ? item[val] : '-'}`
                break
            case 'currentPayerGrade':
                result = `购买时的级别：${item[val] || +item[val] === 0 ? getUserLevel(item[val]) : '-'}`
                break
            case 'currentPayerPhone':
                result = `红人装账号：${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 获取支付信息
    getPayInfo(val, item) {
        let result = ''
        switch (val) {
            case 'payTime':
                result = `支付时间：${item[val] ? item[val] : '-'}`
                break
            case 'payChannel':
                result = `支付方式：${+item[val] === 0 ? '微信' : '支付宝'}`
                break
            case 'walletCode':
                result = `支付编号：${item[val] ? item[val] : '-'}`
                break
            case 'payAmount':
                result = `支付金额：${item[val] ? item[val] + '元' : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 获取退款信息
    getRefundInfo(val, item) {
        let result = ''
        switch (val) {
            case 'createTime':
                result = `退款时间：${item[val] ? item[val] : '-'}`
                break
            case 'amount':
                result = `退款金额：${item[val] ? item[val] : '-'}`
                break
            case 'reason':
                result = `退款原因：${item[val] ? item[val] : '-'}`
                break
            case 'remark':
                result = `退款备注：${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    // 物流信息
    getLogisticsInfo(val, item) {
        let result = ''
        switch (val) {
            case 'expressFirm':
                result = `快递公司：${item[val] ? item[val] : '-'}`
                break
            case 'expressNum':
                result = `快递单号：${item[val] ? item[val] : '-'}`
                break
            case 'sendTime':
                result = `发货时间：${item[val] ? item[val] : '-'}`
                break
            case 'postage':
                result = `附加运费：${item[val] ? item[val] : '-'} 元`
                break
            case 'receiverName':
                result = `收件人：${item[val] ? item[val] : '-'}`
                break
            case 'receiverPhone':
                result = `联系电话：${item[val] ? item[val] : '-'}`
                break
            case 'receiverAddress':
                result = `收货地址：${item[val] ? item[val] : '-'}`
                break
            default:
                result = ''
                break
        }
        return result
    }
    getContent(url){ return (
        <div>
            <img src={url} alt=""/>
        </div>
    )}
    render() {
        let listData = [],statusList = [], logistics = []
        const {logisticsMsg, orderAndAccount, orderStatusList, returnMsg,walletMsg} = this.state.data
        if(orderAndAccount) listData.push(orderAndAccount);
        if(orderStatusList) statusList = orderStatusList
        if(logisticsMsg) logistics = logisticsMsg

        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="自营商品订单4.0" subTitle="订单详情" />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col span={24}>
                                <section>
                                    <h3>订单状态</h3>
                                    <Divider/>
                                    <Timeline >{
                                        statusList.map((item, index)=> {
                                            return   <Timeline.Item key={index} color={'green'}>{getScalpingOrder4(item.orderStatus)} &nbsp; {item.orderTime} </Timeline.Item>

                                        })
                                    }
                                    </Timeline>
                                </section>
                                <section>
                                    <h3>订单信息</h3>
                                    <Divider/>
                                    <Row>
                                        <Col span={18}>
                                            <List
                                                itemLayout="vertical"
                                                size="large"
                                                dataSource={listData}
                                                renderItem={(item, index) => (
                                                    <List.Item
                                                        key={index}
                                                        extra={
                                                            <Popover content={this.getContent(orderAndAccount.goodsImg)}>
                                                                <img
                                                                    width={250}
                                                                    src={orderAndAccount.goodsImg}
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
                                <Divider/>
                                {
                                    orderAndAccount ?  Object.keys(orderAndAccount).map((value, index) => {
                                        return <p key={index}>{this.getMemberInfo(value, orderAndAccount)}</p>
                                    }) : ''

                                }
                                </section>
                                <section>
                                <h3 style={{marginTop: '20px'}}>支付信息</h3>
                                <Divider/>
                                {
                                    walletMsg ? Object.keys(walletMsg).map((value, index) => {
                                        return <p key={index}>{this.getPayInfo(value, walletMsg)}</p>
                                    }) : ""

                                }
                                </section>
                                <section>
                                <h3  style={{marginTop: '20px'}}>物流信息</h3>
                                <Divider/>
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        dataSource={logistics}
                                        renderItem={(item, index) => (
                                            <List.Item key={index}>
                                                {
                                                    Object.keys(item).map((value, index) => {
                                                        return <p key={index}>{this.getLogisticsInfo(value, item)}</p>
                                                    })

                                                }
                                            </List.Item>
                                        )}
                                    />
                                </section>
                                <section>
                                <h3  style={{marginTop: '20px'}}>退款信息</h3>
                                <Divider/>
                                {
                                    returnMsg ?  Object.keys(returnMsg).map((value, index) => {
                                        return <p key={index}>{this.getRefundInfo(value, returnMsg)}</p>
                                    }) : '无'

                                }
                                </section>
                            </Col>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <Divider/>
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

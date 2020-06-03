/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Row, Col, Button,PageHeader} from 'antd';
import {bindBackOrder, modifyBackOrder} from '../../../api/orders/orderList'
import {openNotificationWithIcon, clickCancel} from "../../../utils";
import {getPlatformStatus} from "../../../utils/order";
import {GoodsInfo} from "../common";

const FormItem = Form.Item;

class PromptlyOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '立即补单',
            query: {},
            storeInfo: {},
            data: JSON.parse(sessionStorage.getItem('safeguard')),
            handleBtn: ''
        };
    }
    componentDidMount() {
        let data = Object.assign({}, this.state.query, {orderNo: this.state.data.parentOrderNo, platform: this.state.data.platform})
        this.setState({
            query: data
        })
    }
    componentWillUnmount() {
        sessionStorage.removeItem('safeguard')
    }
    getStoreInfo(val) {
        this.setState({
            storeInfo: val
        })
        if(val) {
            if (val.accountId) {
                this.setState({
                    handleBtn: <Button type="primary" onClick={this.handleModify.bind(this, 3)} >补单失败</Button>
                })
            } else {
                this.setState({
                    handleBtn: <Button type="primary" onClick={this.handleSubmit.bind(this)} >立即补单</Button>
                })
            }
        } else {
            this.setState({
                handleBtn: <Button type="primary" onClick={this.handleModify.bind(this, 2)} >未找到</Button>
            })

        }
    }
    // 提交
    handleSubmit = ( e ) => {
        e.preventDefault();
        const params = {findBackId: parseInt(this.state.data.id), updateBy: ""}
        bindBackOrder(params).then((res) => {
            if (res.success) {
                openNotificationWithIcon('success', '立即补录成功！')
                clickCancel()
            } else {
                openNotificationWithIcon('error', res.message)
            }
        })
    }
    handleModify(status) {
        const params = {
            findBackId: parseInt(this.state.data.id),
            status: status,
            updateBy: ""
        }
        modifyBackOrder(params).then(res=> {
            if(res && res.success) {
                openNotificationWithIcon('success', status === 2 ? '未找到' : '补单失败')
                clickCancel()
            } else {
                openNotificationWithIcon('error', status === 2 ? '未找到' : '补单失败')
            }
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };

        const data = this.state.data;
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="补单商品" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col span={12}>
                                <Form {...formItemLayout} labelAlign={'left'}>
                                    <FormItem label="平台">
                                        <span>{data.platform ? getPlatformStatus(data.platform) : ''} </span>
                                    </FormItem>
                                    <FormItem label="第三方订单号(父订单编码)">
                                            <span>{data.parentOrderNo}</span>
                                    </FormItem>
                                    <FormItem label="申请人昵称">
                                            <span>{data.nickName}</span>
                                    </FormItem>
                                    <FormItem label="申请人手机号">
                                        <span>{data.phone}</span>
                                    </FormItem>
                                    <FormItem label="申请人红人装ID">
                                        <span>{data.accountId}</span>
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{textAlign: 'center'}}>
                                            <Button type="primary" style={{display:JSON.stringify(this.state.storeInfo) !== "{}" && this.state.storeInfo.hasOwnProperty('accountId') && !this.state.storeInfo.accountId ? 'inline-block' : 'none'}} onClick={this.handleSubmit.bind(this)} >立即补单</Button>
                                            <Button type="primary" style={{display: JSON.stringify(this.state.storeInfo) === "{}"&& !this.state.storeInfo.hasOwnProperty('accountId') ? 'inline-block' : 'none'}} onClick={this.handleModify.bind(this, 2)} >未找到</Button>
                                            <Button type="primary" style={{display: JSON.stringify(this.state.storeInfo) !== "{}" && this.state.storeInfo.accountId ? 'inline-block' : 'none'}} onClick={this.handleModify.bind(this, 3)} >补单失败</Button>
                                            <Button type="default" onClick={clickCancel}>取消</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col span={12}>
                                <GoodsInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(PromptlyOrder);

export default BasicForm;

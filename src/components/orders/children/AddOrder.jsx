/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Button, Select,PageHeader} from 'antd';
import {addBackOrder, bindBackOrder, getInfoByPhone} from '../../../api/orders/orderList'
import {openNotificationWithIcon, clickCancel} from "../../../utils";
import {GoodsInfo} from "../common";

const FormItem = Form.Item;
const Option = Select.Option;

class AddOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '录入补单信息',
            query: {},
            storeInfo: {},
            accountID: '',
            nickName: '',
            id: ''

        };
    }

    getOrderNo(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {orderNo: value})
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, {orderNo: ""})
            this.setState({
                query: data
            })
        }
    }

    getPlatform(val) {
        let data = Object.assign({}, this.state.query, {platform: val})
        this.setState({
            query: data
        })
    }

    getStoreInfo(val) {
        this.setState({
            storeInfo: val
        })
    }

    verifyPhone(value, rule, callback) {
        if (value) {
            callback()
        } else {
            callback('请输入申请人手机号')
        }
    }

    getPhoneInfo(event) {
        const that = this
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            getInfoByPhone({phone: value}).then(res => {
                if (res && res.success) {
                    console.log(res)
                    const data = res.data
                    that.setState({
                        accountID: data.accountId,
                        nickName: data.nickName
                    })
                }
            })
        }
    }

    // 提交
    handleSubmit = (publicState, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (publicState === 1) {
                    values.accountId = this.state.accountID
                    addBackOrder(values).then((res) => {
                        if (res && res.success) {
                            this.setState({
                                id: res.data
                            })
                            openNotificationWithIcon('success', '保存订单成功！')
                        } else {
                            openNotificationWithIcon('error', '保存订单失败！')
                        }
                    })
                }
                if (publicState === 2) {
                    const params = {findBackId: this.state.id, updateBy: ""}
                    bindBackOrder(params).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', '立即补单成功！')
                            clickCancel()
                        } else {
                            openNotificationWithIcon('error', res.message)
                        }
                    })
                }
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

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

        const {getFieldDecorator} = this.props.form;
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="补单商品" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card  bordered={false}>
                        <Row>
                            <Col span={12}>
                                <Form {...formItemLayout} labelAlign={'left'}>
                                    <FormItem label="平台">
                                        {getFieldDecorator('platform', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择平台',
                                                },
                                            ],
                                        })(
                                            <Select placeholder="请选择平台" onChange={this.getPlatform.bind(this)}>
                                                <Option value={2}>淘宝</Option>
                                                <Option value={3}>京东</Option>
                                                <Option value={4}>唯品会</Option>
                                                <Option value={7}>品多多</Option>
                                            </Select>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="第三方订单号(父订单编码)">
                                        {getFieldDecorator('parentOrderNo', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入第三方订单号'
                                                },
                                            ],
                                        })(
                                            <Input onBlur={this.getOrderNo.bind(this)}/>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="申请人手机号">
                                        {getFieldDecorator('phone', {
                                            rules: [
                                                {
                                                    required: true,
                                                    validator: this.verifyPhone
                                                }
                                            ],
                                        })(
                                            <Input onBlur={this.getPhoneInfo.bind(this)}/>
                                        )}
                                        <div style={{color: 'grey', display: this.state.accountID ? 'block' : 'none'}}>
                                            <span>{this.state.accountID}&nbsp;{this.state.nickName}</span></div>
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{textAlign: 'center'}}>
                                            {console.log(this.state.id)}
                                            <Button type="primary"
                                                    style={{display: this.state.id ? 'none' : 'inline-block'}}
                                                    onClick={this.handleSubmit.bind(this, 1)}>保存</Button>
                                            <Button type="primary"
                                                    style={{display: this.state.id ? 'inline-block' : 'none'}}
                                                    onClick={this.handleSubmit.bind(this, 2)}>立即补单</Button>
                                            <Button type="default" onClick={clickCancel}>取消</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col span={12}>
                                <GoodsInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)}/>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddOrder);

export default BasicForm;

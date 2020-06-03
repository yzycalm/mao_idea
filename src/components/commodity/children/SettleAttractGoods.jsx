/**
 * Created by smart-yc
 */
import React, { Component } from 'react';
import { Card, Form, Input, Row, Col, Button, PageHeader } from 'antd';
import { closeGoods, findGoods } from '../../../api/commondity/attract'
import { openNotificationWithIcon, clickCancel, format } from "../../../utils";
import { StoreInfo } from "../common";

const FormItem = Form.Item;

class AddAttractGoods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '结算招商商品',
            query: {},
            storeInfo: {},
            unit: '请选择',
            data: {}
        };
    }

    // 获取招商商品信息
    componentDidMount () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id, title: this.props.location.query.title }
            sessionStorage.setItem('AttractGood', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '招商商品'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('AttractGood'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '招商商品'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('AttractGood')
    }

    // 获取招商商品信息
    getAdvertInfo (id) {
        const params = { id: id }
        findGoods(params).then((res) => {
            if (res.success) {
                const data = res.data
                let urlData = Object.assign({}, this.state.query, {
                    productUrl: data.productUrl,
                    couponUrl: data.couponUrl
                })
                this.setState({
                    data: data,
                    query: urlData
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    // 获取商品链接
    getGoodUrl (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { productUrl: value })
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, { productUrl: "" })
            this.setState({
                query: data
            })
        }
    }

    getCouponUrl (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { couponUrl: value })
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, { couponUrl: "" })
            this.setState({
                query: data
            })
        }
    }

    getStoreInfo (val) {
        this.setState({
            storeInfo: val
        })
    }

    getUnit (val) {
        this.setState({
            unit: val
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const bannerId = JSON.parse(sessionStorage.getItem('AttractGood'))
                values.id = ''
                values.merchantsId = ''
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                }
                let params = {}
                const { ...result } = this.state.storeInfo
                delete result.imgs
                Object.assign(params, values, result)
                closeGoods(params).then((res) => {
                    if (res.success) {
                        openNotificationWithIcon('success', '招商商品结算成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', '招商商品结算失败！')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    render () {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const { getFieldDecorator } = this.props.form;
        const data = this.state.data;
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="招商商品" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card title={this.state.title} bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form {...formItemLayout} labelAlign={'left'}>
                                    <FormItem label="服务费结算销量">
                                        {getFieldDecorator('serviceFeeSettleVolume', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入服务费结算销量',
                                                },
                                            ],
                                        })(
                                            <Input addonAfter="件" />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="服务费结算金额">
                                        {getFieldDecorator('serviceFeeSettleAmount', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入服务费结算金额',
                                                },
                                            ],
                                        })(
                                            <Input addonAfter="元" />
                                        )
                                        }
                                    </FormItem>
                                </Form>
                                <Card bordered style={{ backgroundColor: '#F0F2F5' }}>
                                    <Form {...formItemLayout} labelAlign={'left'}>
                                        <FormItem label="商品链接">
                                            <span>{data.productUrl ? data.productUrl : ''}</span>
                                        </FormItem>
                                        <FormItem label="优惠券链接">
                                            <span>{data.couponUrl ? data.couponUrl : ''}</span>
                                        </FormItem>
                                        <FormItem label="服务费">
                                            <span>{data.serviceFee ? data.serviceFee : ''}</span>
                                        </FormItem>
                                        <FormItem label="备注">
                                            <span>{data.remark ? data.remark : ''}</span>
                                        </FormItem>
                                        <FormItem label="合作单子时间">
                                            <span>{data.cooperationTime ? format(data.cooperationTime) : ''}</span>
                                        </FormItem>
                                    </Form>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <StoreInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
                            </Col>
                            <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                                <Button type="default" onClick={clickCancel}>取消</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddAttractGoods);

export default BasicForm;

/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Button, Select, DatePicker, PageHeader} from 'antd';
import {addGoods, findGoods} from '../../../api/commondity/attract'
import moment from "moment";
import {openNotificationWithIcon, clickCancel, disabledDate, format, formatDate} from "../../../utils";
import {StoreInfo} from "../common";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class AddAttractGoods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增招商商品',
            query: {},
            storeInfo: {},
            unit: '请选择',
            remark: ''
        };
    }

    // 获取招商商品信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
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

    componentWillUnmount() {
        sessionStorage.removeItem('AttractGood')
    }

    // 获取招商商品信息
    getAdvertInfo(id) {
        const params = {id: id}
        findGoods(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                // 图片处理
                this.props.form.setFieldsValue({
                    couponUrl: data.couponUrl + '',
                    productUrl: data.productUrl + '',
                    serviceFee: data.serviceFee.slice(0, data.serviceFee.length-3) + '',
                    cooperationTime: data.cooperationTime ? moment(data.cooperationTime, 'YYYY-MM-DD') : ''
                })
                const urlData = Object.assign({}, this.state.query, {productUrl: data.productUrl,couponUrl:  data.couponUrl})
                this.setState({
                    remark: data.remark,
                    unit: data.serviceFee.slice(data.serviceFee.length-3, data.serviceFee.length),
                    query: urlData
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }
    // 获取商品链接
    getGoodUrl(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {productUrl: value})
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, {productUrl: ""})
            this.setState({
                query: data
            })
        }
    }
    getCouponUrl(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {couponUrl: value})
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, {couponUrl: ""})
            this.setState({
                query: data
            })
        }
    }
    getRemarkInfo(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                remark: value
            })
        } else {
            this.setState({
                remark: ''
            })
        }
    }
    getStoreInfo(val) {
        this.setState({
            storeInfo: val
        })
    }
    getUnit(val) {
        this.setState({
            unit: val
        })
        this.props.form.setFieldsValue({
            serviceFee: this.props.form.getFieldsValue().serviceFee
        })
    }
    // 提交
    handleSubmit = (publicState, e ) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const bannerId = JSON.parse(sessionStorage.getItem('AttractGood'))
                let text = '新增'
                values.id = ""
                values.serviceFee = values.serviceFee + this.state.unit
                values.remark = this.state.remark
                values.cooperationTime = formatDate(values.cooperationTime)
                values.startTime = ''
                values.endTime = ''
                values.productType = 1
                values.publishStatus = publicState
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = this.state.title.slice(0, 2)
                }
                let params = {}
                const {...result} = this.state.storeInfo
                delete result.imgs
                Object.assign(params,values,result)
                addGoods(params).then((res) => {
                    if (res.success) {
                        openNotificationWithIcon('success', text + '招商商品成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', text + '招商商品失败！')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    serviceVerify = (rule, value, callback) => {
        if (value) {
            if(this.state.unit === '请选择') {
                callback('请选择服务费单位')
            } else {
                callback()
            }
        } else {
            callback('请输入服务费！')
        }
    };
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };

        const {getFieldDecorator} = this.props.form;
        const selectAfter = (
            <Select value={this.state.unit} style={{ width: 100 }} onChange={this.getUnit.bind(this)}>
                <Option value="请选择">请选择</Option>
                <Option value="元/单">元/单</Option>
                <Option value="百分比">百分比</Option>
            </Select>
        );
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="招商商品" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col span={12}>
                                <Form {...formItemLayout} labelAlign={'right'}>
                                    <FormItem label="商品链接">
                                        {getFieldDecorator('productUrl', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入商品链接',
                                                },
                                            ],
                                        })(
                                            <TextArea rows={4} onBlur={this.getGoodUrl.bind(this)}/>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="优惠券链接">
                                        {getFieldDecorator('couponUrl', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入优惠券链接'
                                                },
                                            ],
                                        })(
                                            <TextArea rows={4} onBlur={this.getCouponUrl.bind(this)} />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="服务费">
                                        {getFieldDecorator('serviceFee', {
                                            rules: [
                                                {
                                                    required: true,
                                                    validator: this.serviceVerify
                                                }
                                            ],
                                        })(
                                            <Input addonAfter={selectAfter} />
                                        )}
                                    </FormItem>
                                    <FormItem label="备注">
                                            <TextArea rows={4} value={this.state.remark} onChange={this.getRemarkInfo.bind(this)} />
                                    </FormItem>
                                    <FormItem label="合作单子时间">
                                        {getFieldDecorator('cooperationTime', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择时间!',
                                                },
                                            ],
                                        })(
                                            <DatePicker />
                                        )
                                        }
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{textAlign: 'center'}}>
                                            <Button type="primary" onClick={this.handleSubmit.bind(this, 6)} style={{display: this.state.title !== '续券招商商品' ? 'inline-block' : 'none'}}>保存</Button>
                                            <Button type="primary" onClick={this.handleSubmit.bind(this, 1)} >提交</Button>
                                            <Button type="default"  onClick={clickCancel}>取消</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col span={12}>
                                <StoreInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
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

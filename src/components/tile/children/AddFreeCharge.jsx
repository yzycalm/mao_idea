/*
 * @Author: songuyingchun
 * @Date: 2020-04-15 18:41:19
 * @Description: 新增新人免单商品
 */
import React, { Component } from 'react';
import { Card, Form, Input, Row, Col, Button, Select, DatePicker, PageHeader } from 'antd';
import { saveOrEditNewPerson, findNewPersonById, isExist } from '../../../api/tile/freeCharge'
import moment from "moment";
import { openNotificationWithIcon, clickCancel, format } from "../../../utils";
import StoreInfo from "../../tile/common/StoreInfo";

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AddnewPersons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新人专区商品',
            query: {},
            storeInfo: {},
            remark: '',
            gsId: '',
            libId: ''
        };
    }

    // 获取新人商品信息
    componentDidMount () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id }
            sessionStorage.setItem('newPerson', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: '编辑新人商品'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('newPerson'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: '编辑新人商品'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('newPerson')
    }

    // 获取新人商品信息
    getAdvertInfo (id) {
        const params = { id: id }
        findNewPersonById(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                // 图片处理
                this.props.form.setFieldsValue({
                    gsId: data.gsId,
                    type: data.type,
                    subsidy: data.subsidy,
                    couponUrl: data.couponUrl,
                    virtualValue: +data.type === 1 ? data.virtualValue : '',
                    stock: +data.type === 1 || +data.type === 3 ? data.stock : '',
                    originalPrice: data.originalPrice,
                    time: +data.type === 3 ? [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')] : null,
                    startTime: data.startTime && +data.type !== 3 ? moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss') : ''
                })
                const urlData = Object.assign({}, this.state.query, {
                    gsId: data.gsId
                })
                this.setState({
                    query: urlData,
                    gsId: data.gsId,
                    libId: data.libId
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    // 获取商品链接
    getGoodId (rule, value, callback) {
        if (value) {
            // 判断商品ID是否重复
            this.isExistGoods(value, (res) => {
                res ? callback() : callback("该商品已存在")
            })
        } else {
            callback('请输入商品ID')
        }
    }
    // 商品原价
    regularPrice (rule, value, callback) {
        if (value !== '') {
            const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
            if (reg.test(value)) {
                const regNum = new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g')
                if (regNum.test(value)) {
                    if (value <= 100000) {
                        callback()
                    } else {
                        callback('最大值小于等于10万')
                    }
                } else {
                    callback('价格最多只能输入两位小数')
                }
            } else {
                callback("价格只能为正数")
            }
        } else {
            callback()
        }
    }
    // 库存
    regularKuCun (rule, value, callback) {
        if (value !== '') {
            const reg = /^([0]|[1-9][0-9]*)$/
            if (reg.test(value)) {
                if (value <= 1000000) {
                    callback()
                } else {
                    callback('最大值小于等于100万')
                }
            } else {
                callback("库存只能为纯数字")
            }
        } else {
            callback('请输入库存')
        }
    }
    // 虚拟销量
    regularSale (rule, value, callback) {
        if (value !== '') {
            const reg = /^([0]|[1-9][0-9]*)$/
            if (reg.test(value)) {
                if (value <= 1000000) {
                    callback()
                } else {
                    callback('最大值小于等于100万')
                }
            } else {
                callback("虚拟销量只能为纯数字")
            }
        } else {
            callback('请输入虚拟销量')
        }
    }
    // 判断最高补贴
    handleSubsidy (rule, value, callback) {
        if (value !== '') {
            if (+this.state.storeInfo.finalPrice < +value) {
                this.props.form.setFields({
                    subsidy: {
                        value: value,
                        errors: [new Error('最高补贴不得超过商品券后价')],
                    },
                });
            } else {
                const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
                if (reg.test(value)) {
                    const regNum = new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g')
                    if (regNum.test(value)) {
                        if (value <= 100000) {
                            callback()
                        } else {
                            callback('最大值小于等于10万')
                        }
                    } else {
                        callback('最高补贴最多只能输入两位小数')
                    }
                } else {
                    callback("最高补贴只能为正数")
                }
            }
        } else {
            +this.props.form.getFieldsValue().type === 2 ? callback() : callback('请输入最高补贴')
        }
    }
    getGoodInfo (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value
            let data = Object.assign({}, this.state.query, { gsId: value })
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, { gsId: "" })
            this.setState({
                query: data
            })
        }
    }

    isExistGoods (val, callback) {
        const data = JSON.parse(sessionStorage.getItem('newPerson'))
        if (data && data.id && val === this.state.gsId) {
            // 不监听商品信息
            callback(true)
        } else {
            const params = { gsId: val }
            isExist(params).then(res => {
                if (res) {
                    callback(res.success)
                }
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

    getRemarkInfo (event) {
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

    getStoreInfo (val) {
        this.setState({
            storeInfo: val
        })
    }

    // 提交
    handleSubmit = (publicState, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const bannerId = JSON.parse(sessionStorage.getItem('newPerson'))
                let text = '新增'
                values.id = ""
                values.startTime = moment(values.startTime).valueOf() / 1000
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = "编辑"
                    values.libId = this.state.libId
                }
                let params = {}
                if (!this.state.storeInfo.productId) {
                    openNotificationWithIcon('warning', '找不到该商品信息！')
                    return
                }
                const { ...result } = this.state.storeInfo
                // 是否输入原价
                if (values.originalPrice) {
                    values.finalPrice = parseFloat((values.originalPrice - result.couponPrice).toFixed(2))
                    delete result.finalPrice
                } else {
                    values.originalPrice = result.zkFinalPrice
                }
                values.picUrl = ''
                result.imgs.map((item, index) => {
                    if (index === result.imgs.length - 1) {
                        values.picUrl += item
                    } else {
                        values.picUrl += item + ','
                    }
                })
                if (+values.type === 3) {
                    values.startTime = moment(values.time[0]).valueOf() / 1000
                    values.endTime = moment(values.time[1]).valueOf() / 1000
                }
                delete result.imgs
                values.gsUrl = result.pictUrl
                values.goodsUrl = result.productUrl
                values.gsName = result.productName
                values.platform = result.platform
                values.rate = parseFloat((+result.commissionShare * 100).toFixed(2))
                values.couponAmount = result.couponPrice
                console.log(values)
                Object.assign(params, values, result)
                saveOrEditNewPerson(params).then((res) => {
                    if (res.success) {
                        if (+params.type === 1) {
                            text += '新人免单商品成功！'
                        } else if(+params.type === 2) {
                            text += '好物推荐商品成功！'
                        } else {
                            text += '年货节商品成功！'
                        }
                        openNotificationWithIcon('success', text)
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', res.message)
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="新人专区" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col xl={24} xxl={12}>
                                <Form {...formItemLayout} labelAlign={'right'}>
                                    <FormItem label="类型">
                                        {getFieldDecorator('type', {
                                            initialValue: 1,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择类型',
                                                },
                                            ],
                                        })(
                                            <Select>
                                                <Option value={1}>新人免单</Option>
                                                <Option value={2}>好物推荐</Option>
                                                <Option value={3}>年货节</Option>
                                            </Select>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="商品ID">
                                        {getFieldDecorator('gsId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    validator: this.getGoodId.bind(this)
                                                }
                                            ],
                                        })(
                                            <Input type="number" onBlur={this.getGoodInfo.bind(this)} />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="优惠券链接">
                                        {getFieldDecorator('couponUrl', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入优惠券链接'
                                                },
                                            ],
                                        })(
                                            <TextArea rows={4} onBlur={this.getCouponUrl.bind(this)} />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="最高补贴"
                                        style={{ display: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3 ? 'block' : "none" }}
                                    >
                                        {getFieldDecorator('subsidy', {
                                            rules: [
                                                {
                                                    required: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3,
                                                    validator: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3 ? this.handleSubsidy.bind(this) : ''
                                                }
                                            ],
                                        })(
                                            <Input />
                                        )}
                                        <span style={{ color: 'grey' }}>注意：最高补贴不得超过商品券后价</span>
                                    </FormItem>
                                    <FormItem label="商品原价"
                                        style={{ display: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3 ? 'block' : "none" }}
                                    >
                                        {getFieldDecorator('originalPrice', {
                                            rules: [
                                                {
                                                    required: false,
                                                    validator: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3 ? this.regularPrice.bind(this) : ''
                                                }
                                            ],
                                        })(
                                            <Input type="number" step={0.01} precision={2} />
                                        )}
                                    </FormItem>
                                    <FormItem label="库存"
                                        style={{ display: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3 ? 'block' : "none" }}
                                    >
                                        {getFieldDecorator('stock', {
                                            rules: [
                                                {
                                                    required: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3,
                                                    message: '请输入库存'
                                                }, {
                                                    validator: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 3 ? this.regularKuCun.bind(this) : ''
                                                }
                                            ],
                                        })(
                                            <Input type="number" />
                                        )}
                                    </FormItem>
                                    <FormItem label="虚拟销量"
                                        style={{ display: this.props.form.getFieldsValue().type === 1 ? 'block' : "none" }}
                                    >
                                        {getFieldDecorator('virtualValue', {
                                            rules: [
                                                {
                                                    required: this.props.form.getFieldsValue().type === 1,
                                                    validator: this.props.form.getFieldsValue().type === 1 ? this.regularSale.bind(this) : ''
                                                }
                                            ],
                                        })(
                                            <Input type="number" />
                                        )}
                                    </FormItem>
                                    <FormItem label="上架时间"
                                        style={{ display: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 2 ? 'block' : "none" }}
                                    >
                                        {getFieldDecorator('startTime', {
                                            rules: [
                                                {
                                                    required: this.props.form.getFieldsValue().type === 1 || this.props.form.getFieldsValue().type === 2,
                                                    message: '请选择时间!',
                                                },
                                            ],
                                        })(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="上下架时间"
                                        style={{ display: this.props.form.getFieldsValue().type === 3 ? 'block' : "none" }}
                                    >
                                        {getFieldDecorator('time', {
                                            rules: [
                                                {
                                                    required: this.props.form.getFieldsValue().type === 3,
                                                    message: '请选择时间!',
                                                },
                                            ],
                                        })(
                                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                        )
                                        }
                                    </FormItem>
                                </Form>
                            </Col>
                            <Col xl={24} xxl={12}>
                                <StoreInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this, 1)}>确定</Button>
                                <Button type="default" onClick={clickCancel}>取消</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddnewPersons);

export default BasicForm;

/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Button, Select, DatePicker, PageHeader, Radio} from 'antd';
import {addGoods, findGoods, coupon} from '../../../api/commondity/attract'
import moment from "moment";
import {openNotificationWithIcon, clickCancel, disabledDate, format} from "../../../utils";
import {StoreInfo} from "../common";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {RangePicker} = DatePicker
class AddAttractGoods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增商品',
            query: {},
            storeInfo: {},
            unit: '请选择',
            isProductUrlRequired: true,
            isProductIdRequired: true,
            isPlatformRequired: true,
            remark:"",
            platform:"",
            goodsId:"",
            goodsUrl:"",
            couponPrice:"",
            productName: '', // 修改的商品名称
            picUrl: '' // 修改的封面图
        };
    }

    // 获取运营商品信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('AttractGood', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '商品'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('AttractGood'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '商品'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('AttractGood')
    }

    // 获取运营商品信息
    getAdvertInfo(id) {
        const params = {id: id}
        findGoods(params).then((res) => {
            console.log(res)
            if (res && res.success) {
                const data = res.data
                // 图片处理
                this.props.form.setFieldsValue({
                    productId: data.productId + '',
                    productUrl: data.productUrl + '',
                    platform: data.platform + '',
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')],
                    remark: data.remark,
                    couponUrl:data.couponUrl
                })
                if(!data.productUrl) this.setState({isProductUrlRequired: false})
                if(!data.productId) this.setState({isProductIdRequired: false})

                const urlData = data.productUrl ? Object.assign({}, this.state.query, {productUrl: data.productUrl}) : Object.assign({}, this.state.query, {platform: data.platform, productId: data.productId})
                this.setState({
                    remark: data.remark,
                    unit: data.serviceFee.slice(data.serviceFee.length-3, data.serviceFee.length),
                    query: urlData,
                    productName: data.productName,
                    picUrl: data.picUrl
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }
    // 获取商品链接
    getGoodUrl(event) {
        this.setState({
            goodsUrl : event.target.value
        })
        console.log(event.target.value)
        console.log(this.getUrlParam(event.target.value)) 
        this.setState({
            goodsId:this.getUrlParam(event.target.value)
        })
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {productUrl: value})
            this.setState({
                query: data,
                isPlatformRequired: false,
                isProductIdRequired: false
            })
        } else {
            let data = Object.assign({}, this.state.query, {productUrl: ""})
            this.setState({
                query: data,
                isPlatformRequired: true,
                isProductIdRequired: true
            })
        }
    }

    //获取备注链接
    remarkLength(){
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     console.log(values.remark)
        // })
    }


    getGoodId(event) {
        this.setState({
            goodsId : event.target.value
        })
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {productId: value})
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, {productId: ""})
            this.setState({
                query: data
            })
        }
    }

    getUrlParam(obj) {
        var index=obj.lastIndexOf("\=");
        obj=obj.substring(index+1,obj.length);
        // console.log(obj);
        return obj;
    }

    getcoupon(event) {
        console.log(event.target.value)
        if (event && event.target && event.target.value && event.target.value !="") {
            if(this.state.goodsId == ""){
                openNotificationWithIcon('warning', '请先输入商品id或商品链接')
                return
            }else if(this.state.goodsId == "" || this.state.goodsUrl == "" && this.state.platform == ""){
                openNotificationWithIcon('warning', '请先选择平台')
                return
            }
            let params = {
                couponUrl : event.target.value,
                goodsId : this.state.goodsId,
                platform : this.state.platform?this.state.platform:2,
            }

            coupon(params).then((res) => {
                if(res.success){
                    let data = Object.assign({}, this.state.query, {couponPrice: res.data.couponPrice})
                    // let data = Object.assign({}, this.state.query, {couponPrice:500})
                        this.setState({
                            query: data,
                        })
                        this.setState({
                            couponPrice:res.data.couponPrice
                            // couponPrice:500
                        })
                        // console.log(this.state.couponPrice)
                }else{
                    openNotificationWithIcon('warning', '优惠券无效')
                }
                
               
            })
         }else{
            this.setState({
                // couponPrice:res.data.couponPrice
                couponPrice:""
            })

           
            if (this.state.goodsUrl) {
                let value = this.state.goodsUrl;
                let data = Object.assign({}, this.state.query, {productUrl: value})
                this.setState({
                    query: data,
                    isPlatformRequired: false,
                    isProductIdRequired: false
                })
            } else {
                let data = Object.assign({}, this.state.query, {productUrl: ""})
                this.setState({
                    query: data,
                    isPlatformRequired: true,
                    isProductIdRequired: true
                })
            }

         }
    }
    handleSelectPlatform(value) {
        this.setState({
            platform :value
        })
        let data = Object.assign({}, this.state.query, {platform: value})
        this.setState({
            query: data
        })
    }
    getStoreInfo(val) {
        console.log(val)
        this.setState({
            storeInfo: val
        })
    }
    getUnit(val) {
        this.setState({
            unit: val
        })
    }
    getGoodUrlRequired() {
        this.setState({
            isPlatformRequired: false,
            isProductIdRequired: false
        })
    }
    getGoodIdRequired() {
        this.setState({
            isPlatformRequired: true,
            isProductUrlRequired: false
        })
    }
    // 提交
    handleSubmit = (publicState, e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {
                const bannerId = JSON.parse(sessionStorage.getItem('AttractGood'))
                let text = '新增'
                values.id = ""
                if(values.time && values.time.length === 2) {
                    values.startTime = new Date(values.time[0]).getTime()
                    values.endTime = new Date(values.time[1]).getTime()
                }
                values.productType = 0
                values.publishStatus = publicState
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = '编辑'
                }
                let params = {}
                const {...result} = this.state.storeInfo
                delete result.imgs
                Object.assign(params,values,result)
                delete params.time
                // 判断是否由优惠券有效期
                if(!params.couponStartTime && !params.couponEndTime) {
                    openNotificationWithIcon('warning', '该商品无有效优惠券，请选择上下架时间！')
                    return
                }
              
                if(this.state.couponPrice != ""){
               
                    delete params.couponPrice
                    let couponPricevalue = {
                        couponPrice : this.state.couponPrice
                    }
                    Object.assign(params,couponPricevalue)
                }

                console.log(params)
                addGoods(params).then((res) => {
                    if (res.success) {
                        openNotificationWithIcon('success', text + '商品成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', text + '商品失败！')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
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
        const {isProductIdRequired, isProductUrlRequired, isPlatformRequired} = this.state
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="商品录入" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col span={12}>
                                <Form {...formItemLayout} labelAlign={'right'}>
                                    <FormItem label="商品链接" style={{display: isProductUrlRequired ? 'block' : "none"}}>
                                        {getFieldDecorator('productUrl', {
                                            rules: [
                                                {
                                                    required: isProductUrlRequired,
                                                    message: '请输入商品链接',
                                                },
                                            ],
                                        })(
                                            <TextArea rows={4} onBlur={this.getGoodUrl.bind(this)} onFocus={this.getGoodUrlRequired.bind(this)} />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="商品ID" style={{display: isProductIdRequired ? 'block' : "none"}}>
                                        {getFieldDecorator('productId', {
                                            rules: [
                                                {
                                                    required: isProductIdRequired,
                                                    message: '请输入商品ID'
                                                },
                                            ],
                                        })(
                                            <Input onBlur={this.getGoodId.bind(this)} onFocus={this.getGoodIdRequired.bind(this)} />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="平台" style={{display: isPlatformRequired ? 'block' : "none"}}>
                                        {getFieldDecorator('platform', {
                                            rules: [
                                                {
                                                    required: isPlatformRequired,
                                                    message: '请选择平台!',
                                                },
                                            ],
                                        })(
                                            <Select placeholder="请选择" onChange={this.handleSelectPlatform.bind(this)}>
                                                <Option value="2">淘宝</Option>
                                                <Option value="3">京东</Option>
                                                <Option value="7">拼多多</Option>
                                                <Option value="4">唯品会</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem label="优惠券链接" >
                                        {getFieldDecorator('couponUrl', {
                                            rules: [
                                                {
                                                   
                                                    // message: '请输入商品链接',
                                                },
                                            ],
                                        })(
                                            <TextArea rows={4} onBlur={this.getcoupon.bind(this)} />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="上架时间--下架时间">
                                        {getFieldDecorator('time', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请选择上下架时间!',
                                                },
                                            ],
                                        })(
                                            <RangePicker renderExtraFooter={() => '红人装'} showTime={{
                                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                            }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate}
                                            />
                                        )}
                                        <div style={{color: 'grey' , width:"430px"}}>不填写时间时，默认提交上架时间为此刻，优惠券失效后自动下架。</div>
                                    </FormItem>
                                    <FormItem label="备注">
                                        {getFieldDecorator('remark', {
                                            rules: [
                                                {
                                                    // required: isProductUrlRequired,
                                                    // message: '请输入商品链接',
                                                },
                                            ],
                                        })(
                                            <TextArea rows={4} maxLength={1000} />
                                        )}
                                          <div style={{color: 'grey'}}>最多输入1000个字符</div>
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{textAlign: 'center'}}>
                                            <Button type="primary" onClick={this.handleSubmit.bind( this, 6)}>保存</Button>
                                            <Button type="primary" onClick={this.handleSubmit.bind(this, 1)}>提交</Button>
                                            <Button type="default" onClick={clickCancel}>取消</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col span={12}>
                                <StoreInfo productName={this.state.productName} picUrl={this.state.picUrl} params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
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

/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Button, Upload, Modal, Icon, Skeleton, PageHeader, Checkbox} from 'antd';
import {getScalpingDetail4, addScalpingItem4} from '../../../api/commondity/attract'
import {openNotificationWithIcon, clickCancel, handleImgSize} from "../../../utils";
import {uploadImg} from "../../../api/public";

const FormItem = Form.Item;
const { confirm } = Modal
class AddScalpingGoodsGoods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增自营商品',
            loading: false,
            isInit: false,
            // 图片上传
            previewVisible: false,
            previewImage: '',
            arr1: [2,3,4,5],
            arr2: [7,8,9,10,11],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            fileList5: [],
            fileList6: [],
            fileList7: [],
            fileList8: [],
            fileList9: [],
            fileList10: [],
            fileList11: [],
            test: [1, 2, 3, 4],
            activeDrags: 0,
            sendTime: "",
            status: 3,
            sendStatus: 0,
            width: 640,
            height:640,
            selected: [],
            state_sale: '',
            isShow: false,
            isAdd: true,
            disabled: true,
            onlyRead: true,
            defaultChecked: []
        };
    }

    // 获取自营商品信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('ScalpingGoods', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '自营商品',
                    isAdd: false
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('ScalpingGoods'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '自营商品',
                    isAdd: false
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('ScalpingGoods')
    }

    // 获取自营商品信息
    getAdvertInfo(id) {
        const params = {goodsCode: id}
        getScalpingDetail4(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                this.props.form.setFieldsValue({
                    goodsTitle: data.goodsTitle,
                    remainVolume: data.remainVolume + "",
                    marketPrice: data.marketPrice +"",
                    orgPrice: data.orgPrice+"",
                    totalCommission: data.totalCommission+"",
                    commBasicComm: data.commBasicComm+"",
                    commSpecialComm: data.commSpecialComm+"",
                    shopmanStockPrice: data.shopmanStockPrice+""
                })
                this.setState({
                    state_sale: data.status
                })
                const {gsPicList, gsDetails} = data
                gsPicList.map((item, index)=> {
                    this.setState({
                        ['fileList' + (index + 1)]: [{uid: new Date().getTime(), url: item, status: 'done'}]
                    })
                })
                if(gsDetails.length > 0) {
                    gsDetails.map((item, index)=> {
                        this.setState({
                            ['fileList' + (index + 6)]: [{uid: new Date().getTime(), url: item, status: 'done'}]
                        })
                    })
                }
                this.setState({
                    defaultChecked: +data.showPlace === 2 ? [0, 1] : [data.showPlace]
                })
                this.props.form.setFieldsValue({
                    selected:  +data.showPlace === 2 ? [0, 1] : [data.showPlace]
                })
                this.props.form.setFieldsValue({
                    fileList1: this.state.fileList1,
                    fileList6: this.state.fileList6
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // 数据约束
                if(+values.totalCommission > +values.orgPrice) {
                    openNotificationWithIcon('warning',  '佣金总金额应该必须小于等于会员购买价！')
                    return;
                }
                if(+values.orgPrice > +values.marketPrice) {
                    this.props.form.setFields({
                        orgPrice: {
                            value: values.orgPrice,
                            errors: [new Error('会员购买价必须小于等于市场价！')],
                        },
                    });
                    return;
                }
                if(+values.shopmanStockPrice > +values.orgPrice) {
                    this.props.form.setFields({
                        shopmanStockPrice: {
                            value: values.shopmanStockPrice,
                            errors: [new Error('店主进货价必须小于或等于购买价！')],
                        },
                    });
                    return
                }
                const arr = [1,2,3,4,5]
                let thumbs = []
                arr.forEach(item=> {
                    if(this.state["fileList" + item].length > 0) {
                        thumbs.push(this.state["fileList" + item][0].url)
                    }
                })
                values.gsPicList = thumbs
                if(this.state.defaultChecked.length > 1) {
                    values.showPlace = 2
                } else  {
                    values.showPlace = this.state.defaultChecked[0]
                }
                const arr2 = [6,7,8,9,10,11]
                let goods_details = []
                arr2.forEach(item=> {
                    if(this.state["fileList" + item].length > 0) {
                        goods_details.push(this.state["fileList" + item][0].url)
                    }
                })
                values.gsDetails = goods_details
                delete values.fileList1
                delete values.fileList6
                delete values.selected
                const bannerId = JSON.parse(sessionStorage.getItem('ScalpingGoods'))
                values.goodsCode = ""
                values.createBy = "hrz_admin"
                values.goodsTag = 0
                if (bannerId && bannerId.id) {
                    values.goodsCode = bannerId.id
                    addScalpingItem4(values).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success',  '编辑自营商品成功！')
                            clickCancel()
                        } else {
                            openNotificationWithIcon('error', res.msg)
                        }
                    })
                } else {
                    addScalpingItem4(values).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success',  '新增自营商品成功！')
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
    handleCancel = () => this.setState({previewVisible: false});
    // 预览
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    beforeUpload = (i,file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        if(i >= 6) {
            return  handleImgSize(r, file, 0, 0, res => {
                that.setState({
                    data: res
                })
            })
        } else {
            return  handleImgSize(r, file, this.state.width, this.state.height, res => {
                that.setState({
                    data: res
                })
            })
        }
    };
    handleChange = (i,file) => {
        this.setState({
            ['fileList' + i]: file.fileList.splice(file.fileList.length - 1)
        })
    }
    handleRemove = (i,file) => {
        this.state['fileList' + i].splice(this.state['fileList' + i].length - 1);
        this.setState({
            ['fileList' + i]: this.state['fileList' + i]
        });
    }
    // 自定义上传
    customRequest = (i,files) => {
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    ['fileList'+i]: [{uid: new Date().getTime(), url: res.data, status: 'done'}]
                })
            }
        })
    }
    getAllPrice() {
        this.props.form.setFieldsValue({
            totalCommission: (parseInt(this.props.form.getFieldsValue().commBasicComm) +  parseInt(this.props.form.getFieldsValue().commSpecialComm)).toFixed(2),
        })
    }
    // 判断商品是否已存在
    handleNameExit() {
        let params = {goodsCode: ""}
        params.goodsTitle = this.props.form.getFieldsValue().goodsTitle
        getScalpingDetail4(params).then(res=> {
            if(res && res.success) {
                if(res.data) {
                    this.props.form.setFields({
                        goodsTitle: {
                            value: this.props.form.getFieldsValue().goodsTitle,
                            errors: [new Error('该商品名已存在！')],
                        },
                    });
                }
            }
        })
    }
    handleBack() {
        if(this.props.form.getFieldsValue().goodsTitle) {
            if(+this.state.state_sale===1) {
                clickCancel()
            } else {
                confirm({
                    title: '提示',
                    content: '你还未保存信息，确认取消保存吗？',
                    centered: true,
                    onOk() {
                        clickCancel()
                    },
                    onCancel() {
                    },
                });
            }
        } else {
            clickCancel()
        }
    }
    onChange(checkedValue) {
        this.setState({
            defaultChecked: checkedValue
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        const {getFieldDecorator} = this.props.form;
        const { fileList1, fileList6,previewVisible,previewImage, isInit, loading, state_sale,isShow, isAdd, disabled,onlyRead,arr1, arr2} = this.state;
        const labels = [{label:"推荐", value: 1},{label: "精选", value: 0}]
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );

        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="自营商品4.0" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={isInit} active paragraph={{ rows: 15 }} >
                                <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                    <FormItem label="商品名称">
                                        {getFieldDecorator('goodsTitle', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入商品名称!',
                                                },{
                                                min: 5,
                                                max: 30,
                                                message: '请输入5—30位的商品名称'
                                                }
                                            ],
                                        })(
                                            <Input style={{width: '263px'}} onBlur={this.handleNameExit.bind(this)} disabled={+state_sale===1 || disabled  && !isAdd && !isAdd} placeholder="请输入商品名称" />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="库存数量">
                                        {getFieldDecorator('remainVolume', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入库存数量!',
                                                },
                                                {
                                                    min: 1,
                                                    max: 10,
                                                    message: '请输入1—10位的库存数量'
                                                },
                                                {
                                                    pattern: new RegExp(/^[0-9]\d*$/, "g"),
                                                    message: '库存数量为正整数'
                                                }
                                            ],
                                        })(
                                            <Input style={{width: '263px'}} addonAfter={'件'} type="number" disabled={+state_sale===1 || disabled  && !isAdd} placeholder="请输入库存数量"></Input>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="市场价">
                                        {getFieldDecorator('marketPrice', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入市场价!',
                                                },
                                                {
                                                    min: 1,
                                                    max: 10,
                                                    message: '请输入1—10位的市场价'
                                                },
                                                {
                                                    pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                    message: '市场价为非负数'
                                                }
                                            ],
                                        })(
                                            <Input style={{width: '263px'}} addonAfter={'元'} type="number" disabled={+state_sale===1 || disabled  && !isAdd}  placeholder="请输入市场价"></Input>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="会员购买价">
                                        {getFieldDecorator('orgPrice', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入会员购买价!',
                                                },
                                                {
                                                    min: 1,
                                                    max: 10,
                                                    message: '请输入1—10位的会员购买价'
                                                },
                                                {
                                                    pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                    message: '会员购买价为非负数'
                                                }
                                            ],
                                        })(
                                            <Input style={{width: '263px'}} addonAfter={'元'} onBlur={this.getAllPrice.bind(this)} type="number" disabled={+state_sale===1 || onlyRead  && !isAdd} placeholder="请输入会员购买价"></Input>
                                        )
                                        }
                                     </FormItem>
                                    <Col>
                                        <span style={{position: "absolute", left: '14%', top: "32px"}}>│<br/>│<br/>├─<br/>│<br/>│<br/>└─</span>
                                        <FormItem label="&nbsp;佣&nbsp; 金&nbsp; 总&nbsp; 金&nbsp; 额">
                                            {getFieldDecorator('totalCommission', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '',
                                                    },
                                                ]
                                            })(
                                                <Input style={{width: '263px'}} addonAfter={'元'} type="number" placeholder="请输入佣金总金额" disabled={true}></Input>
                                            )}
                                        </FormItem>
                                        <FormItem label="基础佣金">
                                            {getFieldDecorator('commBasicComm', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入基础佣金!',
                                                    },
                                                    {
                                                        min: 1,
                                                        max: 10,
                                                        message: '请输入1—10位的基础佣金'
                                                    },
                                                    {
                                                        pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                        message: '基础佣金为非负数'
                                                    }
                                                ],
                                            })(
                                                <Input style={{width: '263px'}} addonAfter={'元'} type="number" onBlur={this.getAllPrice.bind(this)} disabled={+state_sale===1 || onlyRead  && !isAdd} placeholder="请输入佣金总金额"></Input>
                                            )
                                            }
                                        </FormItem>
                                        <FormItem label="专享佣金">
                                            {getFieldDecorator('commSpecialComm', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入专享佣金!',
                                                    },
                                                    {
                                                        min: 1,
                                                        max: 10,
                                                        message: '请输入1—10位的专享佣金'
                                                    },
                                                    {
                                                        pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                        message: '专享佣金为非负数'
                                                    }
                                                ],
                                            })(
                                                <Input style={{width: '263px'}} addonAfter={'元'} onBlur={this.getAllPrice.bind(this)} type="number" disabled={+state_sale===1 || onlyRead  && !isAdd} placeholder="请输入专享佣金"></Input>
                                            )
                                            }
                                        </FormItem>
                                    </Col>
                                    <FormItem label="店主进货价">
                                        {getFieldDecorator('shopmanStockPrice', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入店主进货价',
                                                },
                                                {
                                                    min: 1,
                                                    max: 10,
                                                    message: '请输入1—10位的店主进货价'
                                                },
                                                {
                                                    pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                    message: '店主进货价为非负数'
                                                }
                                            ],
                                        })(
                                            <Input style={{width: '263px'}} addonAfter={'元'} type="number" disabled={+state_sale===1 || onlyRead  && !isAdd} placeholder="请输入店主进货价"></Input>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="商品标签:">
                                        {getFieldDecorator('selected', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请勾选商品标签',
                                                }
                                            ],
                                        })(
                                            <Checkbox.Group disabled={+state_sale===1 || disabled  && !isAdd} options={labels} onChange={this.onChange.bind(this)} />
                                        )}
                                    </FormItem>
                                    <FormItem label="商品主图">
                                        <Col span={6}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            {getFieldDecorator('fileList1', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择商品主图!'
                                                    }
                                                ]
                                            })(
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                disabled={+state_sale===1 || disabled  && !isAdd}
                                                fileList={fileList1}
                                                customRequest={this.customRequest.bind(this, 1)}
                                                beforeUpload={this.beforeUpload.bind(this, 1)}
                                                onPreview={this.handlePreview.bind(this)}
                                                onChange={this.handleChange.bind(this, 1)}
                                                onRemove={this.handleRemove.bind(this, 1)}>
                                                {fileList1.length >= 1 ? null : uploadButton}
                                            </Upload>
                                            )}
                                            {
                                                arr1.map((item, index)=> {
                                                    return <Upload
                                                        key={item}
                                                        accept="image/*"
                                                        listType="picture-card"
                                                        disabled={+state_sale===1 || disabled  && !isAdd}
                                                        fileList={this.state['fileList'+item]}
                                                        customRequest={this.customRequest.bind(this, item)}
                                                        beforeUpload={this.beforeUpload.bind(this, item)}
                                                        onPreview={this.handlePreview.bind(this)}
                                                        onChange={this.handleChange.bind(this, item)}
                                                        onRemove={this.handleRemove.bind(this, item)}>
                                                        {this.state['fileList'+item].length >= 1 ? null : uploadButton}
                                                    </Upload>
                                                })
                                            }
                                        </div>
                                            <span>图片大小必须为{this.state.width}px * {this.state.height}px的矩形图片</span>
                                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                            </Modal>
                                        </Col>
                                    </FormItem>
                                    <FormItem label="商品详情">
                                        <Col span={6}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        {getFieldDecorator('fileList6', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择商品详情图!'
                                                }
                                            ]
                                        })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            disabled={+state_sale===1 || disabled  && !isAdd}
                                            fileList={fileList6}
                                            customRequest={this.customRequest.bind(this, 6)}
                                            beforeUpload={this.beforeUpload.bind(this, 6)}
                                            onPreview={this.handlePreview.bind(this)}
                                            onChange={this.handleChange.bind(this, 6)}
                                            onRemove={this.handleRemove.bind(this, 6)}>
                                            {fileList6.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        )}
                                        {
                                            arr2.map((item, index)=> {
                                                return <Upload
                                                        key={item}
                                                        accept="image/*"
                                                        listType="picture-card"
                                                        disabled={+state_sale===1 || disabled  && !isAdd}
                                                        fileList={this.state['fileList'+item]}
                                                        customRequest={this.customRequest.bind(this, item)}
                                                        beforeUpload={this.beforeUpload.bind(this, item)}
                                                        onPreview={this.handlePreview.bind(this)}
                                                        onChange={this.handleChange.bind(this, item)}
                                                        onRemove={this.handleRemove.bind(this, item)}>
                                                        {this.state['fileList'+item].length >= 1 ? null : uploadButton}
                                                        </Upload>
                                            })
                                        }
                                        </div>
                                        </Col>
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{textAlign: 'center'}}>
                                            <Button type="primary" style={{display: +state_sale === 3 && !isShow ? "inline-block" : 'none'}} onClick={()=>this.setState({isShow: true, disabled : false})} loading={loading}>编辑</Button>
                                            <Button type="primary" style={{display: isAdd || isShow? "inline-block" : 'none'}} htmlType="submit" loading={loading}>保存</Button>
                                            <Button type="default" onClick={this.handleBack.bind(this)}>返回</Button>
                                        </Col>
                                    </Row>
                                </Form>
                        </Skeleton>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddScalpingGoodsGoods);

export default BasicForm;

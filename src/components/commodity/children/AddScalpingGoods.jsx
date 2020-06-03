/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Button, Upload, Modal, Icon,Skeleton,PageHeader } from 'antd';
import {getScalpingDetail, addScalpingItem, updateScalpingItem, getIsSameGoodName} from '../../../api/commondity/attract'
import {openNotificationWithIcon, clickCancel, handleImgSize, jsToFormData} from "../../../utils";
import {uploadImg} from "../../../api/public";
import {LabelInfo} from "../common";

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
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            fileList5: [],
            fileList6: [],
            test: [1, 2, 3, 4],
            activeDrags: 0,
            sendTime: "",
            status: 2,
            sendStatus: 0,
            width: 640,
            height:640,
            selected: [],
            state_sale: '',
            isShow: false,
            isAdd: true,
            disabled: true
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
        getScalpingDetail(id).then((res) => {
            if (res && +res.code === 1) {
                const {sku_goods, sku_price,sku_thumb,sup_detail,sku_label} = res.data
                this.props.form.setFieldsValue({
                    goods_name: sku_goods.name,
                    stock: sku_goods.stock,
                    price: sku_goods.price,
                })
                this.setState({
                    state_sale: sku_goods.state_sale
                })
                Object.keys(sku_goods).map(item=> {
                    this.setState({
                        item: sku_goods[item]
                    })
                })
                sku_price.map(item=> {
                    this.props.form.setFieldsValue({
                        [item.ke]: item.price
                    })
                    this.setState({
                        [item.ke]: item.price
                    })
                })

                sku_thumb.map((item, index)=> {
                    if(index > 4) return
                    this.setState({
                        ['fileList' + (index + 1)]: [{uid: new Date().getTime(), url: item.thumb, status: 'done'}]
                    })
                })
                if(sup_detail) {
                    const itemImg = JSON.parse(sup_detail.thumbs_json)
                    itemImg.map(item=> {
                        this.setState({
                            fileList6: [...this.state.fileList6,{uid: new Date().getTime(), url: item, status: 'done'}]
                        })
                    })
                }
                this.props.form.setFieldsValue({
                    allPrice: parseInt(this.props.form.getFieldsValue().profile_auth198) + parseInt(this.props.form.getFieldsValue().profile_auth680)
                })
                sku_label.map(item=> {
                    this.setState({
                        selected: [...this.state.selected, item.id + '']
                    })
                    this.props.form.setFieldsValue({
                        selected: [...this.state.selected, item.id + '']
                    })
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
                if(+values.auth0 > +values.price) {
                    this.props.form.setFields({
                        auth0: {
                            value: values.auth0,
                            errors: [new Error('粉丝购买价必须小于等于市场价！')],
                        },
                    });
                    return;
                }
                if(+values.profile_auth198 > +values.allPrice) {
                    this.props.form.setFields({
                        profile_auth198: {
                            value: values.profile_auth198,
                            errors: [new Error('基础佣金必须小于等于佣金总金额！')],
                        },
                    });
                    return
                }
                if(+values.profile_auth680 > +values.allPrice) {
                    this.props.form.setFields({
                        profile_auth680: {
                            value: values.profile_auth680,
                            errors: [new Error('专享佣金必须小于等于佣金总金额！')],
                        },
                    });
                    return
                }
                if(+values.auth198 >= +values.auth0) {
                    this.props.form.setFields({
                        auth198: {
                            value: values.auth198,
                            errors: [new Error('皇冠购买价必须小于粉丝购买价！')],
                        },
                    });
                    return
                }
                if(+values.auth680 >= +values.auth198) {
                    this.props.form.setFields({
                        auth680: {
                            value: values.auth680,
                            errors: [new Error('店主购买价必须小于皇冠购买价！')],
                        },
                    });
                    return
                }
                if(+values.auth_agent > +values.auth680) {
                    this.props.form.setFields({
                        auth_agent: {
                            value: values.auth_agent,
                            errors: [new Error('店主进货价必须小于或等于店主购买价！')],
                        },
                    });
                    return
                }
                const arr = [1,2,3,4,5]
                let thumbs = []
                arr.forEach(item=> {
                    if(this.state["fileList" + item].length > 0) {
                        thumbs.push({["banner"+ item]: this.state["fileList" + item][0].url})
                    }
                })
                values.sku_thumb = JSON.stringify(thumbs)
                values.label = JSON.stringify(values.selected)
                values.thumb = this.state.fileList1[0].url
                let goods_details = []
                if(this.state.fileList6.length > 0) {
                    this.state.fileList6.forEach(item=> {
                        goods_details.push(item.url)
                    })
                }
                values.goods_detail = JSON.stringify(goods_details)
                delete values.fileList1
                delete values.fileList6
                const bannerId = JSON.parse(sessionStorage.getItem('ScalpingGoods'))
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    updateScalpingItem(jsToFormData(values)).then((res) => {
                        if (res && +res.code === 1) {
                            openNotificationWithIcon('success', '编辑自营商品成功！')
                            clickCancel()
                        } else {
                            openNotificationWithIcon('error', res.msg)
                        }
                    })
                } else {
                    addScalpingItem(jsToFormData(values)).then((res) => {
                        if (res && +res.code === 1) {
                            openNotificationWithIcon('success', '新增自营商品成功！')
                            clickCancel()
                        } else {
                            openNotificationWithIcon('error', res.msg)
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
        if(i===6) {
            return handleImgSize(r, file, 0, 0, res => {
                that.setState({
                    data: res
                })
            })
        } else {
            return handleImgSize(r, file, this.state.width, this.state.height, res => {
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
    handleOtherChange = (file) => {
        // this.setState({
        //     fileList6: file.fileList
        // })
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
                if(i===6){
                    this.setState({fileList6: [...this.state.fileList6, {uid: new Date().getTime(), url: res.data, status: 'done'}]})
                } else {
                    that.setState({
                        ['fileList'+i]: [{uid: new Date().getTime(), url: res.data, status: 'done'}]
                    })
                }
            }
        })
    }
    getSelectedLabel(val) {
        this.setState({
            selected: val
        })
        if(val && val.length > 0) {
            this.props.form.setFieldsValue({
                selected: val
            })
        } else {
            this.props.form.setFields({
                selected: {
                    value: val,
                    errors: [new Error('请勾选商品标签！')],
                },
            });
        }
    }
    getAllPrice() {
        this.props.form.setFieldsValue({
            allPrice: (parseInt(this.props.form.getFieldsValue().profile_auth198) + parseInt(this.props.form.getFieldsValue().profile_auth680)).toFixed(2),
            auth198: (parseInt(this.props.form.getFieldsValue().auth0) - parseInt(this.props.form.getFieldsValue().profile_auth198)).toFixed(2),
            auth680: (parseInt(this.props.form.getFieldsValue().auth0) - parseInt(this.props.form.getFieldsValue().profile_auth680)).toFixed(2)
        })
    }
    // 判断商品是否已存在
    handleNameExit() {
        const bannerId = JSON.parse(sessionStorage.getItem('ScalpingGoods'))
        let params = {}
        params.name = this.props.form.getFieldsValue().goods_name
        if (bannerId && bannerId.id) {
            params.id = bannerId.id
        }
        getIsSameGoodName(jsToFormData(params)).then(res=> {
            if(res && +res.code === 1) {
                if(res.data) {
                    this.props.form.setFields({
                        goods_name: {
                            value: this.props.form.getFieldsValue().goods_name,
                            errors: [new Error('该商品名已存在！')],
                        },
                    });
                }
            }
        })
    }
    handleBack() {
        if(this.props.form.getFieldsValue().goods_name) {
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
        const { fileList1,fileList2,fileList3,fileList4,fileList5, fileList6,previewVisible,previewImage, isInit, loading, selected, state_sale,isShow, isAdd, disabled} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );

        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="自营商品" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={isInit} active paragraph={{ rows: 15 }} >
                            <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                <FormItem label="商品名称">
                                    {getFieldDecorator('goods_name', {
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
                                        <Input style={{width: '263px'}} onBlur={this.handleNameExit.bind(this)} disabled={+state_sale===1 || disabled && !isAdd && !isAdd} placeholder="请输入商品名称" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="库存数量">
                                    {getFieldDecorator('stock', {
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
                                        <Input style={{width: '263px'}} addonAfter={'件'} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入库存数量" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="市场价">
                                    {getFieldDecorator('price', {
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
                                        <Input style={{width: '263px'}} addonAfter={'元'} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入市场价" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="粉丝购买价">
                                    {getFieldDecorator('auth0', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入粉丝购买价!',
                                            },
                                            {
                                                min: 1,
                                                max: 10,
                                                message: '请输入1—10位的粉丝购买价'
                                            },
                                            {
                                                pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                message: '粉丝购买价为非负数'
                                            }
                                        ],
                                    })(
                                        <Input style={{width: '263px'}} addonAfter={'元'} onBlur={this.getAllPrice.bind(this)} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入粉丝够买价" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="基础佣金">
                                    {getFieldDecorator('profile_auth198', {
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
                                        <Input style={{width: '263px'}} addonAfter={'元'} type="number" onBlur={this.getAllPrice.bind(this)} disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入佣金总金额" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="专享佣金">
                                    {getFieldDecorator('profile_auth680', {
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
                                        <Input style={{width: '263px'}} addonAfter={'元'} onBlur={this.getAllPrice.bind(this)} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入专享佣金" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="佣金总金额">
                                    {getFieldDecorator('allPrice', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '',
                                            },
                                        ]
                                    })(
                                        <Input style={{width: '263px'}} addonAfter={'元'} type="number" placeholder="请输入佣金总金额" disabled />
                                    )}
                                </FormItem>
                                <FormItem label="皇冠购买价">
                                    {getFieldDecorator('auth198', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入皇冠购买价!',
                                            },
                                            {
                                                min: 1,
                                                max: 10,
                                                message: '请输入1—10位的皇冠购买价'
                                            },
                                            {
                                                pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                message: '皇冠购买价为非负数'
                                            }
                                        ],
                                    })(
                                        <Input style={{width: '263px'}} addonAfter={'元'} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入皇冠购买价" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="店主购买价">
                                    {getFieldDecorator('auth680', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入店主购买价',
                                            },
                                            {
                                                min: 1,
                                                max: 10,
                                                message: '请输入1—10位的店主购买价'
                                            },
                                            {
                                                pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                message: '店主购买价为非负数'
                                            }
                                        ],
                                    })(
                                        <Input style={{width: '263px'}} addonAfter={'元'} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入店主购买价" />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="店主出货价">
                                    {getFieldDecorator('auth_agent', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入店主出货价',
                                            },
                                            {
                                                min: 1,
                                                max: 10,
                                                message: '请输入1—10位的店主出货价'
                                            },
                                            {
                                                pattern: new RegExp(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, "g"),
                                                message: '店主出货价为非负数'
                                            }
                                        ],
                                    })(
                                        <Input style={{width: '263px'}} addonAfter={'元'} type="number" disabled={+state_sale===1 || disabled && !isAdd} placeholder="请输入店主出货价" />
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
                                        <LabelInfo disabled={+state_sale===1 || disabled && !isAdd} selected={selected} getSelectedLabel={this.getSelectedLabel.bind(this)} />
                                    )}
                                </FormItem>
                                <FormItem label="商品主图">
                                    <Col span={6}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            {getFieldDecorator('fileList1', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择商品主图!',
                                                    }
                                                ]
                                            })(
                                                <Upload
                                                    accept="image/*"
                                                    listType="picture-card"
                                                    disabled={+state_sale===1 || disabled && !isAdd}
                                                    fileList={fileList1}
                                                    customRequest={this.customRequest.bind(this, 1)}
                                                    beforeUpload={this.beforeUpload.bind(this, 1)}
                                                    onPreview={this.handlePreview.bind(this)}
                                                    onChange={this.handleChange.bind(this, 1)}
                                                    onRemove={this.handleRemove.bind(this, 1)}
                                                >
                                                    {fileList1.length >= 1 ? null : uploadButton}
                                                </Upload>
                                            )}
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                disabled={+state_sale===1 || disabled && !isAdd}
                                                fileList={fileList2}
                                                customRequest={this.customRequest.bind(this, 2)}
                                                beforeUpload={this.beforeUpload.bind(this, 2)}
                                                onPreview={this.handlePreview.bind(this)}
                                                onChange={this.handleChange.bind(this, 2)}
                                                onRemove={this.handleRemove.bind(this, 2)}
                                            >
                                                {fileList2.length >= 1 ? null : uploadButton}
                                            </Upload>
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                disabled={+state_sale===1 || disabled && !isAdd}
                                                fileList={fileList3}
                                                customRequest={this.customRequest.bind(this, 3)}
                                                beforeUpload={this.beforeUpload.bind(this, 3)}
                                                onPreview={this.handlePreview.bind(this)}
                                                onChange={this.handleChange.bind(this, 3)}
                                                onRemove={this.handleRemove.bind(this, 3)}
                                            >
                                                {fileList3.length >= 1 ? null : uploadButton}
                                            </Upload>
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                disabled={+state_sale===1 || disabled && !isAdd}
                                                fileList={fileList4}
                                                customRequest={this.customRequest.bind(this, 4)}
                                                beforeUpload={this.beforeUpload.bind(this, 4)}
                                                onPreview={this.handlePreview.bind(this)}
                                                onChange={this.handleChange.bind(this, 4)}
                                                onRemove={this.handleRemove.bind(this, 4)}
                                            >
                                                {fileList4.length >= 1 ? null : uploadButton}
                                            </Upload>
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                disabled={+state_sale===1 || disabled && !isAdd}
                                                fileList={fileList5}
                                                customRequest={this.customRequest.bind(this, 5)}
                                                beforeUpload={this.beforeUpload.bind(this, 5)}
                                                onPreview={this.handlePreview.bind(this)}
                                                onChange={this.handleChange.bind(this, 5)}
                                                onRemove={this.handleRemove.bind(this, 5)}
                                            >
                                                {fileList5.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        </div>
                                        <span>图片大小必须为{this.state.width}px * {this.state.height}px的矩形图片</span>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                            <img alt="example" style={{width: '100%'}} src={previewImage} />
                                        </Modal>
                                    </Col>
                                </FormItem>
                                <FormItem label="商品详情">
                                    {getFieldDecorator('fileList6', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择商品详情图!',
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            disabled={+state_sale===1 || disabled && !isAdd}
                                            fileList={fileList6}
                                            customRequest={this.customRequest.bind(this, 6)}
                                            beforeUpload={this.beforeUpload.bind(this, 6)}
                                            onPreview={this.handlePreview.bind(this)}
                                            onChange={this.handleOtherChange.bind(this)}
                                            onRemove={this.handleRemove.bind(this, 6)}
                                        >
                                            {fileList6.length >= 5 ? null : uploadButton}
                                        </Upload>
                                    )}
                                </FormItem>
                                <Row>
                                    <Col span={24} style={{textAlign: 'center'}}>
                                        <Button type="primary" style={{display: +state_sale === 2 && !isShow ? "inline-block" : 'none'}} onClick={()=>this.setState({isShow: true, disabled : false})} loading={loading}>编辑</Button>
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

/**
 * Created by smart-yc on 2019/6/5.
 */
import React, { Component } from 'react';
import {
    Card,
    Form,
    Input,
    Icon,
    Select,
    Row,
    Col,
    Checkbox,
    Radio,
    Button,
    Divider,
    Upload,
    Modal,
    DatePicker,
    PageHeader,
    AutoComplete
} from 'antd';
import { saveBannsaveOrUpdateRewardActivityerEntrance, findByRewardActivityId } from '../../../api/marketing/banner'
import { uploadImg } from '../../../api/public'
import moment from "moment";
import { getList, addOrUpdate, list, get, addOrUpdateBanner, AssList, AssDetails,AddTheme,ThemeDetails } from '../../../api/assemblyHall/index';
import { format, openNotificationWithIcon, clickCancel, disabledDate, handleImgSize } from "../../../utils";
import { verifyFile, verifyTitle } from "../../../utils/verify";
import store from "../../../store";
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: store.getState().iconFont
});
const IconFontMy = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1847331_r6fkdu8mz9.js'
});
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class AddThemeL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            // 图片上传
            previewVisible: false,
            previewImage: '',
            fileList: [],
            width: 750,
            height: 0,
            typeList: [],
            featuredList: [],
            imgSize: '1M',
            status: 0,
            disabled: false,
            title: '新增主题商品区',
            platform: "",
            isShow: "",
            bannerUrl: "",
            gpId: "",
            productId: "",
            featuredId:"",
            featuredTitle:"",
            showType:"",
            getfeaturedTitle:""
        };
    }

    // 获取横幅信息
    componentDidMount () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id, title: this.props.location.query.title }
            sessionStorage.setItem('bannerData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '主题商品区'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('bannerData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '主题商品区'
                })
                this.getAdvertInfo(params.id)
            }
        }

        AssList().then((res) => {
            console.log(res)
            this.setState({
                typeList: res.data
            })
        })

        let paramsL = {
            title: ""
        }

        getList(paramsL).then((res) => {
            // console.log(res)
            this.setState({
                featuredList: res.data
            })
        })
    }



    componentWillUnmount () {
        sessionStorage.removeItem('bannerData')
    }

    // 获取横幅信息
    getAdvertInfo (id) {
        const params = { id: id }
        const that = this
        ThemeDetails(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                console.log(data)
                // 图片处理
                console.log(data.themeImg.split('.')[1], data.themeImg)
                const index = data.themeImg.lastIndexOf('.')
                const suffix = 'image/' + data.themeImg.substring(index + 1, data.themeImg.length);
                const file = { file: { type: suffix, thumbUrl: data.themeImg } }
                if (data.status == 0 || data.status == 2) {
                    this.setState({
                        disabled: true,
                    })
                } else {
                    this.setState({
                        disabled: false,
                    })
                }
                // this.handleSelectType(data.platform)
                this.setState({
                    bannerUrl: data.bannerUrl,
                    bannerType: data.bannerType,
                    productId: data.productId,
                    platform: data.platform + "",
                    isShow:data.isShow,
                    showType:data.showType,
                    featuredTitle:data.featuredTitle,
                    featuredId:data.featuredId,

                })
                this.props.form.setFieldsValue({
                    themeTitle: data.themeTitle + '',
                    sorts: data.sorts + '',
                    themeImg: file,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')],
                    gpId: { key: data.gpId, label: data.gpId },
                    bannerType: data.bannerType,
                    featuredId: { key: data.featuredId, label: data.featuredTitle },
                    isShow:data.isShow,
                    showType:data.showType
                })
                that.setState({
                    themeImg: data.themeImg,
                    fileList: [{ uid: '-1', url: data.themeImg, status: 'done' }]
                })
                // if (data.hasOwnProperty('status')) {
                //     this.setState({
                //         disabled: false,
                //         status: data.status
                //     })
                // }
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    handleCancel = () => this.setState({ previewVisible: false });
    // 预览
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    beforeUpload = (file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        return handleImgSize(r, file, this.state.width, this.state.height, res => {
            that.setState({
                data: res
            })
        })
    };
    handleChange = ({ fileList }) => {
        this.setState({ fileList })
    }
    // 自定义上传
    customRequest = (files) => {
        const { file } = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    fileList: [{ uid: file.uid, url: res.data, status: 'done' }]
                })
                that.props.form.setFieldsValue({
                    img: that.props.form.getFieldsValue().img
                })
            }
        })
    }

    onChange = (params, e) => {
       
        this.setState({
            [params]: e.target.value
        });
    };

    async handleUpload (options) {
        const formData = new FormData()
        formData.append('file', options.file)

        let progress = { percent: 1 }


        const intervalId = setInterval(() => {
            if (progress.percent < 100) {
                progress.percent++
                options.onProgress(progress)
            } else {
                clearInterval(intervalId)
            }
        }, 100)
    }

    handleSelectPage = val => {
        console.log(val)
        this.setState({
            gpId: val.key,
        })
    }

    handleSelectPageV = val => {
        var obj = {}
       this.state.featuredList.forEach(element => {
            if(element.tipTitle == val.label ){
                obj = element
            }
        });
        this.setState({
            featuredId:obj.featuredId,
            featuredTitle:obj.featuredTitle
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {
                delete values.themeImg
                delete values.gpId
                delete values.bannerType
                delete values.featuredId
                values.startTime = parseInt(new Date(values.time[0]).getTime()/1000) 
                values.endTime =  parseInt(new Date(values.time[1]).getTime()/1000)
                values.themeImg = this.state.img
                
                const bannerId = JSON.parse(sessionStorage.getItem('bannerData'))
                let text = '新增'
                values.id = ''
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = '编辑'
                }
                let { time, ...params } = values
                
                params.gpId = this.state.gpId
                params.featuredId = this.state.featuredId
                params.featuredTitle = this.state.featuredTitle
                console.log(params)
                AddTheme(params).then((res) => {
                    if (res && res.success) {
                        openNotificationWithIcon('success', text + '主题商品区成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', text + '主题商品区失败！')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    // 样式参数
    handleInput (param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                bannerUrl: value
            })
        } else {
            this.setState({
                bannerUrl: ""
            })
        }
        this.setState({
            bannerType: 0
        })

    }
    handleInputID (param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                productId: value
            })
        } else {
            this.setState({
                productId: ""
            })
        }
        this.setState({
            bannerType: 1
        })

    }

    handleSelectType (params, val) {
        this.setState({
            [params]: val
        })
    }
    radioChange = e => {
        this.setState({
            status: e.target.value
        })
    }

    handleSelect (params, val) {
        this.setState({
            [params]: val
        })
    }
    // 校验
    compareToTitle = (rule, value, callback) => {
        const result = verifyTitle(rule, value)
        result ? callback(result) : callback()
    };
    // 校验数字
    compareToNumber = (rule, value, callback) => {
        if (value) {
            const reg = /^[1-9]\d*$/;
            reg.test(value) ? callback() : callback("请输入正整数")
        } else {
            callback('请选择或者输入优先级，数字越小优先级越大')
        }
    };
    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
        if (result) {
            callback(result)
        } else {
            if (this.state.fileList.length > 0 && this.state.fileList[0].status === 'uploading') {
                // callback('图片正在上传，请稍后')
            } else {
                callback()
            }
        }
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

        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const { getFieldDecorator } = this.props.form;
        const dataSource = ['10', '20', '30', '40', '50']
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="主题商品区" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="主题图片">
                                <div className="clearfix">
                                    {getFieldDecorator('themeImg', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择banner图片!',
                                            },
                                            {
                                                validator: this.normFile
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList}
                                            customRequest={this.customRequest}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            handleUpload={this.handleUpload}
                                            onChange={this.handleChange}>
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <span>要求：图片尺寸为750px宽度，高度不设限制；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </div>
                            </FormItem>
                            <FormItem label="主题名称">
                                {getFieldDecorator('themeTitle', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入标题!',
                                        },
                                        {
                                            // validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="中英文均视为一个字符" />
                                )}
                            </FormItem>
                            <FormItem label="前台展示标题">
                                {getFieldDecorator('isShow', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择前台展示标题!',
                                        },
                                    ],
                                })(
                                    <Col>
                                        <Radio.Group value={this.state.isShow}
                                            onChange={this.onChange.bind(this, 'isShow')}
                                            disabled={this.state.disabled}
                                        >
                                            <Radio value={1}>显示</Radio>
                                            <Radio value={0}>不显示</Radio>
                                        </Radio.Group>
                                        
                                    </Col>)}
                            </FormItem>
                            <FormItem label="起止时间">
                                {getFieldDecorator('time', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择有效期!',
                                        },
                                    ],
                                })(
                                    <RangePicker renderExtraFooter={() => '红人装'} showTime={{
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                    }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} />
                                )
                                }
                            </FormItem>

                            <FormItem label="权重">
                                {getFieldDecorator('sorts', {
                                    rules: [
                                        {
                                            required: true,
                                            validator: this.compareToNumber,
                                        }
                                    ],
                                })(
                                    <AutoComplete
                                        style={{ width: '100%' }}
                                        dataSource={dataSource}
                                        placeholder="请选择或者输入优先级，数字越小优先级越大"
                                        optionLabelProp="value"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    >
                                        <Input />} />
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem label="关联组合会场">
                                {getFieldDecorator('gpId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择组合会场!',
                                        },
                                    ],
                                })(
                                    <Select disabled={this.state.disabled} labelInValue onChange={this.handleSelectPage} style={{ width: '35rem' }} >

                                        {this.state.typeList.map(item => (
                                            <Option value={item.id} >{item.title}</Option>
                                        ))}


                                    </Select>
                                )
                                }
                            </FormItem>
                            <br/>
                            <FormItem label="商品显示样式">
                                {getFieldDecorator('showType', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择商品显示样式!',
                                        },
                                    ],
                                })(
                                    <Radio.Group onChange={this.onChange.bind(this, 'showType')} 
                                        style={{ width: '100%' ,marginTop:"2%"}}
                                    >
                                        <Col span={4} offset={2}>
                                            <Radio value={0}><IconFontMy
                                                style={{
                                                    fontSize: '60px',
                                                    position: 'absolute',
                                                    top: '-45px',
                                                    left: '-21px',
                                                    color:"#000"
                                                }}
                                                type="iconyihang" title={"一行一列"}
                                            /></Radio>
                                        </Col>
                                        <Col span={4} offset={0}>
                                            <Radio value={1}><IconFont
                                                style={{
                                                    fontSize: '50px',
                                                    position: 'absolute',
                                                    top: '-45px',
                                                    left: '-18px'
                                                }}
                                                type="icon-buju" title={"一行两列"}
                                            /></Radio>
                                        </Col>
                                        <Col span={4}>
                                            <Radio value={2}><IconFont
                                                style={{
                                                    fontSize: '50px',
                                                    position: 'absolute',
                                                    top: '-45px',
                                                    left: '-18px'
                                                }}
                                                type="icon-ai233" title={"一行三列"}
                                            /></Radio>
                                        </Col>
                                    </Radio.Group>
                                )
                                }
                            </FormItem>

                            <FormItem label="关联专场管理">
                                {getFieldDecorator('featuredId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择专场管理!',
                                        },
                                    ],
                                })(
                                    <Select showSearch disabled={this.state.disabled} labelInValue onChange={this.handleSelectPageV} style={{ width: '35rem' }} >

                                        {this.state.featuredList.map(item => (
                                            <Option value={item.tipTitle}>{item.tipTitle}</Option>)
                                        )}


                                    </Select>
                                )
                                }
                            </FormItem>


                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit">确定</Button>
                                    <Button type="default" onClick={clickCancel}>取消</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddThemeL);

export default BasicForm;

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
    Upload,
    Modal,
    DatePicker,
    PageHeader,
    AutoComplete
} from 'antd';
import { saveBannsaveOrUpdateRewardActivityerEntrance, findByRewardActivityId } from '../../../api/marketing/banner'
import { uploadImg } from '../../../api/public'
import moment from "moment";
import { getList, addOrUpdate, list, get,addOrUpdateBanner,AssList,AssDetails } from '../../../api/assemblyHall/index';
import { format, openNotificationWithIcon, clickCancel, disabledDate, handleImgSize } from "../../../utils";
import { verifyFile, verifyTitle } from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class AddBanner extends Component {
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
            imgSize: '1M',
            status: 0,
            disabled: false,
            title: '新增图片组合区',
            platform: "",
            bannerType: 0,
            bannerUrl:"",
            gpId:"",
            productId:""
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
                    title: params.title + 'banner'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('bannerData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + 'banner'
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
    }



    componentWillUnmount () {
        sessionStorage.removeItem('bannerData')
    }

    // 获取横幅信息
    getAdvertInfo (id) {
        const params = { id: id }
        const that = this
        AssDetails(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                console.log(data)
                // 图片处理
                console.log(data.bannerImg.split('.')[1], data.bannerImg)
                const index = data.bannerImg.lastIndexOf('.')
                const suffix = 'image/' + data.bannerImg.substring(index + 1, data.bannerImg.length);
                const file = { file: { type: suffix, thumbUrl: data.bannerImg } }
                if(data.status == 0 || data.status == 2){
                    this.setState({
                        disabled: true,
                    })
                }else{
                    this.setState({
                        disabled: false,
                    })
                }
                // this.handleSelectType(data.platform)
                this.setState({
                    bannerUrl:data.bannerUrl,
                    bannerType:data.bannerType,
                    productId:data.productId,
                    platform:data.platform+""
                })
                this.props.form.setFieldsValue({
                    bannerTitle: data.bannerTitle + '',
                    sorts: data.sorts + '',
                    bannerImg: file,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')],
                    gpId: {key:data.gpId,label: data.gpId},
                    bannerType:data.bannerType
                })
                that.setState({
                    bannerImg: data.bannerImg,
                    fileList: [{ uid: '-1', url: data.bannerImg, status: 'done' }]
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
            bannerUrl: "",
            productId: "",
            platform: ""
        });
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
            gpId:val.key,
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {
                delete values.bannerImg
                delete values.gpId
                delete values.bannerType
                values.startTime = new Date(values.time[0]).getTime()
                values.endTime = new Date(values.time[1]).getTime()
                values.bannerImg = this.state.img
                // 对状态处理
                if (!this.state.disabled) {
                    values.status = this.state.status
                }
                const bannerId = JSON.parse(sessionStorage.getItem('bannerData'))
                let text = '新增'
                values.id = ''
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = '编辑'
                }
                let { time, ...params } = values
               
                params.bannerUrl = this.state.bannerUrl
                params.bannerType = this.state.bannerType
                params.productId = this.state.productId
                params.platform = this.state.platform
                params.gpId = this.state.gpId
                console.log(params)
                addOrUpdateBanner(params).then((res) => {
                    if (res && res.success) {
                        openNotificationWithIcon('success', text + '组合会场banner成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', text + '组合会场banner失败！')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    // 样式参数
    handleInput(param, event) {
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
    handleInputID(param, event) {
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

    handleSelectType(params, val) {
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
                <PageHeader onBack={clickCancel} title="图片组合区" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="模块">
                                <div className="clearfix">
                                    {getFieldDecorator('bannerImg', {
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
                                <Col>
                                        <Radio.Group value={this.state.bannerType}
                                            onChange={this.onChange.bind(this, 'bannerType')}
                                            disabled={this.state.disabled}
                                        >
                                            <Radio value={0}>关联网页</Radio>
                                            <Radio value={1}>平台</Radio>
                                        </Radio.Group>
                                        <Input placeholder="关联网页" disabled={this.state.disabled} style={{ display: +this.state.bannerType === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl} onChange={this.handleInput.bind(this, "bannerUrl")} />
                                        <Select placeholder="请选择平台" disabled={this.state.disabled} style={{ display: +this.state.bannerType === 1 ? "block" : "none", width: '33%' }}
                                          value={this.state.platform} 
                                          onChange={this.handleSelectType.bind(this, "platform")}
                                        >
                                            <Option key="2" value="2">淘宝</Option>
                                            <Option key="3" value="3">京东</Option>
                                            <Option key="7" value="7">拼多多</Option>
                                            <Option key="4" value="4">唯品会</Option>

                                        </Select> 
                                        <Input placeholder="请输入商品ID" disabled={this.state.disabled} style={{ display: +this.state.bannerType === 1 ? "block" : "none", width: '33%' , marginTop: "1.5%"}}value={this.state.productId} onChange={this.handleInputID.bind(this, "productId")} />
                                       
                                    </Col>
                            </FormItem>

                            <FormItem label="标题">
                                {getFieldDecorator('bannerTitle', {
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

const BasicForm = Form.create()(AddBanner);

export default BasicForm;

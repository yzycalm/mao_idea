/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Icon, Select, Row, Col, Checkbox, Radio, Button, Upload, Modal, DatePicker, AutoComplete,PageHeader} from 'antd';
import moment from 'moment';
import {saveBannerEntrance, findBannerEntrance} from '../../../api/marketing/generalize'
import {uploadImg} from '../../../api/public'
import {format, handleImgSize, openNotificationWithIcon, clickCancel, disabledDate} from '../../../utils/index'
import {resourceOptions, getResourceOptions, getWidthAndHeigth} from '../../../utils/marketing'
import {verifyTitle, verifyFile} from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

class Advertising extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            // 图片上传
            previewVisible: false,
            previewImage: '',
            fileList: [],
            type: resourceOptions,
            width: 750,
            height: 364,
            imgSize: '1M',
            resourceName: '',
            status: 0,
            disabled: true,
            img: '',
            data: {},
            formItemStatus: {
                titleStatus: ''
            },
            title: '新增广告',
            loading: false,
            isShow: false,
            isPhones: true
        };
    }

    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('advertData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '广告'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('advertData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '广告'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('advertData')
    }

    // 获取广告信息
    getAdvertInfo(id) {
        const params = {id: id}
        const that = this
        findBannerEntrance(params).then((res) => {
            if (res.success) {
                const data = res.data
                // 图片处理
                console.log(data.img.split('.')[1], data.img)
                const index = data.img.lastIndexOf('.')
                const suffix = 'image/' + data.img.substring(index + 1, data.img.length);
                const file = {file: {type: suffix, thumbUrl: data.img}}
                this.props.form.setFieldsValue({
                    url: data.url + '',
                    title: data.title + '',
                    type: data.type + '',
                    place: data.place + '',
                    sysType: data.sysType + '',
                    sequence: data.sequence + '',
                    bannerBgColor: data.bannerBgColor,
                    phones: data.phones,
                    img: file,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                data.type === 'banner' ? this.setState({isShow: true}) : this.setState({isShow: false})

                // 根据展示位置页面确定是否显示手机白名单
                if (data.place == 4) {
                    this.setState({isPhones: false})
                } else if (data.place == 3) {
                    this.setState({isPhones: false})
                } else if (data.place == 9) {
                    this.setState({isPhones: false})
                } else {
                    this.setState({isPhones: true})
                }

                const result = getWidthAndHeigth(data.type)
                this.setState({
                    width: result.width,
                    height: result.height,
                    resourceName: data.type
                })
                that.setState({
                    img: data.img,
                    fileList: [{uid: '-1', url: data.img, status: 'done'}],
                })
                if(data.hasOwnProperty('status')) {
                    this.setState({
                        disabled: false,
                        status: data.status
                    })
                }
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    handleCancel = () => this.setState({previewVisible: false});
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
        return  handleImgSize(r, file, this.state.width, this.state.height, res => {
            that.setState({
                data: res
            })
        })
    };
    handleChange = ({fileList}) => {
        this.setState({fileList})
    }
    // 自定义上传
    customRequest = (files) => {
        const {file} = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    fileList: [{uid: file.uid, url: res.data, status: 'done'}]
                })
                that.props.form.setFieldsValue({
                    img: that.props.form.getFieldsValue().img
                })
            }
        })
    }
    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true}, () => {
                    values.startTime = new Date(values.time[0]).getTime()
                    values.endTime = new Date(values.time[1]).getTime()
                    values.img = this.state.img
                    // 对状态处理
                    if(!this.state.disabled) {
                        values.status = this.state.status
                    }
                    const bannerId = JSON.parse(sessionStorage.getItem('advertData'))
                    let text = '新增'
                    values.id = ''
                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                        text = '编辑'
                    }
                    let {time, ...params} = values
                    // 新增
                    saveBannerEntrance(params).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', text + '广告成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => { openNotificationWithIcon('error', text + '广告失败！')})
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    // 选择页面
    handleSelectPage = val => {
        this.props.form.setFieldsValue({
            type: ''
        })
        const result = getResourceOptions(val)

        // 根据不同的页面选择是否显示白名单
        if (val == 4) {
            this.setState({isPhones: false})
        } else if (val == 3) {
            this.setState({isPhones: false})
        } else if (val == 9) {
            this.setState({isPhones: false})
        } else {
            this.setState({isPhones: true})
        }
        

        this.setState({
            type: result,
            resourceName: ''
        })
    }
    // 选择资源位
    handleSelectResource = val => {
        const result = getWidthAndHeigth(val)
        val === 'banner' ? this.setState({isShow: true}) : this.setState({isShow: false})
        this.setState({
            width: result.width,
            height: result.height,
            resourceName: val
        })
    }
    // 选择系统
    handleSysType = val => {
        this.props.form.setFieldsValue({
            sysType: val
        })
    }
    // 多选和单选
    checkChange = e => {
        this.setState({
            disabled: !this.state.disabled,
        });
    }
    radioChange = e => {
        console.log(e.target.value)
        this.setState({
            status: e.target.value
        })
    }
    // 校验
    compareToTitle = (rule, value, callback) => {
        const result = verifyTitle(rule, value)
        if(result) {
            callback(result)
        } else {
            if(this.state.fileList.length > 0 && this.state.fileList[0].status === 'uploading') {
                callback('图片正在上传，请稍后')
            } else {
                callback()
            }
        }
    };
    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
        result ? callback(result) : callback()
    };
    // 禁止选中
    disabledDate(current) {
        return current < moment().subtract(1, "days")
    }
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
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const dataSource = ['10', '20', '30', '40', '50']

        const {getFieldDecorator} = this.props.form;
        const loading = this.state.loading
        const isShow = this.state.isShow
        const isPhones = this.state.isPhones
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="资源位管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="页面">
                                {getFieldDecorator('place', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择页面!',
                                        },
                                    ],
                                })(
                                    <Select placeholder="请选择页面" onChange={this.handleSelectPage}>
                                        <Option value="1">首页</Option>
                                        <Option value="4">商品详情页</Option>
                                        <Option value="3">我的页面</Option>
                                        <Option value="6">我的收益页</Option>
                                        <Option value="5">悬浮窗</Option>
                                        <Option value="2">启动页</Option>
                                        <Option value="9">搜索页</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="资源位名称">
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择资源位名称!',
                                        },
                                    ]
                                })(
                                    <Select placeholder="请选择资源位名称"
                                            onChange={this.handleSelectResource.bind(this)}>
                                        {this.state.type.map(item => {
                                            return <Option key={item.title} value={item.value}>{item.title}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="banner背景颜色" style={{display: isShow ? 'block' : 'none'}}>
                                {getFieldDecorator('bannerBgColor', {
                                    rules: [
                                        {
                                            required: isShow,
                                            message: '输入banner颜色!',
                                        },
                                    ]
                                })(
                                    <Input placeholder="例：#FFFFFF"/>
                                )}
                            </FormItem>
                            <FormItem label="广告名称">
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入广告名称!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于12个字符，中英文均视为一个字符"/>
                                )}
                            </FormItem>
                            <FormItem label="优先级">
                                {getFieldDecorator('sequence', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择优先级!',
                                        },
                                    ],
                                })(
                                    <AutoComplete
                                        style={{width: '100%'}}
                                        dataSource={dataSource}
                                        placeholder="请输入或者选择优先级"
                                        optionLabelProp="value"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    >
                                        <Input/>} />
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem label="系统">
                                {getFieldDecorator('sysType', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择系统!',
                                        },
                                    ],
                                })(
                                    <Select placeholder="请选择系统">
                                        <Option value="2">ios</Option>
                                        <Option value="1">安卓</Option>
                                        <Option value="0">ios/安卓</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="广告链接">
                                {getFieldDecorator('url', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入广告链接!',
                                        },
                                    ],
                                })(
                                    <TextArea rows={4}/>
                                )
                                }
                                <Checkbox onChange={this.checkChange.bind(this)} checked={!this.state.disabled}>该链接是H5页面</Checkbox>
                                <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.status} disabled={this.state.disabled}>
                                    <Radio defaultChecked
                                           value={0}>显示分享按钮</Radio>
                                    <Radio value={1}>显示刷新按钮</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="广告图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img', {
                                        rules: [
                                            {
                                                required: true,
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
                                            onChange={this.handleChange}>
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                </div>
                                <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                </Modal>
                            </FormItem>
                            <FormItem label="有效期">
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
                            <FormItem label="测试用户" style={{display: isPhones ? 'block' : 'none'}}>
                                {getFieldDecorator('phones', {})(
                                    <Input placeholder="请输入测试用户手机号(多个使用中文、分割)" />
                                )}
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Button type="primary" htmlType="submit" loading={loading} >确定</Button>
                                    <Button type="default"  onClick={clickCancel}>取消</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(Advertising);

export default BasicForm;

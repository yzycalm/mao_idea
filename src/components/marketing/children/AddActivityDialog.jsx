/**
 * Created by smart-yc on 2019/6/5.
 */
import React, {Component} from 'react';
import {Card, Form, Input, Icon, Select, Row, Col, Checkbox, Radio, Button, Upload, Modal, DatePicker,PageHeader} from 'antd';
import { addOrUpdatePopup, findPopupById } from '../../../api/marketing/activity'
import { uploadImg } from '../../../api/public'
import moment from "moment";
import {format, openNotificationWithIcon, clickCancel, disabledDate, handleImgSize} from "../../../utils/index";
import {verifyFile, verifyTitle} from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

class AddActivityDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            // 图片上传
            previewVisible: false,
            previewImage: '',
            fileList: [],
            width: 0,
            height: 0,
            imgSize: '1M',
            status: 0,
            disabled: true,
            title: '新增活动弹窗',
            loading: false
        };
    }
    // 获取活动弹窗信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('activityData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '活动弹窗'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('activityData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '活动弹窗'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('activityData')
    }

    // 获取活动弹窗信息
    getAdvertInfo(id) {
        const params = {id: id}
        const that = this
        findPopupById(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                // 图片处理
                const index = data.img.lastIndexOf('.')
                const suffix = 'image/' + data.img.substring(index + 1, data.img.length);
                const file = {file: {type: suffix, thumbUrl: data.img}}
                this.props.form.setFieldsValue({
                    url: data.url + '',
                    name: data.name + '',
                    type: data.type + '',
                    place: data.place + '',
                    sysType: data.sysType + '',
                    sequence: data.sequence + '',
                    phones: data.phones + '',
                    img: file,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                that.setState({
                    img: data.img,
                    fileList: [{uid: '-1', url: data.img, status: 'done'}]
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
        this.setState({fileList: fileList})
        console.log(this.state.fileList)
    }
    // 自定义上传
    customRequest = (files) => {
        console.log(files, this.state.data)
        const { file } = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if(res && res.success) {
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
    async handleUpload (options) {
        const formData = new FormData()
        formData.append('file', options.file)

        let progress = {percent: 1}


        const intervalId = setInterval(() => {
            if (progress.percent < 100) {
                progress.percent++
                options.onProgress(progress)
            } else {
                clearInterval(intervalId)
            }
        }, 100)
    }
    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loaidng: true}, () => {
                    values.startTime = new Date(values.time[0]).getTime()
                    values.endTime = new Date(values.time[1]).getTime()
                    values.img = this.state.img
                    // 对状态处理
                    if(!this.state.disabled) {
                        values.status = this.state.status
                    }
                    const bannerId = JSON.parse(sessionStorage.getItem('activityData'))
                    let text = '新增'
                    values.id = ''
                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                        text = '编辑'
                    }
                    let {time, ...params} = values
                    addOrUpdatePopup(params).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', text + '活动弹窗成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => {openNotificationWithIcon('error', text + '活动弹窗失败！')})
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    // 多选和单选
    checkChange = e => {
        this.setState({
            disabled: !this.state.disabled,
        });
    }
    radioChange = e => {
        this.setState({
            status: e.target.value
        })
    }
    // 校验
    compareToTitle = (rule, value, callback) => {
        const result = verifyTitle(rule, value)
        result ? callback(result) : callback()
    };
    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
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
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="活动弹窗管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="活动弹窗标题">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入活动弹窗标题!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于12个字符，中英文均视为一个字符"/>
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
                            <FormItem label="活动弹窗链接">
                                {getFieldDecorator('url', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入活动弹窗链接!',
                                        },
                                    ],
                                })(
                                    <TextArea rows={4} />
                                )
                                }
                                <Checkbox onChange={this.checkChange.bind(this)} checked={!this.state.disabled}>该链接是H5页面</Checkbox>
                                <RadioGroup onChange={this.radioChange.bind(this)} value={this.state.status} disabled={this.state.disabled}>
                                    <Radio value={0}>显示分享按钮</Radio>
                                    <Radio value={1}>显示刷新按钮</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="活动弹窗图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择活动弹窗图片!',
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
                                    <span>要求：全屏，根据信息展示（无尺寸限制）；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                        <img alt="example" style={{width: '100%'}} src={previewImage} />
                                    </Modal>
                                </div>
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
                                    }} format="YYYY-MM-DD HH:mm:ss"   disabledDate={disabledDate} />
                                )
                                }
                            </FormItem>
                            <FormItem label="测试用户">
                                {getFieldDecorator('phones', {})(
                                    <Input placeholder="请输入测试用户手机号(多个使用中文、分割)"/>
                                )}
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Button type="primary" htmlType="submit" >确定</Button>
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

const BasicForm = Form.create()(AddActivityDialog);

export default BasicForm;

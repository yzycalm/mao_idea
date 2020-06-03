/*
 * @Author: songyingchun
 * @Date: 2020-04-15 18:41:19
 * @Description: 集成友盟消息推送
 */

import React, { Component } from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Card, Form, Input, Row, Col, Radio, Button, DatePicker, Select, Upload, Icon, Modal, Checkbox } from 'antd';
import { sendMessage } from '../../api/messageCenter/messageCenter'
import { uploadImg } from '../../api/public'
import { openNotificationWithIcon, handleImgSquare, getContent } from "../../utils";
import { verifyFile } from "../../utils/verify";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { emojis } from "../share/common/Emojis";
import draftToHtml from 'draftjs-to-html';
import moment from 'moment'

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
class AddSeeker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            fileList: [],
            previewVisible: false,
            previewImage: '',
            editorState: '',
            editorContent: ''
        };
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
        return handleImgSquare(r, file, res => {
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
    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
        if (result) {
            callback(result)
        } else {
            if (this.state.fileList.length > 0 && this.state.fileList[0].status === 'uploading') {
                callback('图片正在上传，请稍后')
            } else {
                callback()
            }
        }
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
    // 限制日期选择一个礼拜以内
    disabledDate (current) {
        return current < moment().subtract(1, "days") || current > moment().add(6, "days")
    }
    // 单选
    onChange = e => {
        if (e.target.value === 0) {
            // 立即推送
            this.props.form.setFields({
                endTime: {
                    value: moment().add(3, "days")
                }
            });
        } else {
            // 定时推送
            this.props.form.setFields({
                startTime: {
                    value: moment(new Date())
                },
                endTime: {
                    value: moment().add(2, "days")
                }
            });
        }
    }
    // 内容
    onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });
    };
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    compareToContent = (rule, value, callback) => {
        let result
        if (typeof value === 'string' && value.indexOf("<") !== -1) {
            result = getContent(value)
        } else {
            const rsp = draftToHtml(value)
            result = getContent(rsp)
        }
        if (result.length > 400) {
            callback('最多支持400个字符')
        } else {
            callback()
        }
    };
    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true }, () => {
                    if (values.sendType === 1) {
                        values.startTime = new Date(values.startTime).getTime()
                    } else {
                        // 立即推送时，开始时间为null
                        values.startTime = null
                    }
                    delete values.sendType
                    const rsp = draftToHtml(values.content)
                    values.content = getContent(rsp)
                    values.img = this.state.fileList.length > 0 ? this.state.fileList[0].url : ''
                    values.endTime = new Date(values.endTime).getTime()
                    // 判断开始时间和接收设备时间
                    if (values.endTime <= values.startTime) {
                        this.props.form.setFields({
                            endTime: {
                                value: null,
                                errors: [new Error(' 结束时间需晚于开始时间')],
                            },
                        });
                        this.setState({ loading: false })
                        return
                    }
                    // 判断目标人群
                    if (values.type === 1) { // 独立用户不需要传递开始结束参数
                        values.startTime = ''
                        values.endTime = ''
                    }
                    let { time, ...params } = values
                    sendMessage(params).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '已成功创建推送任务，请在友盟后台查看详情')
                            this.setState({ loading: false })
                        } else {
                            this.setState({ loading: false }, () => { openNotificationWithIcon('error', res.message) })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 21 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };


        const { getFieldDecorator } = this.props.form;
        const { fileList, previewImage, previewVisible } = this.state
        const loading = this.state.loading
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const options = [
            { label: '红人装V3.X 安卓', value: 0 },
            { label: '红人装V3.X iOS', value: 3 },
            { label: '红人装极速版 安卓', value: 1 },
            { label: '红人装极速版 iOS', value: 2 }
        ]
        const { editorContent, editorState } = this.state;
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="推送管理" />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <h3>1，编辑消息内容</h3>
                            <FormItem label="任务描述">
                                {getFieldDecorator('describe', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入任务描述',
                                        }, {
                                            min: 1,
                                            max: 70,
                                            message: '最多支持70个字符'
                                        }
                                    ],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem label="标题">
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入标题',
                                        },
                                        {
                                            min: 1,
                                            max: 100,
                                            message: '最多支持100个字符'
                                        }
                                    ],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem label="内容">
                                {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入内容',
                                        }, {
                                            validator: this.compareToContent,
                                        }
                                    ],
                                })(
                                    <Editor
                                        editorState={editorState}
                                        initialContentState={editorContent}
                                        toolbarClassName="home-toolbar"
                                        wrapperClassName="home-wrapper"
                                        editorClassName="home-editor"
                                        onEditorStateChange={this.onEditorStateChange}
                                        toolbar={{
                                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
                                            history: { inDropdown: true },
                                            inline: { inDropdown: false },
                                            list: { inDropdown: true },
                                            textAlign: { inDropdown: true },
                                            emoji: emojis()
                                        }}
                                        onContentStateChange={this.onEditorChange}
                                        spellCheck
                                        localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                    />
                                )}
                            </FormItem>
                            <FormItem label="图片">
                                {getFieldDecorator('img', {
                                    rules: [
                                        {
                                            required: false,
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
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                                <span> 可选。仅支持安卓机型显示，图片须为正方形。支持jpg、gif、png格式 ）</span>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </FormItem>
                            <FormItem label="选择推送任务">
                                {getFieldDecorator('flag', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '选择推送任务',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="GP0001">淘宝商品推送-GP0001</Option>
                                        <Option value="GP0002">京东商品推送-GP0002</Option>
                                        <Option value="GP0003">唯品会商品推送-GP0003</Option>
                                        <Option value="GP0004">拼多多商品推送-GP0004</Option>
                                        <Option value="GP0005">H5跳转推送-GP0005</Option>
                                        <Option value="GP0006">我的收益推送-GP0006</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="值">
                                {getFieldDecorator('value', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入消息推送名词!',
                                        }, {
                                            min: 1,
                                            max: 400,
                                            message: '最多支持400个字符'
                                        }
                                    ],
                                })(
                                    <TextArea rows={4} />
                                )}
                            </FormItem>
                            <h3>2，选择目标人群</h3>
                            <FormItem label="目标人群">
                                <FormItem >
                                    {getFieldDecorator('type', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择目标人群',
                                            }
                                        ],
                                    })(
                                        <RadioGroup>
                                            <Radio value={0}>全部用户</Radio>
                                            <Radio value={1}>独立用户</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem >
                                    {getFieldDecorator('target', {
                                        rules: [
                                            {
                                                required: this.props.form.getFieldsValue().type === 1,
                                                message: '请输入推送目标',
                                            }
                                        ],
                                    })(
                                        <Input style={{ width: '350px', display: this.props.form.getFieldsValue().type === 1 ? 'block' : 'none' }} placeholder="极速版填手机号，旧版填token；多个号使用 | 分割" />
                                    )}
                                    <p style={{ display: this.props.form.getFieldsValue().type === 1 ? 'block' : 'none' }}>注：同一次推送只能选一种类型，即填token或手机号</p>
                                </FormItem>
                            </FormItem>
                            <FormItem label="推送时间" style={{ display: this.props.form.getFieldsValue().type === 0 ? 'block' : 'none' }}>
                                <FormItem >
                                    {getFieldDecorator('sendType', {
                                        rules: [
                                            {
                                                required: this.props.form.getFieldsValue().type === 0,
                                                message: '请选择推送时间',
                                            }
                                        ],
                                    })(
                                        <RadioGroup onChange={this.onChange.bind(this)}>
                                            <Radio value={0}>立即推送</Radio>
                                            <Radio value={1}>定时推送</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem >
                                    {getFieldDecorator('startTime', {
                                        rules: [
                                            {
                                                required: this.props.form.getFieldsValue().sendType === 1 && this.props.form.getFieldsValue().type === 0,
                                                message: '请选择推送时间',
                                            }
                                        ],
                                    })(
                                        <DatePicker disabledDate={this.disabledDate.bind(this)} style={{ width: '250px', display: this.props.form.getFieldsValue().sendType === 1 ? 'block' : 'none' }} showTime />
                                    )}
                                </FormItem>
                            </FormItem>
                            <FormItem label="接收设备" style={{ display: this.props.form.getFieldsValue().type === 0 ? 'block' : 'none' }}>
                                {getFieldDecorator('endTime', {
                                    rules: [
                                        {
                                            required: this.props.form.getFieldsValue().type === 0,
                                            message: '请输入接收设备',
                                        }
                                    ],
                                })(
                                    <DatePicker disabledDate={this.disabledDate.bind(this)} showTime />
                                )}
                                <span> &nbsp;之前在线设备可接受到消息</span>
                            </FormItem>
                            <h3>3，请选择目标版本</h3>
                            <FormItem >
                                <Col offset={4}>
                                    <FormItem >
                                        {getFieldDecorator('version', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择目标版本',
                                                }
                                            ],
                                        })(
                                            <Checkbox.Group options={options} />
                                        )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit" loading={loading}>完成</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddSeeker);

export default BasicForm;

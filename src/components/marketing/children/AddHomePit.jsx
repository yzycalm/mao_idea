/**
 * Created by smart-yc on 2019/6/5.
 */
import React, {Component} from 'react';
import {Card, Form, Input, Icon, Select, Row, Col, Button, Upload, Modal, DatePicker, PageHeader} from 'antd';
import {savePit, findInfo} from '../../../api/marketing/homePit'
import {uploadImg} from '../../../api/public'
import moment from "moment";
import {format, openNotificationWithIcon, clickCancel, disabledDate, handleImgSize} from "../../../utils";
import {verifyFile} from "../../../utils/verify";

const {confirm} = Modal
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

class AddBanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            // 图片上传
            previewVisible: false,
            previewImage: '',
            fileList: [],
            width: 350,
            height: 566,
            imgSize: '1M',
            title: '新增活动坑位'
        };
    }

    // 获取活动坑位信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('bannerData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: '编辑活动坑位'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('bannerData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: '编辑活动坑位'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('bannerData')
    }

    // 获取活动坑位信息
    getAdvertInfo(id) {
        const params = {id: id}
        const that = this
        findInfo(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                // 图片处理
                console.log(data.img.split('.')[1], data.img)
                const index = data.img.lastIndexOf('.')
                const suffix = 'image/' + data.img.substring(index + 1, data.img.length);
                const file = {file: {type: suffix, thumbUrl: data.img}}
                this.props.form.setFieldsValue({
                    url: data.url + '',
                    title: data.title + '',
                    platform: data.platform + '',
                    img: file,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                that.setState({
                    img: data.img,
                    fileList: [{uid: '-1', url: data.img, status: 'done'}]
                })
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
        return handleImgSize(r, file, this.state.width, this.state.height, res => {
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

    async handleUpload(options) {
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
                values.startTime = new Date(values.time[0]).getTime()
                values.endTime = new Date(values.time[1]).getTime()
                values.img = this.state.img
                const bannerId = JSON.parse(sessionStorage.getItem('bannerData'))
                let text = '新增'
                values.id = ''
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = '编辑'
                }
                let {time, ...params} = values
                savePit(params).then((res) => {
                    if (res && res.success) {
                        openNotificationWithIcon('success', '已成功保存')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', '保存失败')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    handleBack() {
        if (this.props.form.getFieldsValue().title) {
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
        } else {
            clickCancel()
        }
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
                <PageHeader onBack={clickCancel} title="活动坑位管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="平台">
                                {getFieldDecorator('platform', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择平台!',
                                        },
                                    ],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="活动坑位名称">
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入活动坑位名称!',
                                        }
                                    ],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem label="跳转链接">
                                {getFieldDecorator('url', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入跳转链接!',
                                        },
                                    ],
                                })(
                                    <TextArea rows={4}/>
                                )
                                }
                            </FormItem>
                            <FormItem label="广告图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择广告图片!',
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
                                    <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                    </Modal>
                                </div>
                            </FormItem>
                            <FormItem label="展示时间段">
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
                                    }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate}/>
                                )
                                }
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Button type="primary" htmlType="submit">确定</Button>
                                    <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
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

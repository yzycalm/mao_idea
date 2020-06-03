/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Icon, Row, Col, Button, Upload, Modal, DatePicker,PageHeader} from 'antd';
import moment from 'moment';
import {uploadImg} from '../../../api/public'
import {format, handleImgSize, openNotificationWithIcon, clickCancel, disabledDate} from '../../../utils/index'
import {handlePosterInfo} from '../../../api/application/poster'
import {verifyTitle, verifyFile} from "../../../utils/verify";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const { confirm } = Modal

class AddPoster extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id:'',
            img: '',
            operator: '',
            sequence: '',
            startTime: '',
            endTime: '',
            title: '',
            loadingFinish: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            popTitle: '新增海报',
            loading: false,
            confirmDirty: false,
            width: 750,
            height: 1334,
            resourceName: '',
            data: {},
            
        };
    }

    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.detail) {
            params = JSON.parse(this.props.location.query.detail)
            sessionStorage.setItem('posterData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    popTitle: '编辑海报',
                    loadingFinish: true
                })
                this.getPosterInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('posterData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    popTitle: '编辑海报',
                    loadingFinish: true
                })
                this.getPosterInfo(params)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('posterData')
    }

    // 获取海报信息
    getPosterInfo(data) {
        // 图片处理
        const index = data.img.lastIndexOf('.')
        const suffix = 'image/' + data.img.substring(index + 1, data.img.length);
        const file = {file: {type: suffix, thumbUrl: data.img}}
        this.props.form.setFieldsValue({
            title: data.title,
            sequence: data.sequence,
            img: file,
            time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
        })
        this.setState({
            img: data.img,
            fileList: [{uid: '-1', url: data.img, status: 'done'}],
        })
        if(data.hasOwnProperty('status')) {
            this.setState({
                disabled: false
            })
        }
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
        console.log(fileList)
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
                    values.startTime = parseInt(new Date(values.time[0]).getTime() /1000) 
                    values.endTime = parseInt(new Date(values.time[1]).getTime() /1000) 
                    values.img = this.state.img
                    const userInfo = JSON.parse(localStorage.getItem('user'))
                    const sequence = parseInt(values.sequence) 
                    values.sequence = sequence
                    values.operator = userInfo.userName
                    const posterData = JSON.parse(sessionStorage.getItem('posterData'))
                    let text = '新增'
                    values.id = ''
                    if (posterData && posterData.id) {
                        values.id = posterData.id
                        text = '编辑'
                    }
                    let {time, ...params} = values
                    // 新增
                    handlePosterInfo(params).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', text + '海报成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => { openNotificationWithIcon('error', text + '海报失败！')})
                        }
                    })
                })
            } else {
                console.log(this.state.img)
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    handleBack () {
        const data = this.props.form.getFieldsValue()
        if (data.img || data.sequence || data.time || data.title) {
            confirm({
                title: '提示',
                content: '你还未保存信息，确认取消保存吗？',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                onOk () {
                    clickCancel()
                },
                onCancel () {
                },
            });
        } else {
            clickCancel()
        }
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
    // 校验数字
    compareToNumber = (rule, value, callback) => {
        if(value) {
            const reg = /^[1-9]\d*$/;
            reg.test(value) ? callback() : callback("请输入正整数")
        } else {
            callback('仅支持数字类型,数字越小优先级越大')
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

        const {getFieldDecorator} = this.props.form;
        const loading = this.state.loading
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="海报推广" subTitle={this.state.popTitle} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="海报名称">
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            max: 50,
                                            required: true,
                                            message: '字符长度为0-50位字符!',
                                        },
                                    ],
                                })(
                                    <Input placeholder="字符长度为0-50位字符" />
                                )}
                            </FormItem>
                            <FormItem label="排序">
                                {getFieldDecorator('sequence', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '仅支持数字类型!',
                                        },
                                        {
                                            validator: this.compareToNumber,
                                        }
                                    ],
                                })(
                                    <Input placeholder="仅支持数字类型"/>
                                )}
                            </FormItem>
                            <FormItem label="海报图">
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
                                <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；支持JPG、JPEG、GIF、PNG格式</span>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                </Modal>
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
                                    }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} />
                                )
                                }
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
                                    <Button type="primary" htmlType="submit" loading={loading} >确定</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddPoster);

export default BasicForm;

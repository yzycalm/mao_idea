/**
 * Created by Yzy on 2020/4/9.
 */
import React, {Component} from 'react';
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
import {saveoreditBottom,findByRewardActivityIdBottom} from '../../../api/marketing/bottomMsg'
import moment from "moment";
import {format, openNotificationWithIcon, clickCancel, disabledDate} from "../../../utils";
import {verifyFile, verifyTitleBottom} from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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
            width: 750,
            height: 210,
            status: 0,
            disabled: true,
            title: '新增底部消息条'
        };
    }

    // 获取横幅信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('bannerData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '底部消息条'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('bannerData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '底部消息条'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('bannerData')
    }

    // 获取底部消息条信息
    getAdvertInfo(id) {
        const params = {id: id}
        const that = this
        findByRewardActivityIdBottom(params).then((res) => {
            if (res && res.success) {
                const data = res.data
              
              
                this.props.form.setFieldsValue({
                    url: data.url? data.url + '' : "",
                    message: data.message + '',
                    type: data.type + '',
                    place: data.place + '',
                    sysType: data.sysType + '',
                    sequence: data.sequence + '',
                    serialNumber: data.serialNumber + '',
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                if (data.hasOwnProperty('status')) {
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
    
    handleChange = ({fileList}) => {
        this.setState({fileList})
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
                let {time, ...params} = values
                saveoreditBottom(params).then((res) => {
                    if (res && res.success) {
                        openNotificationWithIcon('success', text + '底部消息条成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', text + '底部消息条失败！')
                    }
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
        const result = verifyTitleBottom(rule, value)
        result ? callback(result) : callback()
    };
    // 校验数字
    compareToNumber = (rule, value, callback) => {
        if(value) {
            const reg = /^[0-9]\d*$/;
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
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        const dataSource = ['10', '20', '30', '40', '50']
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="底部消息条管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="消息条内容">
                                {getFieldDecorator('message', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入横幅标题!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于50个字符，中英文均视为一个字符" />
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
                                    <TextArea rows={4} />
                                )
                                }
                            </FormItem>
                            <FormItem label="优先级">
                                {getFieldDecorator('serialNumber', {
                                    rules: [
                                        {
                                            required: true,
                                            validator: this.compareToNumber,
                                        }
                                    ],
                                })(
                                    <AutoComplete
                                        style={{width: '100%'}}
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
                                    }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate}
                                    />
                                )
                                }
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
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

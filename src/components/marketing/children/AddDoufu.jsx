/**
 * Created by smart-yc on 2019/6/5.
 */
import React, {Component} from 'react';
import {Card, Form, Input, Icon, Select, Row, Col, Button, Upload, Divider, Modal, DatePicker, AutoComplete, PageHeader} from 'antd';
import {saveOrUpdateBeanCurd, findActivityBlockByFlag} from '../../../api/marketing/doufu'
import {uploadImg} from '../../../api/public'
import moment from "moment";
import {format, handleImg, openNotificationWithIcon, clickCancel, disabledDate, handleImgSize} from "../../../utils/index";
import {handleParams} from "../../../utils/marketing";
import {verifyTitle, verifyFile} from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

class AddDoufu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            // 图片上传
            previewVisible0: false,
            previewVisible1: false,
            previewVisible2: false,
            previewVisible3: false,
            previewImage0: '',
            previewImage1: '',
            previewImage2: '',
            previewImage3: '',
            fileList0: [],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            img0: '',
            img1: '',
            img2: '',
            img3: '',
            width: 375,
            height: 360,
            imgSize: '1M',
            disabled0: true,
            disabled1: true,
            disabled2: true,
            disabled3: true,
            status0: 0,
            status1: 0,
            status2: 0,
            status3: 0,
            title: '新增豆腐块',
            flag: '',
            doufuLength: 4,
            loading: false,
            detail: []
        }

    }

    // 获取豆腐块信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('doufuData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '豆腐块',
                    flag: params.id
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('doufuData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '豆腐块',
                    flag: params.id
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('doufuData')
    }

    // 获取豆腐块信息
    getAdvertInfo(flagId) {
        const params = {flag: flagId}
        const that = this
        findActivityBlockByFlag(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    detail: data
                })
                // 图片处理
                this.props.form.setFieldsValue({
                    sequence: data[0].sequence + '',
                    sysType: data[0].sysType + '',
                    time: [moment(format(data[0].startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data[0].endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                for (let i = 0; i < this.state.doufuLength; i++) {
                    this.props.form.setFieldsValue({
                        ['url' + i]: data[i].url + '',
                        ['title' + i]: data[i].title + '',
                        ['img' + i]: handleImg(data[i])
                    })
                    that.setState({
                        ['img' + i]: data[i].img,
                        ['fileList' + i]: [{uid: '-1', url: data[i].img, status: 'done'}],
                    })
                }
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    handleCancel = (i) => {
        this.setState({
            ['previewVisible' + i]: false
        });
    }
    // 预览
    handlePreview = (i, file) => {
        this.setState({
            ['previewImage' + i]: file.url || file.thumbUrl,
            ['previewVisible' + i]: true
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
    handleChange = (i, fileList) => {
        const that = this
        that.setState({
            ['fileList' + i]: fileList.fileList
        })
    }
    // 自定义上传
    customRequest = (i, files) => {
        const {file} = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    ['img' + i]: res.data,
                    ['fileList' + i]: [{uid: file.uid, url: res.data, status: 'done'}]
                })
                that.props.form.setFieldsValue({
                    ['img' + i]: that.props.form.getFieldsValue()['img' + i]
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
                    const params = handleParams(values)
                    for (let i = 0; i < this.state.doufuLength; i++) {
                        params[0].activityBlockWebRequestList[i].img = this.state['img' + i]
                        params[0].activityBlockWebRequestList[i].flag = this.state.flag
                        if (this.state.detail.length > 0) {
                            params[0].activityBlockWebRequestList[i].id = this.state.detail[i].id
                            params[0].activityBlockWebRequestList[i].isDel = this.state.detail[i].isDel
                            params[0].activityBlockWebRequestList[i].createTime = this.state.detail[i].createTime
                            params[0].activityBlockWebRequestList[i].platform = this.state.detail[i].platform
                            params[0].activityBlockWebRequestList[i].createTime = this.state.detail[i].createTime
                        }
                    }
                    saveOrUpdateBeanCurd(params[0]).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', params[1] + '豆腐块成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => {
                                openNotificationWithIcon('error', params[1] + '豆腐块失败！')
                            })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    // 校验
    compareToTitle = (rule, value, callback) => {
        const result = verifyTitle(rule, value)
        result ? callback(result) : callback()
    };
    normFile = (index, rule, value, callback) => {
        console.log(index, rule, value)
        const result = verifyFile(rule, value)
        if (result) {
            callback(result)
        } else {
            if (this.state['fileList' + index].length > 0 && this.state['fileList' + index][0].status === 'uploading') {
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

        const {previewVisible0, previewVisible1, previewVisible2, previewVisible3, previewImage0, previewImage1, previewImage2, previewImage3, fileList0, fileList1, fileList2, fileList3} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        const loading = this.state.loading
        const dataSource = ['10', '20', '30', '40', '50']
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="豆腐块管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <Divider orientation="left">基础信息</Divider>
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
                                    }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate}/>
                                )
                                }
                            </FormItem>
                            <Divider orientation="left">第1个豆腐块</Divider>
                            <FormItem label="豆腐块标题">
                                {getFieldDecorator('title0', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入豆腐块标题!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于12个字符，中英文均视为一个字符"/>
                                )}
                            </FormItem>
                            <FormItem label="广告链接">
                                {getFieldDecorator('url0', {
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
                            </FormItem>
                            <FormItem label="广告图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img0', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择广告图片!',
                                            },
                                            {
                                                validator: this.normFile.bind(this, 0)
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList0}
                                            customRequest={this.customRequest.bind(this, 0)}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview.bind(this, 0)}
                                            onChange={this.handleChange.bind(this, 0)}>
                                            {fileList0.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible0} footer={null}
                                           onCancel={this.handleCancel.bind(this, 0)} centered>
                                        <img alt="example" style={{width: '100%'}} src={previewImage0}/>
                                    </Modal>
                                </div>
                            </FormItem>
                            <Divider orientation="left">第2个豆腐块</Divider>
                            <FormItem label="豆腐块标题">
                                {getFieldDecorator('title1', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入搜索词名词!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于10个字符，中英文均视为一个字符"/>
                                )}
                            </FormItem>
                            <FormItem label="广告链接">
                                {getFieldDecorator('url1', {
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
                            </FormItem>
                            <FormItem label="广告图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img1', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择广告图片!',
                                            },
                                            {
                                                validator: this.normFile.bind(this, 1)
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList1}
                                            customRequest={this.customRequest.bind(this, 1)}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview.bind(this, 1)}
                                            onChange={this.handleChange.bind(this, 1)}>
                                            {fileList1.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible1} footer={null}
                                           onCancel={this.handleCancel.bind(this, 1)} centered>
                                        <img alt="example" style={{width: '100%'}} src={previewImage1}/>
                                    </Modal>
                                </div>
                            </FormItem>
                            <Divider orientation="left">第3个豆腐块</Divider>
                            <FormItem label="豆腐块标题">
                                {getFieldDecorator('title2', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入搜索词名词!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于10个字符，中英文均视为一个字符"/>
                                )}
                            </FormItem>
                            <FormItem label="广告链接">
                                {getFieldDecorator('url2', {
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
                            </FormItem>
                            <FormItem label="广告图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img2', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择广告图片!',
                                            },
                                            {
                                                validator: this.normFile.bind(this, 2)
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList2}
                                            customRequest={this.customRequest.bind(this, 2)}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview.bind(this, 2)}
                                            onChange={this.handleChange.bind(this, 2)}>
                                            {fileList2.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible2} footer={null}
                                           onCancel={this.handleCancel.bind(this, 2)} centered>
                                        <img alt="example" style={{width: '100%'}} src={previewImage2}/>
                                    </Modal>
                                </div>
                            </FormItem>
                            <Divider orientation="left">第4个豆腐块</Divider>
                            <FormItem label="豆腐块标题">
                                {getFieldDecorator('title3', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入搜索词名词!',
                                        },
                                        {
                                            validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="需小于10个字符，中英文均视为一个字符"/>
                                )}
                            </FormItem>
                            <FormItem label="广告链接">
                                {getFieldDecorator('url3', {
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
                            </FormItem>
                            <FormItem label="广告图片">
                                <div className="clearfix">
                                    {getFieldDecorator('img3', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择广告图片!',
                                            },
                                            {
                                                validator: this.normFile.bind(this, 3)
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList3}
                                            customRequest={this.customRequest.bind(this, 3)}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview.bind(this, 3)}
                                            onChange={this.handleChange.bind(this, 3)}>
                                            {fileList3.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible3} footer={null}
                                           onCancel={this.handleCancel.bind(this, 3)} centered>
                                        <img alt="example" style={{width: '100%'}} src={previewImage3}/>
                                    </Modal>
                                </div>
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
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

const BasicForm = Form.create()(AddDoufu);

export default BasicForm;

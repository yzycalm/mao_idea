/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {
    Card,
    Form,
    Input,
    Icon,
    Row,
    Col,
    Button,
    Upload,
    Modal,
    PageHeader
} from 'antd';
import {setCurrentStyle, getCurrentStyle} from '../../../api/tile/message'
import {uploadImg} from '../../../api/public'
import {handleImgSize, openNotificationWithIcon, clickCancel, format} from '../../../utils/index'
import {resourceOptions} from '../../../utils/marketing'
import {verifyTitle, verifyFile} from "../../../utils/verify";

const FormItem = Form.Item;

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
            width: 100,
            height: 22,
            imgSize: 500,
            resourceName: '',
            status: 0,
            disabled: true,
            img: '',
            data: {},
            formItemStatus: {
                titleStatus: ''
            },
            title: '消息栏样式设置',
            loading: false,
            isShow: false
        };
    }

    componentDidMount() {
        this.getMessageStyle()
    }

    componentWillUnmount() {
        sessionStorage.removeItem('messageStyle')
    }

    // 获取消息样式信息
    getMessageStyle() {
        getCurrentStyle().then((res) => {
            if (res && res.success) {
                const data = res.data
                this.props.form.setFieldsValue({
                    bgColor: data.bgColor,
                    fontColor: data.fontColor,
                    imgUrl: data.imgUrl ? data.imgUrl : ''
                })
                if (data.imgUrl) {
                    this.setState({
                        fileList: [{
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: data.imgUrl
                        }]
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
        return handleImgSize(r, file, this.state.width, this.state.height, res => {
            that.setState({
                data: res
            })
        }, this.state.imgSize)
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
                    imgUrl: res.data,
                    fileList: [{uid: file.uid, url: res.data, status: 'done'}]
                })
                that.props.form.setFieldsValue({
                    imgUrl: that.props.form.getFieldsValue().imgUrl
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
                    // 新增
                    values.imgUrl = this.state.fileList.length > 0 ? this.state.fileList[0].url : ''
                    setCurrentStyle(values).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', '设置消息样式成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => {
                                openNotificationWithIcon('error', res.message)
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
        const loading = this.state.loading
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="首页布局管理" subTitle={this.state.title}/>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="题图">
                                <div className="clearfix">
                                    {getFieldDecorator('imgUrl', {
                                        rules: [
                                            {
                                                required: true,
                                                message: "请上传题图"
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
                                <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过{this.state.imgSize}K，仅支持JPG、JPEG、GIF、PNG格式</span>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                </Modal>
                            </FormItem>
                            <FormItem label="背景颜色">
                                {getFieldDecorator('bgColor', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '输入背景颜色!',
                                        },
                                    ]
                                })(
                                    <Input placeholder="例：#FFFFFF"/>
                                )}
                            </FormItem>
                            <FormItem label="字体颜色">
                                {getFieldDecorator('fontColor', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '输入字体颜色!',
                                        },
                                    ]
                                })(
                                    <Input placeholder="例：#FFFFFF"/>
                                )}
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

const BasicForm = Form.create()(Advertising);

export default BasicForm;

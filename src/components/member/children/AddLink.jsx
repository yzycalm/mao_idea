import React from 'react';
import { Row, Col, Form, Input, Button, Upload, Icon, Modal, Select, PageHeader, Card, Skeleton, DatePicker } from 'antd/lib/index';
import { clickCancel, handleImgSize, openNotificationWithIcon, format } from "../../../utils";
import { addOrEditVenueLink, viewVenueLink, isExistScene } from "../../../api/member/venueLink";
import { verifyTitle } from "../../../utils/verify";
import { uploadImg } from "../../../api/public";
import moment from "moment";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal

class AddLink extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增会场转链',
            loading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            position: "-395px 0",
            text: '嗨！分享给你→现在下单还能返红包，折上折!',
            loadingFinish: false,
            promotionSceneId: ''
        };
    }

    // 获取转链页信息
    componentDidMount () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id, title: this.props.location.query.title }
            sessionStorage.setItem('VenueLinkData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '转链页',
                    loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('VenueLinkData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '转链页',
                    loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('VenueLinkData')
    }

    // 获取转链页信息
    getAdvertInfo (id) {
        const params = { id: id + '' }
        viewVenueLink(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                // 图片处理
                this.props.form.setFieldsValue({
                    sceneName: data.sceneName,
                    promotionSceneId: data.promotionSceneId,
                    endTime: +data.endTime !== 0 ? moment(format(data.endTime)) : ''
                })
                this.setState({
                    text: data.shareMsg,
                    promotionSceneId: data.promotionSceneId,
                    fileList: [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: data.sceneImg
                        }
                    ],
                    loadingFinish: false
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true }, () => {
                    const bannerId = JSON.parse(sessionStorage.getItem('VenueLinkData'))
                    values.id = ''
                    values.sceneImg = this.state.fileList.length > 0 ? this.state.fileList[0].url : ''
                    values.shareMsg = this.state.text
                    values.endTime = parseInt(new Date(values.endTime).getTime() / 1000)
                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                    }
                    addOrEditVenueLink(values).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {
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

    getChangeInput (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                text: value
            })
        } else {
            this.setState({
                text: ''
            })
        }
    }

    // 校验
    compareToTitle = (rule, value, callback) => {
        const result = verifyTitle(rule, value)
        result ? callback(result) : callback()
    };

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

    onChange = (value) => {
        if (value === 'iphone') {
            this.setState({
                position: "-395px 0"
            })
        } else if (value === 'android') {
            this.setState({
                position: "0 0"
            })

        } else if (value === 'black_iphone') {
            this.setState({
                position: "black"
            })

        } else {
            this.setState({
                position: "-790px 0"
            })
        }
    }

    handleBack () {
        if (this.props.form.getFieldsValue().promotionSceneId) {
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
    // 判断会场链接
    getSceneLink (rule, value, callback) {
        if (value) {
            // 判断商品ID是否重复
            this.isExistScene(value, (res) => {
                res ? callback() : callback("该会场链接/会场ID已存在")
            })
        } else {
            callback('请输入会场链接/会场ID')
        }
    }
    isExistScene (val, callback) {
        const data = JSON.parse(sessionStorage.getItem('VenueLinkData'))
        if (data && data.id && val === this.state.promotionSceneId) {
            // 不监听商品信息
            callback(true)
        } else {
            let params = { promotionSceneId: val }
            if (data && data.id) {
                params.id = data.id
            }
            isExistScene(params).then(res => {
                if (res) {
                    callback(res.success)
                }
            })
        }
    }
    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const { previewVisible, previewImage, fileList, text, loading, position, loadingFinish } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );

        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="转链页管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{ rows: 4 }} />
                        <Row gutter={16} style={{ display: loadingFinish ? 'none' : 'block' }}>
                            <Col className="gutter-row " span={12}>
                                <br /><br /><br />
                                <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                    <FormItem label="会场名称">
                                        {getFieldDecorator('sceneName', {
                                            rules: [
                                                {
                                                    max: 30,
                                                    message: '最大输入长度为30个字符'
                                                }
                                            ],
                                        })(
                                            <Input />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="会场背景图">
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
                                        <p>建议尺寸*格式为JPG、PNG图片</p>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>

                                    </FormItem>
                                    <FormItem label="会场链接/会场ID：">
                                        {getFieldDecorator('promotionSceneId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    validator: this.getSceneLink.bind(this)
                                                }
                                            ],
                                        })(
                                            <Input />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="会场分享文案">
                                        <TextArea rows={4} value={text}
                                            onChange={this.getChangeInput.bind(this)}
                                        />
                                    </FormItem>
                                    <FormItem label="截止时间">
                                        {getFieldDecorator('endTime', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择截止时间'
                                                }
                                            ],
                                        })(
                                            <DatePicker showTime />
                                        )}
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
                                            <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col className="gutter-row text-center" span={12}>
                                <Col className="gutter-row text-center" span={10}>
                                    <div className="device"
                                        style={{
                                            backgroundPosition: position,
                                            float: 'left',
                                            display: `${position === 'black' ? 'none' : 'block'}`
                                        }}
                                    >
                                        <div className="device-content"
                                            style={{
                                                width: '321px',
                                                backgroundImage: `url(${fileList.length > 0 ? fileList[0].url : ''})`,
                                                backgroundSize: "contain"
                                            }}
                                        >
                                            <div className="transparent-bg">
                                                <div className="code">
                                                    {
                                                        text ? text + '长按復·制这段描述￥U9dgYW681uj￥后咑閞手机掏→宝→App，立即开抢！' : '嗨！分享给你→现在下单还能返红包，折上折!  长按復·制这段描述￥U9dgYW681uj￥后咑閞手机掏→宝→App，立即开抢！'
                                                    }
                                                </div>
                                                <img src="images/btn.png" width={"180px"} />
                                                <div className="tip">分享好友，好友下单，你赚佣金</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="phone"
                                        style={{ display: `${position === 'black' ? 'block' : 'none'}` }}
                                    >
                                        <div
                                            style={{
                                                width: '325px',
                                                backgroundImage: `url(${fileList.length > 0 ? fileList[0].url : ''})`,
                                                backgroundSize: "contain",
                                                position: 'relative', height: '100%'
                                            }}
                                        >
                                            <div className="transparent-bg">
                                                <div className="code">
                                                    {
                                                        text ? text + '长按復·制这段描述￥U9dgYW681uj￥后咑閞手机掏→宝→App，立即开抢！' : '嗨！分享给你→现在下单还能返红包，折上折! 长按復·制这段描述￥U9dgYW681uj￥后咑閞手机掏→宝→App，立即开抢！'
                                                    }
                                                </div>
                                                <img src="images/btn.png" width={"180px"} />
                                                <div className="tip">分享好友，好友下单，你赚佣金</div>
                                            </div>
                                        </div>
                                        <div className="statusbar" />
                                    </div>
                                </Col>
                                <Col className="gutter-row text-center" span={10}>
                                    <Select style={{ float: 'right' }}
                                        defaultValue={"iphone"}
                                        style={{ width: 100 }}
                                        placeholder="选择手机壳"
                                        onChange={this.onChange}
                                    >
                                        <Option value="iphone">苹果</Option>
                                        <Option value="black_iphone">黑苹果</Option>
                                        <Option value="android">安卓</Option>
                                        <Option value="old">老人机</Option>
                                    </Select>
                                </Col>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddLink);

export default BasicForm;

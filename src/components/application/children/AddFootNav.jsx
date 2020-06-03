import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Upload,
    Icon,
    Modal,
    PageHeader,
    Card,
    Skeleton,
    Radio
} from 'antd/lib/index';
import {clickCancel, handleImgSize, openNotificationWithIcon} from "../../../utils";
import {addOrUpdateFootNav} from "../../../api/application/footNav";
import {uploadImg} from "../../../api/public";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {confirm} = Modal

class AddLink extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增导航',
            loading: false,
            previewVisible: false,
            previewImage: '',
            fileList1: [],
            fileList2: [],
            width: 48,
            height: 48,
            size: 200,
            loadingFinish: false
        };
    }

    // 获取导航信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.detail) {
            params = JSON.parse(this.props.location.query.detail)
            sessionStorage.setItem('FootNavData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: '编辑导航',
                    loadingFinish: true
                })
                this.getAdvertInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('FootNavData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: '编辑导航',
                    loadingFinish: true
                })
                this.getAdvertInfo(params)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('FootNavData')
    }

    // 获取导航信息
    getAdvertInfo(data) {
        // 图片处理
        this.props.form.setFieldsValue({
            tabName: data.tabName,
            sort: data.sort,
            isAble: data.isAble,
            defTab: data.defTab,
            seleTab: data.seleTab
        })
        this.setState({
            fileList1: [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: data.defTab
                }
            ],
            fileList2: [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: data.seleTab
                }
            ],
            loadingFinish: false
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true}, () => {
                    const FootNavId = JSON.parse(sessionStorage.getItem('FootNavData'))
                    values.id = ''
                    values.defTab = this.state.fileList1[0].url
                    values.seleTab = this.state.fileList2[0].url
                    if (FootNavId && FootNavId.id) {
                        values.id = FootNavId.id
                    }
                    addOrUpdateFootNav(values).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => {
                                openNotificationWithIcon('error', '保存失败！')
                            })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

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
        }, this.state.size)
    };
    handleChange = (i, file) => {
        this.setState({
            ['fileList' + i]: file.fileList.splice(file.fileList.length - 1)
        })
    }
    handleRemove = (i, file) => {
        this.state['fileList' + i].splice(this.state['fileList' + i].length - 1);
        this.setState({
            ['fileList' + i]: this.state['fileList' + i]
        });
    }
    // 自定义上传
    customRequest = (i, files) => {
        const {file} = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    ['fileList' + i]: [{uid: file.uid, url: res.data, status: 'done'}]
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


    handleBack() {
        if (this.props.form.getFieldsValue().tabName) {
            confirm({
                title: '提示',
                content: '你还未保存信息，确认取消保存吗？',
                okText: '确定',
                cancelText: '取消',
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

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };
        const {previewVisible, previewImage, fileList1, fileList2, loading, loadingFinish} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );

        const {getFieldDecorator} = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="底部导航" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{rows: 4}} />
                        <Row gutter={16} style={{display: loadingFinish ? 'none' : 'block'}}>
                            <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                <FormItem label="导航名称">
                                    {getFieldDecorator('tabName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入导航名称!',
                                            }, {
                                                max: 10,
                                                message: '最大输入长度为10个字符'
                                            }
                                        ],
                                    })(
                                        <Input />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="排序">
                                    {getFieldDecorator('sort', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入排序!',
                                            }
                                        ],
                                    })(
                                        <Input />
                                    )
                                    }
                                </FormItem>
                                <FormItem label="未选中图标">
                                    {getFieldDecorator('defTab', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择未选中图标!'
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList1}
                                            customRequest={this.customRequest.bind(this, 1)}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            handleUpload={this.handleUpload}
                                            onChange={this.handleChange.bind(this, 1)}
                                            onRemove={this.handleRemove.bind(this, 1)}
                                        >
                                            {fileList1.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <p>要求：图片尺寸为{this.state.width}px*{this.state.height}px；容量大小为{this.state.size}k以内，支持JPG、JPEG、GIF、PNG格式</p>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{width: '100%'}} src={previewImage} />
                                    </Modal>

                                </FormItem>
                                <FormItem label="已选中图标">
                                    {getFieldDecorator('seleTab', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择已选中图标!'
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList2}
                                            customRequest={this.customRequest.bind(this, 2)}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            handleUpload={this.handleUpload}
                                            onChange={this.handleChange.bind(this, 2)}
                                            onRemove={this.handleRemove.bind(this, 2)}
                                        >
                                            {fileList2.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                    <p>要求：图片尺寸为{this.state.width}px*{this.state.height}px；容量大小为{this.state.size}k以内，支持JPG、JPEG、GIF、PNG格式</p>
                                </FormItem>
                                <FormItem label="状态">
                                    {getFieldDecorator('isAble', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择状态!',
                                            },
                                        ],
                                    })(
                                        <RadioGroup>
                                            <Radio value={0}>启用</Radio>
                                            <Radio value={1}>禁用</Radio>
                                        </RadioGroup>
                                    )
                                    }
                                </FormItem>
                                <Row>
                                    <Col span={24} style={{textAlign: 'center'}}>
                                        <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
                                        <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddLink);

export default BasicForm;

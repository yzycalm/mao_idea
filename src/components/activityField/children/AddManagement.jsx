import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal,
    Select,
    PageHeader,
    Card,
    Radio,
    Skeleton
} from 'antd/lib/index';
import { clickCancel, handleImgSize, openNotificationWithIcon } from "../../../utils";
import { getMFItem, addOrUpdateFeatured, getFeaturedDetail } from "../../../api/featured/starsAndSea";
import { uploadImg } from "../../../api/public";
import draftToHtml from "draftjs-to-html";

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal
const RadioGroup = Radio.Group;
let id = 0;

class AddLink extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增专场',
            loadingFinish: false,
            loading: false,
            isShowAddBtn: true,
            option: [],
            position: [],
            isUse: "",
            type: '',
            id: "",
            monographicId: ""
        };
    }
    // 获取活动信息
    componentDidMount () {

        this.getActiveName()
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {

            params = { id: this.props.location.query.id, title: this.props.location.query.title }

            sessionStorage.setItem('addMangement', JSON.stringify(params))

            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '专场',
                    // loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('addMangement'))

            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '专场',
                    // loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('addMangement')
    }
    getActiveName () {
        getMFItem().then((res) => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    option: data,
                    position: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                })
            }
        })
    }
    // 获取活动信息
    getAdvertInfo (id) {
        const params = { id: id + '' }
        getFeaturedDetail(params).then(res => {
            if (res && res.success) {
                const value = res.data.data
                this.props.form.setFieldsValue({
                    name: value.monographicName,
                    isUse: value.isUse,
                    type: value.name,
                    position: value.sorts,
                    materielId: value.materielId
                })
                this.setState({
                    id: value.monographicId
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })


    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        var arr = {}
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true }, () => {
                    const params = JSON.parse(sessionStorage.getItem('addMangement'))
                    if (!params) {
                        arr = {
                            id: "",
                            isUse: values.isUse,
                            monographicId: values.name,
                            // monographicId: this.state.id ? this.state.id : "",
                            name: values.type,
                            sorts: values.position,
                            materielId: values.materielId
                        }
                    } else {
                        arr = {
                            id: params.id,
                            isUse: values.isUse,
                            // monographicId: this.state.monographicId,
                            monographicId: this.state.id ? this.state.id : "",
                            name: values.type,
                            sorts: values.position,
                            materielId: values.materielId
                        }
                    }

                    delete values.keys


                    addOrUpdateFeatured(arr).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {
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
        return handleImgSize(r, file, 0, 0, res => {
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

    handleBack () {
        if (this.props.form.getFieldsValue().name) {
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

    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key.key !== k),
        });
    };
    initData = (i, data) => {

    }
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        if (id > 17) {
            this.setState({
                isShowAddBtn: false
            })
            return;
        }
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat([{ key: id++ }]);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    onEditorChange = (index, editorContent) => {
        this.setState({
            ['editorContent' + index]: draftToHtml(editorContent),
        });
    };

    onEditorStateChange = (index, editorState) => {
        this.setState({
            ['editorState' + index]: editorState
        });
    };
    // 校验
    compareToShareMsg = (result, rule, value, callback) => {
        result = result ? result.replace(/<\/?.+?>/g, "") : ''
        if (result && result.length > 200) {
            callback('最大输入长度为200个字符')
        } else {
            callback()
        }
    };

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { loading, loadingFinish } = this.state;

        const { getFieldDecorator } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });


        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="专场管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{ rows: 4 }} />
                        <Form style={{ display: loadingFinish ? 'none' : 'block' }} {...formItemLayout}
                            onSubmit={this.handleSubmit} labelAlign={'right'}
                        >
                            <FormItem label="活动名称">
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择活动名称',
                                        },
                                    ],
                                })(
                                    <Select placeholder="请选择活动名称" style={{ width: '33%' }}
                                        disabled={this.state.id !== "" ? true : false}
                                    >
                                        {this.state.option.map(item => {

                                            // this.state.monographicId = item.monographicId

                                            return <Option key={item.monographicId}
                                                value={item.monographicId}
                                                   >{item.monographicName}</Option>
                                        })}
                                    </Select>
                                )
                                }
                            </FormItem>
                            <FormItem label="专场名称">
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入专场名称',
                                        }
                                    ],
                                })(
                                    <Input placeholder="请输入专场名称" style={{ width: '33%' }} />
                                )
                                }
                            </FormItem>

                            <FormItem label="展示位置">
                                {getFieldDecorator('position', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择展示位置',
                                        },
                                    ],
                                })(
                                    <Select placeholder="请选择展示位置" style={{ width: '33%' }}>
                                        {this.state.position.map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })}
                                    </Select>
                                )
                                }
                            </FormItem>
                            <FormItem label="物料ID">
                                {getFieldDecorator('materielId', {
                                    rules: [
                                        {
                                            pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                            message: '仅支持纯数字'
                                        }
                                    ],
                                })(
                                    <Input placeholder="请输入物料ID" style={{ width: '33%' }} />
                                )
                                }
                            </FormItem>
                            <FormItem label="状态">
                                {getFieldDecorator('isUse', {
                                    initialValue: this.state.isUse,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择状态!',
                                        }
                                    ]
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>启用</Radio>
                                        <Radio value={0}>禁用</Radio>
                                    </RadioGroup>
                                )
                                }
                            </FormItem>

                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
                                    <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddLink);

export default BasicForm;

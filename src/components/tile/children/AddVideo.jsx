/*
 * @Author: songyingchun
 * @Date: 2020-04-15 18:25:06
 * @Description: 添加视频专题
 */
import React from 'react';
import {
    Button,
    Card,
    Row,
    Col,
    Radio,
    Form,
    Input,
    PageHeader,
    Upload,
    Icon,
    Popover,
    DatePicker, Modal,
    Checkbox,
    Tag
} from "antd";
import { SketchPicker } from 'react-color';
import { clickCancel, format, handleImgSize, openNotificationWithIcon } from "../../../utils";
import { uploadImg } from "../../../api/public";
import { saveOrEditVideo, findVideoById, getClassify } from "../../../api/tile/video";
import moment from "moment";
import store from "../../../store";

const { confirm } = Modal
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: store.getState().iconFont
});
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

class AddTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增视频专题',
            value: 1,
            loading: false,
            fileList1: [],
            previewVisible: false,
            previewImage: '',
            bgColor: '',
            visible: false,
            option: [],
            width: 40,
            height: 40,
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            plainOptions: [],
            allClassify: [],
            id: ''
        }
    }

    // 获取视频专题信息
    componentDidMount () {
        this.initData(() => {
            let params;
            if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
                params = JSON.parse(this.props.location.query.id)
                sessionStorage.setItem('Video', JSON.stringify(params))
                if (params) {
                    this.setState({
                        title: '编辑视频专题',
                        loadingFinish: true,
                        id: this.props.location.query.id
                    })
                    this.getTileInfo(params)
                }
            } else {
                params = JSON.parse(sessionStorage.getItem('Video'))
                if (params) {
                    this.setState({
                        title: '编辑视频专题',
                        loadingFinish: true,
                        id: params.id
                    })
                    this.getTileInfo(params)
                }
            }
        })
    }

    componentWillUnmount () {
        sessionStorage.removeItem('Video')
    }

    // 获取视频专题信息
    getTileInfo (data) {
        findVideoById({ id: +data }).then(res => {
            if (res && res.success) {
                const data = res.data
                this.props.form.setFieldsValue({
                    title: data.title,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                this.setState({
                    bgColor: data.bgColor,
                    value: data.style,
                    fileList1: data.icon ? [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data.icon
                    }] : [],
                })
                // 类目
                if (data.types.length > 0) {
                    let checkedId = []
                    data.types.map((k, i) => {
                        this.state.allClassify.map((item, index) => {
                            if (+item.typeId === +k) {
                                checkedId.push(item.name)
                            }
                        })
                    })
                    this.setState({
                        checkedList: checkedId
                    })
                }
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    onChangeRadio = (params, e) => {
        this.setState({
            [params]: e.target.value
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
    beforeUpload = (i, file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        // 上传图片比例与大小限制
        let that = this
        let width = this.state.width
        let height = this.state.height
        return handleImgSize(r, file, width, height, res => {
            that.setState({
                data: res
            })
        })
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
        const { file } = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    ['fileList' + i]: [{ uid: file.uid, url: res.data, status: 'done' }]
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

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true }, () => {
                    saveOrEditVideo(this.getParams(values)).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {

                                openNotificationWithIcon('error', res.message ? res.message : '专题名称重复，请重新检查后保存！')
                            })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    // 组装请求参数
    getParams (values) {
        const { checkedList, fileList1, value, bgColor } = this.state
        const params = JSON.parse(sessionStorage.getItem('Video'))
        if (params) {
            values.id = params
        }
        values.style = value
        values.bgColor = bgColor
        values.startTime = moment(values.time[0]).valueOf() / 1000
        values.endTime = moment(values.time[1]).valueOf() / 1000
        values.icon = fileList1.length > 0 ? fileList1[0].url : ""
        // 转换成ID
        let checkedId = []
        checkedList.map((k, i) => {
            this.state.allClassify.map((item, index) => {
                if (item.name === k) {
                    checkedId.push(item.typeId)
                }
            })
        })
        values.types = checkedId
        values.operator = ""
        delete values.time
        return values
    }

    // 选取颜色
    handleChangeComplete = (color) => {
        this.setState({ bgColor: color.hex, visible: false });
    }

    handleBack () {
        if (this.props.form.getFieldsValue().title) {
            confirm({
                title: '提示',
                content: '你还未保存信息，确认取消保存吗？',
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

    initData (callback) {
        const that = this
        getClassify().then(res => {
            if (res && res.success) {
                const data = res.data
                let arr = [], other = []
                data.map(item => {
                    arr.push(item.name)
                    other.push(item)
                })
                that.setState({
                    plainOptions: arr,
                    allClassify: other
                }, () => {
                    callback()
                })
            }
        })
    }

    onChangeCheckbox = checkedList => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < this.state.plainOptions.length,
            checkAll: checkedList.length === this.state.plainOptions.length,
        });
    };

    onCheckAllChange = e => {
        this.setState({
            checkedList: e.target.checked ? this.state.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    closeTag (index) {
        let newCheckedList = [...this.state.checkedList]
        newCheckedList.splice(index, 1)
        this.setState({
            checkedList: newCheckedList
        })
    }

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { fileList1, previewVisible, previewImage, loading } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请上传文件</div>
            </div>
        );
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="视频专题管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered title={"视频专题"}
                        extra={<span><Button type="primary" onClick={this.handleSubmit.bind(this)}
                            loading={loading}
                                     >保存</Button><Button type="default"
                            onClick={this.handleBack.bind(this)}
                                                 >取消</Button></span>}
                    >
                        <Row>
                            <Col span={12}>
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Form.Item label="视频专题名称">
                                        {getFieldDecorator('title', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入视频专题名称!',
                                                },
                                                {
                                                    max: 50,
                                                    message: '最大输入长度为50个字符!',
                                                }
                                            ],
                                        })(
                                            <Input />
                                        )
                                        }
                                    </Form.Item>
                                    <Form.Item label="专题图标">
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList1}
                                            customRequest={this.customRequest.bind(this, 1)}
                                            beforeUpload={this.beforeUpload.bind(this, 1)}
                                            onPreview={this.handlePreview}
                                            handleUpload={this.handleUpload}
                                            onChange={this.handleChange.bind(this, 11)}
                                            onRemove={this.handleRemove.bind(this, 1)}
                                        >
                                            {fileList1.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        <span>要求：图片尺寸为40px * 40px；图片大小不超过300k，仅支持JPG、JPEG、GIF、PNG格式</span>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}
                                            centered
                                        >
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </Form.Item>
                                    <Form.Item label="背景色">
                                        <Popover content={<SketchPicker
                                            color={this.state.bgColor}
                                            onChangeComplete={this.handleChangeComplete.bind(this)}
                                                          />}
                                            placement="topLeft" trigger="click" visible={this.state.visible}
                                        >
                                            <Input value={this.state.bgColor}
                                                onClick={() => this.setState({ visible: true })}
                                            />
                                        </Popover>
                                    </Form.Item>
                                    <Form.Item label="布局样式">
                                        <br />
                                        <Radio.Group onChange={this.onChangeRadio.bind(this, 'value')}
                                            value={this.state.value}
                                            style={{ width: '100%' }}
                                        >
                                            <Col span={4} offset={2}>
                                                <Radio value={1}><IconFont
                                                    style={{
                                                        fontSize: '50px',
                                                        position: 'absolute',
                                                        top: '-50px',
                                                        left: '-18px'
                                                    }}
                                                    type="icon-icon-hengxianghuadong"
                                                                 /></Radio>
                                            </Col>
                                            <Col span={4}>
                                                <Radio value={2}><IconFont
                                                    style={{
                                                        fontSize: '50px',
                                                        position: 'absolute',
                                                        top: '-50px',
                                                        left: '-18px'
                                                    }}
                                                    type="icon-sanhangmoshi-"
                                                                 /></Radio>
                                            </Col>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="视频类目">
                                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                            <Checkbox
                                                indeterminate={this.state.indeterminate}
                                                onChange={this.onCheckAllChange}
                                                checked={this.state.checkAll}
                                            >全选
                                            </Checkbox>
                                        </div>
                                        <CheckboxGroup
                                            options={this.state.plainOptions}
                                            value={this.state.checkedList}
                                            onChange={this.onChangeCheckbox}
                                        />
                                    </Form.Item>
                                    <Form.Item label="已选类目">
                                        {
                                            this.state.checkedList.map((item, index) => {
                                                return <Tag key={item} closable
                                                    onClose={this.closeTag.bind(this, index)}
                                                       >{item}</Tag>
                                            })
                                        }
                                    </Form.Item>
                                    <Form.Item label="展示时间段">
                                        {getFieldDecorator('time', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择展示时间段!',
                                                },
                                            ],
                                        })(
                                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                        )}
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddTile);

export default BasicForm;

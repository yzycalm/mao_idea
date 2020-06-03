/**
 * Created by songyingchun
 */
import React from 'react';
import {
    Button,
    Card,
    Row,
    Col,
    Radio,
    Divider,
    Form,
    Input,
    PageHeader,
    Upload,
    Icon,
    Popover,
    Select,
    Modal, DatePicker
} from "antd";
import {SketchPicker} from 'react-color';
import {clickCancel, format, handleImgSize, openNotificationWithIcon} from "../../../utils";
import {uploadImg} from "../../../api/public";
import {saveOrEditGoods, findGoodsById, getGoodsActivity} from "../../../api/tile/goodsSpecial";
import moment from "moment";
import store from "../../../store";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: store.getState().iconFont
});
const {RangePicker} = DatePicker;
const {Option} = Select;
const {TextArea} = Input;

class AddTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增商品专题',
            value: 2,
            loading: false,
            fileList: [],
            fileList1: [],
            previewVisible: false,
            previewImage: '',
            bgColor: '',
            entryType: 0,
            moreValue: 1,
            visible: false,
            option: [],
            width: 750,
            height: 254,
            monographicId: "",
            topicUrl: ''

        }
    }

    // 获取商品专题信息
    componentDidMount() {
        this.initData()
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = JSON.parse(this.props.location.query.id)
            sessionStorage.setItem('GoodsSpecial', JSON.stringify(params))
            if (params) {
                this.setState({
                    title: '编辑商品专题',
                    loadingFinish: true
                })
                this.getTileInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('GoodsSpecial'))
            if (params) {
                this.setState({
                    title: '编辑商品专题',
                    loadingFinish: true
                })
                this.getTileInfo(params)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('GoodsSpecial')
    }

    // 获取商品专题信息
    getTileInfo(data) {
        findGoodsById({id: +data}).then(res => {
            if (res && res.success) {
                const data = res.data
                this.props.form.setFieldsValue({
                    topicName: data.topicName,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
                this.setState({
                    value: data.style,
                    bgColor: data.bgColor,
                    entryType: data.entryType,
                    fileList: +data.entryType === 1 && data.themeImg ? [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data.themeImg
                    }] : [],
                    fileList1:  data.topicIcon ? [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data.topicIcon
                    }] : [],
                    topicUrl: data.monographicId ? "" : data.topicUrl,
                    moreValue: data.monographicId ? 1 : 2,
                    monographicId: data.monographicId
                }, () => {
                    if (data.itemList.length > 0) {
                        data.itemList.map((item, index) => {
                            this.props.form.setFieldsValue({
                                ["itemList" + (index + 1)]: item
                            })
                        })
                    }
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    onChange = (params, e) => {
        this.setState({
            [params]: e.target.value
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
    beforeUpload = (i, file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        // 上传图片比例与大小限制
        let that = this
        let width = this.state.width
        let height = this.state.height
        if (i === 1) {
            width = height = 40
        }
        return handleImgSize(r, file, width, height, res => {
            that.setState({
                data: res
            })
        }, 300)
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

    // 样式参数
    handleInput(param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                [param]: value
            })
        } else {
            this.setState({
                [param]: ""
            })
        }
    }

// 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true}, () => {
                    saveOrEditGoods(this.getParams(values)).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => {

                                openNotificationWithIcon('error', res.message ? res.message : '专题商品名称不可重复！')
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
    getParams(values) {
        const {fileList, fileList1, value, entryType, bgColor, moreValue, monographicId, topicUrl} = this.state
        const params = JSON.parse(sessionStorage.getItem('GoodsSpecial'))
        if (params) {
            values.id = params
        }
        values.style = value
        values.bgColor = bgColor
        values.entryType = entryType
        values.startTime = moment(values.time[0]).valueOf()
        values.endTime = moment(values.time[1]).valueOf()
        values.topicIcon = fileList1.length > 0 ? fileList1[0].url : ""
        // 判断路口
        if (+entryType === 1) {
            values.themeImg = fileList.length > 0 ? fileList[0].url : ""
        }
        // 判断关联
        if (+moreValue === 1) {
            values.monographicId = monographicId
            if (process.env.NODE_ENV === 'production') {
                values.topicUrl = `https://ws-download.hongrenzhuang.com/H5/project_template/index.html?unionid=[userid]&monographicId=${monographicId}&projectType=1&type=tanhuiyi`
            } else {
                values.topicUrl = `https://ws-download.hongrenzhuang.com/H5/project_template/index_test.html?unionid=[userid]&monographicId=${monographicId}&projectType=1&type=tanhuiyi`
            }
        } else {
            values.monographicId = ""
            values.topicUrl = topicUrl
        }
        // 商品ID判断
        if(moreValue === 2){
            if (+value === 2) {
                values.itemList = [values.itemList1, values.itemList2]
            } else {
                values.itemList = [values.itemList1, values.itemList2, values.itemList3]
            }
        } else {
            values.itemList = []
        }
        delete values.itemList1
        delete values.itemList2
        delete values.itemList3
        delete values.time
        return values
    }

    // 选取颜色
    handleChangeComplete = (color) => {
        this.setState({bgColor: color.hex, visible: false});
    }

    handleSelect(params, val) {
        this.setState({
            [params]: val
        })
    }

    initData() {
        getGoodsActivity().then(res => {
            if (res && res.success) {
                const data = res.data
                let arr = []
                data.map(item => {
                    arr.push({
                        title: item.monographicName,
                        value: item.monographicId
                    })
                })
                this.setState({
                    option: arr
                })
            }
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 6},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const {fileList,fileList1, previewVisible, previewImage, loading, value, moreValue} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请上传文件</div>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        let keys = +value === 3 ? ["1", "2", "3"] : ["1", "2"]
        const formItems = +moreValue === 2 ? keys.map((k, index) => (
            <Form.Item label={"首页封面商品" + k} key={k}>
                {getFieldDecorator("itemList" + k, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: +moreValue === 2,
                            message: "请输入商品ID",
                        },
                    ],
                })(<Input placeholder="请输入商品ID" />)}
            </Form.Item>
        )): ""
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="商品专题管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered title={"商品专题"}
                          extra={<Button type="primary" onClick={this.handleSubmit.bind(this)}
                                         loading={loading}
                                 >保存</Button>}
                    >
                        <Row>
                            <Col span={12}>
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Form.Item label="商品专题标题">
                                        {getFieldDecorator('topicName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入商品专题标题!',
                                                },
                                                {
                                                    max: 30,
                                                    message: '最大输入长度为30个字符!',
                                                }
                                            ],
                                        })(
                                            <Input />
                                        )
                                        }
                                    </Form.Item>
                                </Form>
                                <br /><br />
                                <h4>首页布局样式</h4>
                                <Divider />
                                <br /><br />
                                <Radio.Group onChange={this.onChange.bind(this, 'value')} value={this.state.value}
                                             style={{width: '100%'}}
                                >
                                    <Col span={4} offset={2}>
                                        <Radio value={2}><IconFont
                                            style={{
                                                fontSize: '50px',
                                                position: 'absolute',
                                                top: '-45px',
                                                left: '-18px'
                                            }}
                                            type="icon-buju" title={"一行两列"}
                                                         /></Radio>
                                    </Col>
                                    <Col span={4}>
                                        <Radio value={3}><IconFont
                                            style={{
                                                fontSize: '50px',
                                                position: 'absolute',
                                                top: '-45px',
                                                left: '-18px'
                                            }}
                                            type="icon-ai233" title={"一行三列"}
                                                         /></Radio>
                                    </Col>
                                </Radio.Group>
                                <br /><br />
                                <h4>布局效果</h4>
                                <Divider />
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Form.Item label="专题商品图标">
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
                                    </Form.Item>
                                    <Form.Item label="背景色">
                                        <Popover content={<SketchPicker
                                            color={this.state.bgColor}
                                            onChangeComplete={this.handleChangeComplete.bind(this)}
                                                          />}
                                                 placement="topLeft" trigger="click" visible={this.state.visible}
                                        >
                                            <Input value={this.state.bgColor}
                                                   onClick={() => this.setState({visible: true})}
                                            />
                                        </Popover>
                                    </Form.Item>
                                    <Form.Item label="入口形式">
                                        <Select value={this.state.entryType}
                                                onChange={this.handleSelect.bind(this, "entryType")}
                                        >
                                            <Option value={0}>"更多"按钮</Option>
                                            <Option value={1}>专题封面</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="专题封面图"
                                               style={{display: +this.state.entryType && this.state.entryType && this.state.entryType === 1 ? "block" : "none"}}
                                    >
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList}
                                            customRequest={this.customRequest.bind(this, "")}
                                            beforeUpload={this.beforeUpload.bind(this, "")}
                                            onPreview={this.handlePreview}
                                            handleUpload={this.handleUpload}
                                            onChange={this.handleChange.bind(this, "")}
                                            onRemove={this.handleRemove.bind(this, "")}
                                        >
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；图片大小不超过300k，仅支持JPG、JPEG、GIF、PNG格式</span>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}
                                               centered
                                        >
                                            <img alt="example" style={{width: '100%'}} src={previewImage} />
                                        </Modal>
                                    </Form.Item>
                                    <Form.Item>
                                        <Col offset={6}>
                                            <Radio.Group value={this.state.moreValue}
                                                         onChange={this.onChange.bind(this, 'moreValue')}
                                            >
                                                <Radio value={1}>关联已有活动</Radio>
                                                <Radio value={2}>自定义链接</Radio>
                                            </Radio.Group>
                                            <Select style={{display: +this.state.moreValue === 1 ? "block" : "none"}}
                                                    onChange={this.handleSelect.bind(this, "monographicId")}
                                                    value={this.state.monographicId}
                                            >
                                                {this.state.option.map(item => {
                                                    return <Option key={item.value}
                                                                   value={item.value}
                                                           >{item.title}</Option>
                                                })}
                                            </Select>
                                            <TextArea value={this.state.topicUrl}
                                                      onChange={this.handleInput.bind(this, "topicUrl")}
                                                      style={{display: +this.state.moreValue === 2 ? "block" : "none"}}
                                                      rows={4}
                                            />
                                        </Col>
                                    </Form.Item>
                                    {formItems}
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

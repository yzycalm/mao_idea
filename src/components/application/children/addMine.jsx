import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal,
    PageHeader,
    Card,
    Skeleton,
    Radio, Select, DatePicker
} from 'antd/lib/index';
import {clickCancel, openNotificationWithIcon} from "../../../utils";
import {addOrUpdateNotice} from "../../../api/application/notice";
import {addOrUpdateSysContentType} from "../../../api/application/mine";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {confirm} = Modal
const {TextArea} = Input;

class AddMine extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增模块',
            loading: false,
            loadingFinish: false,
            status: 0,
            sendTime: '',
            selectedValue: '',
            isAble : '',
            level : '',
            name : '',
            sort : '',
            id : ''
        };
    }

    // 获取模块信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.detail) {
            params = JSON.parse(this.props.location.query.detail)
            sessionStorage.setItem('NoticeData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: '编辑模块',
                    loadingFinish: true
                })
                this.getAdvertInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('NoticeData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: '编辑模块',
                    loadingFinish: true
                })
                this.getAdvertInfo(params)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('NoticeData')
    }

    // 获取模块信息
    getAdvertInfo(data) {
        // 图片处理
        this.props.form.setFieldsValue({
            name: data.name,
            isAble: data.isAble,
            sort: data.sort,
            level: data.level,
        })
        this.setState({
            name: data.name,
            isAble: data.isAble,
            sort: data.sort,
            level: data.level,
            loadingFinish: false
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            console.log(err)
            if (!err) {
                this.setState({loading: true}, () => {
                    const NoticeId = JSON.parse(sessionStorage.getItem('NoticeData'))
                    values.id = ''
                   
                    if (NoticeId && NoticeId.id) {
                        values.id = NoticeId.id
                    }
                    console.log(values)
                    addOrUpdateSysContentType(values).then((res) => {
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


    handleBack() {
        if (this.props.form.getFieldsValue().message) {
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

    // 发送时间
    radioChange = e => {
        this.setState({
            status: e.target.value
        })
    }
    onChangeTime = (value, dateString) => {
        this.setState({
            sendTime: dateString
        })
    }

    getSendTime(date) {
        this.setState({
            sendTime: date
        })
    }

    getSelected(val) {
        this.setState({
            level: val
        })
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
        const {status, loading, loadingFinish, selectedValue} = this.state;

        const {getFieldDecorator} = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="模块管理" subTitle={this.state.title}/>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{rows: 4}}/>
                        <Row gutter={16} style={{display: loadingFinish ? 'none' : 'block'}}>
                            <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                <FormItem label="模块名称">
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: true,                                   
                                                message: '请输入模块名称'
                                            },
                                            {
                                                max: 30,
                                                message: '模块名称不能超过30字符'
                                            }
                                        ],
                                    })(
                                        <Input/>
                                    )
                                    }
                                </FormItem>
                                <FormItem label="级别">
                                    {getFieldDecorator('level', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择模块级别!',
                                            }
                                        ],
                                    })(
                                        <Select onChange={this.getSelected.bind(this)}>
                                            <Option value={0}>一级图标</Option>
                                            <Option value={1}>二级图标</Option>
                                        </Select>
                                    )
                                    }
                                    <p>一级图标尺寸：72*72px  、二级图标尺寸：48*48px。容量大小为200K以内，支持JPG、JPEG、GIF、PNG格式。</p>
                                </FormItem>
                                <FormItem label="排序">
                                    {getFieldDecorator('sort', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入排序序号!',
                                            }
                                        ],
                                    })(
                                        <Input/>
                                    )
                                    }
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
                                            <Radio value={0}>开启</Radio>
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

const BasicFormMine = Form.create()(AddMine);

export default BasicFormMine;

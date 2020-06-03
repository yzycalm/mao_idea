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
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {confirm} = Modal
const {TextArea} = Input;

class AddLink extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增通知',
            loading: false,
            loadingFinish: false,
            status: 0,
            sendTime: '',
            selectedValue: ''
        };
    }

    // 获取通知信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.detail) {
            params = JSON.parse(this.props.location.query.detail)
            sessionStorage.setItem('NoticeData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: '编辑通知',
                    loadingFinish: true
                })
                this.getAdvertInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('NoticeData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: '编辑通知',
                    loadingFinish: true
                })
                this.getAdvertInfo(params)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('NoticeData')
    }

    // 获取通知信息
    getAdvertInfo(data) {
        // 图片处理
        this.props.form.setFieldsValue({
            message: data.message,
            isTop: data.isTop,
            msgUrl: data.msgUrl,
            txtType: data.txtType,
            sendTime: 2
        })
        this.setState({
            status: 2,
            sendTime: moment(data.sendTime, 'YYYY-MM-DD HH:mm:ss'),
            loadingFinish: false
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true}, () => {
                    const NoticeId = JSON.parse(sessionStorage.getItem('NoticeData'))
                    values.id = ''
                    values.position = 0
                    values.sendTime = +values.sendTime === 1 ? new Date().getTime() : new Date(this.state.sendTime).getTime()
                    if (NoticeId && NoticeId.id) {
                        values.id = NoticeId.id
                    }
                    addOrUpdateNotice(values).then((res) => {
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
            selectedValue: val
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
                <PageHeader onBack={clickCancel} title="通知管理" subTitle={this.state.title}/>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{rows: 4}}/>
                        <Row gutter={16} style={{display: loadingFinish ? 'none' : 'block'}}>
                            <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                <FormItem label="通知标题">
                                    {getFieldDecorator('message', {
                                        rules: [
                                            {
                                                max: 30,
                                                message: '通知标题不能超过30字符'
                                            }
                                        ],
                                    })(
                                        <Input/>
                                    )
                                    }
                                </FormItem>
                                <FormItem label="通知类型">
                                    {getFieldDecorator('txtType', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择通知类型!',
                                            }
                                        ],
                                    })(
                                        <Select onChange={this.getSelected.bind(this)}>
                                            <Option value={0}>文字</Option>
                                            <Option value={1}>链接</Option>
                                        </Select>
                                    )
                                    }
                                </FormItem>
                                <FormItem label="通知内容">
                                    {getFieldDecorator('msgUrl', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入通知内容!',
                                            }, {
                                                max: selectedValue == 0 ? 255 : 9999999999,
                                                message: selectedValue == 0 ? '字数最大255字符' : ''
                                            }
                                        ],
                                    })(
                                        <TextArea rows={4} placeholder={selectedValue == 0 ? '请输入文字内容' : '请输入文字链接'}/>
                                    )
                                    }
                                </FormItem>
                                <FormItem label="定时通知">
                                    {getFieldDecorator('sendTime', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择发送时间',
                                            }
                                        ],
                                    })(
                                        <RadioGroup onChange={this.radioChange.bind(this)}>
                                            <Radio defaultChecked value={1}>即时发送</Radio>
                                            <Radio value={2}>定时发送</Radio>
                                        </RadioGroup>
                                    )}
                                    <DatePicker style={{display: status === 2 ? 'inline-block' : 'none'}}
                                                showTime
                                                onChange={this.onChangeTime}
                                                onOk={this.getSendTime.bind(this)}
                                                value={this.state.sendTime ? moment(this.state.sendTime, 'YYYY-MM-DD HH:mm:ss') : null}
                                                format={'YYYY-MM-DD HH:mm:ss'}
                                    />
                                </FormItem>
                                <FormItem label="置顶">
                                    {getFieldDecorator('isTop', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择置顶状态!',
                                            },
                                        ],
                                    })(
                                        <RadioGroup>
                                            <Radio value={1}>置顶</Radio>
                                            <Radio value={0}>取消</Radio>
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

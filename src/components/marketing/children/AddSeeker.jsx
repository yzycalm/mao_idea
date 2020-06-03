/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Card, Form, Input, Row, Col, Radio, Button, DatePicker, AutoComplete,PageHeader} from 'antd';
import {saveSearch, findInfo} from '../../../api/marketing/searchTerms'
import moment from "moment";
import {verifyTitle} from "../../../utils/verify";
import {openNotificationWithIcon, clickCancel, disabledDate} from "../../../utils";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

class AddSeeker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增搜索词',
            loading: false
        };
    }
    // 获取搜索词信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {id: this.props.location.query.id, title: this.props.location.query.title}
            sessionStorage.setItem('SeekerData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '搜索词'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('SeekerData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '搜索词'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('SeekerData')
    }

    // 获取搜索词信息
    getAdvertInfo(id) {
        const that = this
        findInfo(id).then((res) => {
            if (res && res.success) {
                const data = res.data
                // 图片处理
                this.props.form.setFieldsValue({
                    searchContent: data.searchContent + '',
                    type: data.type,
                    sequence: data.sequence + '',
                    time: [moment(data.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(data.endTime, 'YYYY-MM-DD HH:mm:ss')]
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
                    this.setState({loading: true}, () => {
                        values.startTime = new Date(values.time[0]).getTime()
                        values.endTime = new Date(values.time[1]).getTime()
                        const bannerId = JSON.parse(sessionStorage.getItem('SeekerData'))
                        let text = '新增'
                        if (bannerId && bannerId.id) {
                            values.id = bannerId.id
                            text = '编辑'
                        }
                        let {time, ...params} = values
                        console.log(time)

                        saveSearch(params).then((res) => {
                            if (res.success) {
                                openNotificationWithIcon('success', text + '搜索词成功！')
                                clickCancel()
                            } else {
                                this.setState({loading: false}, () => {openNotificationWithIcon('error', text + '搜索词失败！')})
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
    // 校验数字
    compareToNumber = (rule, value, callback) => {
        if(value) {
            const  reg = /^[1-9]\d*$/;
            reg.test(value) ? callback() : callback("请输入正整数")
        } else {
            callback('请选择或者输入优先级，数字越小优先级越大')
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

        const dataSource = ['10', '20', '30', '40', '50']

        const {getFieldDecorator} = this.props.form;
        const loading = this.state.loading

        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="搜索词管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="搜索词位置">
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择搜索词位置!',
                                        },
                                    ],
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>搜索栏搜索</Radio>
                                        <Radio value={2}>大家正在搜</Radio>
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem label="搜索词名词">
                                {getFieldDecorator('searchContent', {
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
                                    <Input placeholder="需小于12个字符，中英文均视为一个字符"/>
                                )}
                            </FormItem>
                            <FormItem label="优先级">
                                {getFieldDecorator('sequence', {
                                    rules: [
                                        {
                                            required: true,
                                            validator: this.compareToNumber
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
                                    }} format="YYYY-MM-DD HH:mm:ss"  disabledDate={disabledDate} />
                                )
                                }
                            </FormItem>
                            <Row>
                                <Col span={24} style={{textAlign: 'center'}}>
                                    <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                    <Button type="default"  onClick={clickCancel}>取消</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddSeeker);

export default BasicForm;

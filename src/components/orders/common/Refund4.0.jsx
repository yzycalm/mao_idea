import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Select, Modal} from 'antd';
import {openNotificationWithIcon, jsToFormData} from '../../../utils/index';
import {refundScalpingOrder4} from '../../../api/orders/orderList'

const FormItem = Form.Item;
const Option = Select.Option;

class Refund4 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '买错了，要换货',
                value: '买错了，要换货'
            }, {
                title: '不想要了',
                value: '不想要了'
            }, {
                title: '商品不值得这个价格',
                value: '商品不值得这个价格'
            }, {
                title: '商品质量有问题',
                value: '商品质量有问题'
            }, {
                title: '其它原因',
                value: '其它原因'
            },
            ]
        };
    }
    // 提交
    handleSubmit = (publicState, e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.subOrderNo = this.props.subOrderNo
                values.parentOrderNo = this.props.orderNo
                values.type = "2"
                refundScalpingOrder4(values).then((res) => {
                    if (res && res.code === "00000") {
                        this.props.getRefund(true)
                        openNotificationWithIcon('success', '退款成功！')
                    } else {
                        openNotificationWithIcon('error', res.message)
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    handleCancel() {
        this.props.getRefund(false)
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const {getFieldDecorator} = this.props.form;
        const {TextArea} = Input;
        return (
            <Modal
                title="退款/退货"
                style={{top: 230}}
                visible={this.props.refundVisible}
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                destroyOnClose
            >
                <Form  {...formItemLayout}  >
                    <FormItem label="退款原因">
                        {getFieldDecorator('reason', {
                            rules: [{required: true, message: '请选择退款原因',}]
                        })(
                            <Select placeholder="请选择">
                                {this.state.option.map(item => {
                                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="退款金额">
                        {getFieldDecorator('amount', {
                            rules: [{ required: true, message: '请输入退款金额' },
                            {
                                min: 1, max: 10, message: '退款金额在1~10位',

                            }],
                            getValueFromEvent: (event) => {
                                return event.target.value.replace(/[^\d.]/g, '')
                            },
                        })(
                            <Input maxLength={10} addonAfter="元" placeholder="请输入退款金额,输入长度为1~10位" />
                        )}
                    </FormItem>


                    <FormItem label="备注">
                        {getFieldDecorator('remark', {
                            rules: [{required: false}],
                        })(
                            <TextArea rows={4}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

Refund4.propTypes = {
    refundVisible: PropTypes.bool,
    getRefund: PropTypes.func,
    id: PropTypes.string
}
Refund4.defaultProps = {
    refundVisible: false,
    id: ''
}
const BasicForm = Form.create()(Refund4);
export default BasicForm;

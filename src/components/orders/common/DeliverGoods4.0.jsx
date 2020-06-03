import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Select, DatePicker, Modal} from 'antd';
import moment from "moment";
import {sendScalpingOrder4} from "../../../api/orders/orderList";
import {jsToFormData, openNotificationWithIcon} from "../../../utils";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class DeliverGoodsForm4 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '韵达',
                value: '韵达'
            }, {
                title: '顺丰',
                value: '顺丰'
            }, {
                title: '圆通',
                value: '圆通'
            }, {
                title: '中通',
                value: '中通'
            }, {
                title: '申通',
                value: '申通'
            }, {
                title: '百世汇通',
                value: '百世汇通'
            }, {
                title: '其它',
                value: '其它'
            }],
            time: moment(new Date()),
        };
    }
    // 提交
    handleSubmit = (publicState, e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.subOrderNo = this.props.subOrderNo
                values.updateBy = this.props.updateBy
                values.orderNo = this.props.orderNo
                values.time = values.time.format('YYYY-MM-DD HH:mm:ss')
                // const params = jsToFormData(values)
                sendScalpingOrder4(values).then((res) => {
                    if (res && res.code === "00000") {
                        this.props.getDeliverGoods(true)
                        openNotificationWithIcon('success', '发货成功！')
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
        this.props.getDeliverGoods(false)
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
        const {option} = this.state;
        return (
            <Modal
                title="物流发货"
                style={{top: 230}}
                visible={this.props.deliverVisible}
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                destroyOnClose
                >
                <Form  {...formItemLayout} labelAlign={'right'}>
                    <FormItem label="发货时间">
                        {getFieldDecorator('time', {
                            rules: [{required: true, message: '请选择发货时间'}],
                            initialValue:this.state.time
                        })(
                            <DatePicker showTime
                                        initialValue={this.state.time ? moment(this.state.time, 'YYYY-MM-DD HH:mm:ss') : null}/>
                        )}
                    </FormItem>
                    <FormItem label="快递公司">
                        {getFieldDecorator('expressFirm', {
                            rules: [{required: true, message: '请选择快递公司',}],
                            initialValue:'韵达'
                        })(
                            <Select placeholder="请选择快递公司">
                                {option.map(item => {
                                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="快递单号">
                        {getFieldDecorator('expressNum', {
                            rules: [{required: true,
                                     message: '请正确输入快递单号,输入长度为1~30位',
                                    //  pattern: new RegExp(/[^\w_]/g, "g"),
                                }],
                                // getValueFromEvent: (event) => {
                                //     return event.target.value.replace(/[^\w_]/g,'')
                                // },
                        })(
                            <Input maxLength={30} placeholder="请输入快递单号,输入长度为1~30位"/>
                        )}
                    </FormItem>
                    <FormItem label="附加运费">
                        {getFieldDecorator('postage', {
                            rules: [{required: false, 
                                     message: '请正确输入附加运费！',
                                     }],
                                     getValueFromEvent: (event) => {
                                        return event.target.value.replace(/[^\d.]/g,'')
                                    },
                        })(
                            <Input  addonAfter="元" placeholder="请输入附加运费(元)"/>
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
DeliverGoodsForm4.propTypes = {
    deliverVisible: PropTypes.bool,
    getDeliverGoods: PropTypes.func,
    subOrderNo: PropTypes.string
}
DeliverGoodsForm4.defaultProps = {
    deliverVisible: false,
    subOrderNo: ''
}
const BasicForm = Form.create()(DeliverGoodsForm4);
export default BasicForm;

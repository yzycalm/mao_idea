import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Select, DatePicker, Modal} from 'antd';
import moment from "moment";
import {sendScalpingOrder} from "../../../api/orders/orderList";
import {jsToFormData, openNotificationWithIcon} from "../../../utils";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class DeliverGoodsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: [{
                title: '韵达',
                value: '0'
            }, {
                title: '顺丰',
                value: '1'
            }, {
                title: '圆通',
                value: '2'
            }, {
                title: '中通',
                value: '3'
            }, {
                title: '申通',
                value: '4'
            }, {
                title: '百世汇通',
                value: '5'
            }, {
                title: '其它',
                value: '6'
            }],
            sendTime: moment(new Date()),
        };
    }
    // 提交
    handleSubmit = (publicState, e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.id = this.props.id
                values.logistics_time = values.logistics_time.format('YYYY-MM-DD HH:mm:ss')
                const params = jsToFormData(values)
                sendScalpingOrder(params).then((res) => {
                    if (res && res.code === 1) {
                        this.props.getDeliverGoods(true)
                        openNotificationWithIcon('success', '发货成功！')
                    } else {
                        openNotificationWithIcon('error', res.msg)
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
                        {getFieldDecorator('logistics_time', {
                            rules: [{required: true, message: '请选择发货时间'}],
                            initialValue:this.state.sendTime
                        })(
                            <DatePicker showTime
                                        initialValue={this.state.sendTime ? moment(this.state.sendTime, 'YYYY-MM-DD HH:mm:ss') : null}/>
                        )}
                    </FormItem>
                    <FormItem label="快递公司">
                        {getFieldDecorator('logistics_company', {
                            rules: [{required: true, message: '请选择快递公司',}],
                            initialValue:'0'
                        })(
                            <Select placeholder="请选择快递公司">
                                {option.map(item => {
                                    return <Option key={item.value} value={item.value}>{item.title}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="快递单号">
                        {getFieldDecorator('logistics_number', {
                            rules: [{required: true, message: '请输入快递单号,输入长度为1~30位'}],
                        })(
                            <Input maxLength={30} placeholder="请输入快递单号,输入长度为1~30位"/>
                        )}
                    </FormItem>
                    <FormItem label="附加运费">
                        {getFieldDecorator('transportation_expenses', {
                            rules: [{required: false, message: '请输入附加运费！'}],
                        })(
                            <Input type="number" addonAfter="元" placeholder="请输入附加运费(元)"/>
                        )}
                    </FormItem>
                    <FormItem label="备注">
                        {getFieldDecorator('deliverGoods_remark', {
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
DeliverGoodsForm.propTypes = {
    deliverVisible: PropTypes.bool,
    getDeliverGoods: PropTypes.func,
    id: PropTypes.string
}
DeliverGoodsForm.defaultProps = {
    deliverVisible: false,
    id: ''
}
const BasicForm = Form.create()(DeliverGoodsForm);
export default BasicForm;

import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShow } from "../../utils/marketing";
import store from "../../store";
import { handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils";
import { getAcrivityList, deleteActivity, exportActivityDetail } from "../../api/acrivityField/event";
import { changeCurPage, changePageSize } from "../../store/actionCreators";
import { Button, Card, Table, Modal, Input, Form, DatePicker, Select } from "antd";
import { showStopOrDelete } from "../../utils/share";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

class Event extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '编码',
                dataIndex: 'id',
                key: 'id',
                width: 80
            }, {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name',
                width: 250
            }, {
                title: '活动类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => {
                    return +text === 0 ? '图片模式' : '商品模式'
                }
            }, {
                title: '资源位',
                dataIndex: 'img',
                key: 'img',
                render: (url, record) => {
                    return getTableImgShow(url, record)
                }
            }, {
                title: '分享',
                dataIndex: 'isShare',
                key: 'isShare',
                render: (text) => {
                    return +text === 0 ? '不显示' : '显示'
                }
            },
            {
                title: '状态',
                dataIndex: 'isUse',
                key: 'isUse',
                render: (text) => {
                    return +text === 0 ? '禁用' : '启用'
                }
            },
            {
                title: '配置链接',
                dataIndex: 'special',
                key: 'special',
                width: 350,
                render: (text, record) => {
                    let url = ''
                    if (process.env.NODE_ENV === 'production') {
                        url = `https://cloud.hongrz.com/H5/special_page/index.html?unionid=[userid]&monographicId=${record.id}&projectType=${record.type === 0 ? 2: record.type}&type=tanhuiyi`
                    } else {
                        url = `https://cloud.hongrz.com/H5/special_page/test/index.html?unionid=[userid]&monographicId=${record.id}&projectType=${record.type === 0 ? 2: record.type}&type=tanhuiyi&env=test`
                    }
                    return <span className="word_break">{url}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'displayState',
                key: 'action',
                width: 180,
                fixed: 'right',
                render: (text, record) => {
                    return +record.isUse === 0 ? <span>
                        <Button type={"primary"}
                            onClick={() => {
                                this.addEvent(record)
                            }}
                        >编辑</Button>
                        <Button type={"primary"}
                            onClick={() => {
                                showStopOrDelete('删除', record, () => {
                                    this.handleDelete(record)
                                })
                            }}
                        >删除</Button>
                    </span> : <Button type={"primary"}
                        onClick={() => {
                            this.addEvent(record)
                        }}
                              >编辑</Button>
                }
            }],
            tableData: [],
            width: 177,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize
            },
            loading: false,
            visible: false,
            exportLoad: false
        }
    }

    componentDidMount () {
        this.initData()
        handleScrollTop(1)
    }

    // 初始化数据
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            getAcrivityList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.data) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id
                        })
                        that.setState({
                            tableData: data.list,
                            total: data.total,
                            dataLength: data.list.length
                        })
                    }
                })
            })
        })
    }

    addEvent (record) {
        this.props.history.push({
            pathname: 'children/AddEvent',
            query: { id: record ? record.id : '', title: record ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }

    // 操作 删除
    handleDelete (record) {
        const params = { id: record.id }
        deleteActivity(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', '删除成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.curPage > 1) {
                    const current = parseInt(this.state.query.curPage - 1)
                    let data = Object.assign({}, this.state.query, { curPage: current })
                    this.setState({
                        query: data
                    }, () => {
                        this.initData()
                    })
                    return
                }
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            exportLoad: true
        }, () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const params = {
                        endTimestamp: moment(values.time[1], 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000,
                        id: values.id,
                        startTimestamp: moment(values.time[0], 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000,
                        orderType: values.orderType
                    }
                    exportActivityDetail(params).then(res => {
                        this.setState({
                            exportLoad: false
                        })
                        if (res && res.success) {
                            const data = res.data
                            const a = document.createElement('a')
                            a.setAttribute('target', '_blank')
                            a.setAttribute('href', data)
                            a.click()
                            a.remove()
                            this.hideModal()
                        } else {
                            openNotificationWithIcon('warning', res.message)
                        }
                    })
                } else {
                    this.setState({
                        exportLoad: false
                    })
                }
            });
        })
    };

    // 导出数据
    exportGoods () {
        this.setState({
            visible: true
        })
    }

    hideModal () {
        this.setState({
            visible: false
        })
        this.props.form.resetFields()
    }

    render () {
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { curPage: current })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        const { visible } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first={'活动专场管理'} second={'活动管理'} />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addEvent.bind(this)}
                        >新增活动</Button>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.exportGoods.bind(this, this.state.query)}
                        >导出数据</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
                <Modal
                    title="请填写完毕再导出"
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hideModal.bind(this)}
                    confirmLoading={this.state.exportLoad}
                    okText="确认"
                    cancelText="取消"
                    centered
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="编码">
                            {getFieldDecorator('id', {
                                rules: [{ required: true, message: '请输入编码' }],
                            })(
                                <Input style={{ width: '340px' }} placeholder={"输入编码"} />
                            )}
                        </Form.Item>
                        <Form.Item label="订单类型">
                            {getFieldDecorator('orderType', {
                                rules: [{ required: true, message: '请选择订单类型' }],
                            })(
                                <Select style={{ width: '340px' }}>
                                    <Option value="1">全部</Option>
                                    <Option value="0">预售</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="时间范围">
                            {getFieldDecorator('time', {
                                rules: [{ required: true, message: '请选择时间范围' }],
                            })(
                                <RangePicker renderExtraFooter={() => '红人装'} showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss"
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const BasicForm = Form.create()(Event);

export default BasicForm;

/**
 * Created by smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker, Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getNoticeList, deleteNotice } from '../../api/application/notice'
import { format, handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils/index";
import store from '../../store'
import { changeCurPage, changePageSize, inputFirstFrame, selectFirstFrame, selectTimeHorizon } from '../../store/actionCreators'
import { showStopOrDelete } from "../../utils/share";
import moment from "moment";

const { RangePicker } = DatePicker;
const Option = Select.Option;

class SearchTerms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '通知标题',
                dataIndex: 'message',
                key: 'message'
            }, {
                title: '通知内容',
                dataIndex: 'msgUrl',
                key: 'msgUrl',
                render: text => {
                    return text.length > 30 ? text.substring(0, 30) + '...' : text
                }
            },
            {
                title: '通知类型',
                dataIndex: 'txtType',
                key: 'txtType',
                render: text => {
                    return text === 1 ? "链接" : "文字"
                }
            },
            {
                title: '通知时间',
                dataIndex: 'sendTime',
                key: 'sendTime'
            },
            {
                title: '通知状态',
                dataIndex: 'status',
                key: 'status',
                render: text => {
                    return text === 1 ? "待发布" : "已发布"
                }
            },
            {
                title: '置顶',
                dataIndex: 'isTop',
                key: 'isTop',
                render: (text, record) => {
                    return text === 1 ? <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete('取消', record, () => {
                                this.handleDelete(1, 0, "取消", record)
                            })
                        }}
                                        >取消</Button> : <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete('置顶', record, () => {
                                this.handleDelete(1, 1, "置顶", record)
                            })
                        }}
                                                       >置顶</Button>
                }
            },
            {
                title: '操作',
                dataIndex: 'displayState',
                key: 'action',
                width: 180,
                fixed: 'right',
                render: (text, record) => {
                    return <span>
                        <Button type={"primary"}
                            onClick={() => {
                                this.addNotice(record)
                            }}
                        >编辑</Button>
                        <Button type={"primary"}
                            onClick={() => {
                                showStopOrDelete('删除', record, () => {
                                    this.handleDelete(2, 1, '删除', record)
                                })
                            }}
                        >删除</Button>
                    </span>
                }
            }],
            tableData: [],
            width: 177,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                message: store.getState().firstInput,
                status: store.getState().firstSelect !== "" ? store.getState().firstSelect : 2,
                time: store.getState().timeHorizon,
                startTime: store.getState().timeHorizon && store.getState().timeHorizon.length === 2 ? store.getState().timeHorizon[0] : "",
                endTime: store.getState().timeHorizon && store.getState().timeHorizon.length === 2 ? store.getState().timeHorizon[1] : ""
            },
            loading: false
        }
    }

    componentDidMount () {
        this.initData()
        handleScrollTop(1)
    }

    // 初始化数据
    initData () {
        const that = this
        const { startTime, endTime } = this.state.query
        let data = Object.assign({}, this.state.query, { startTime: new Date(startTime).getTime(), endTime: new Date(endTime).getTime() })
        this.setState({
            loading: true,
            query: data
        }, () => {
            const { ...params } = this.state.query
            delete params.time
            getNoticeList(params).then((res) => {
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
    addNotice (record) {
        inputFirstFrame(this.state.query.message)
        selectFirstFrame(this.state.query.status)
        selectTimeHorizon(this.state.query.time)
        this.props.history.push({
            pathname: 'children/AddNotice',
            query: { detail: record.id ? JSON.stringify(record) : '' }
        })
        handleScrollTop(2)
    }

    // 操作 停止
    handleStop (text, record) {
        const params = { id: record.id }
        deleteNotice(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    // 操作 删除
    handleDelete (type, value, text, record) {
        const params = { id: record.id, type: type, value: value }
        deleteNotice(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (type === 2 && this.state.dataLength <= 1 && this.state.query.curPage > 1) {
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

    handleOrderTime (value) {
        let data = Object.assign({}, this.state.query, {
            startTime: new Date(value[0]).getTime(),
            endTime: new Date(value[1]).getTime(),
            time: [format(new Date(value[0]).getTime()), format(new Date(value[1]).getTime())],
            curPage: 1
        })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    removeTime (value) {
        if (value.length === 0) {
            let data = Object.assign({}, this.state.query, { startTime: '', endTime: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 标题
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { message: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { message: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData();
        })
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
        const { startTime, endTime } = this.state.query
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="应用配置" second="通知管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="通知标题:">
                                <Input defaultValue={this.state.query.message} onBlur={this.handleTitle.bind(this)} />
                            </Form.Item>
                            <Form.Item label="通知状态:">
                                <Select defaultValue={this.state.query.status} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'status')}
                                >
                                    <Option value={1}>待发布</Option>
                                    <Option value={2}>已发布</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="通知时间:">
                                <RangePicker defaultValue={startTime && endTime ? [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')] : null} showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleOrderTime.bind(this)}
                                    onChange={this.removeTime.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type={"primary"} onClick={this.initData.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div className="gutter-box">
                    <Card bordered>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addNotice.bind(this)}
                        >新增通知</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default SearchTerms;

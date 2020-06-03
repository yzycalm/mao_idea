/**
 * Created by smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { StatusSelect, SystemSelect } from '../marketing/common'
import { getPopupList, removePopup, stopPopup } from '../../api/marketing/activity'
import { getStatusText, getSystemTypeText, getTableImgShow, getTableHandle } from "../../utils/marketing";
import { format, handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils";
import store from '../../store'
import {
    changeCurPage,
    changePageSize,
    inputFirstFrame,
    selectFirstFrame,
    selectSecondFrame
} from '../../store/actionCreators'

class ActivityDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '活动窗ID',
                dataIndex: 'id',
                key: 'id'
            }, {
                title: '活动窗标题',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '系统',
                dataIndex: 'sysType',
                key: 'sysType',
                render: text => {
                    return <span>{getSystemTypeText(text)}</span>
                }
            },
            {
                title: '图片预览',
                dataIndex: 'img',
                key: 'img',
                render: (url, record) => {
                    return getTableImgShow(url, record)
                }
            },
            {
                title: '有效期',
                dataIndex: 'startTime',
                key: 'startTime',
                render: (text, record) => {
                    return <span className="word_break">{record.startTime && record.endTime ? format(text) + '-' + format(record.endTime) : '——'}</span>
                }
            },
            {
                title: '状态',
                dataIndex: 'displayState',
                key: 'displayState',
                render: text => {
                    return <span>{getStatusText(text)}</span>
                }
            },
            {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: text => {
                    return <span>{format(text)}</span>
                }
            },
            {
                title: '操作人',
                dataIndex: 'updateBy',
                key: 'updateBy',
                render: text => {
                    return <span>{text && parseInt(text) !== 0 ? text : 'ᅳ'}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'displayState',
                key: 'action',
                width: 180,
                fixed: 'right',
                render: (text, record) => {
                    return getTableHandle(text, record, (item) => {
                        if (item === '停止') {
                            this.handleStop(item, record)
                        } else if (item === '删除') {
                            this.handleDelete(item, record)
                        } else {
                            this.addActivity(record)
                        }
                    })
                }
            }],
            tableData: [],
            width: 177,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                name: store.getState().firstInput,
                displayState: store.getState().firstSelect !== "" ? store.getState().firstSelect : '0',
                sysType: store.getState().secondSelect !== "" ? store.getState().secondSelect : '-1'
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
        this.setState({
            loading: true
        }, () => {
            getPopupList(this.state.query).then((res) => {
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

    addActivity (record) {
        inputFirstFrame(this.state.query.name)
        selectFirstFrame(this.state.query.displayState)
        selectSecondFrame(this.state.query.sysType)
        this.props.history.push({
            pathname: 'children/AddActivityDialog',
            query: { id: record ? record.id : '', title: record ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }
    getTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { name: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { name: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 操作 停止
    handleStop (text, record) {
        const params = { id: record.id }
        stopPopup(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    // 操作 删除
    handleDelete (text, record) {
        const params = { id: record.id }
        removePopup(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
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

    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
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
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="推广管理" second="活动窗管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="活动窗标题:">
                                <Input defaultValue={this.state.query.name} placeholder="请输入活动窗标题" onBlur={this.getTitle.bind(this)} style={{ width: this.state.width }} />
                            </Form.Item>
                            <Form.Item label="系统">
                                <SystemSelect width={this.state.width} defaultValue={this.state.query.sysType}
                                    getSystem={this.handleSelected.bind(this, 'sysType')}
                                />
                            </Form.Item>
                            <Form.Item label="状态:">
                                <StatusSelect width={this.state.width} defaultValue={this.state.query.displayState}
                                    getStatus={this.handleSelected.bind(this, 'displayState')}
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
                            onClick={this.addActivity.bind(this)}
                        >新建活动弹窗</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default ActivityDialog;

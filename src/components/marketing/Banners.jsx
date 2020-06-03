/**
 * Created by smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Modal } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { StatusSelect, SystemSelect } from '../marketing/common'
import { findRewardActivityList, deleteRewardActivityById, stopShowRewardActivity } from '../../api/marketing/banner'
import { getStatusText, getSystemTypeText, getTableHandle, getTableImgShow } from "../../utils/marketing";
import { format, handleScrollTop, openNotificationWithIcon, paginationProps, isEmpty } from "../../utils";
import store from '../../store'
import {
    changeCurPage,
    changePageSize,
    inputFirstFrame,
    selectFirstFrame,
    selectSecondFrame
} from '../../store/actionCreators'

class Banners extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                //     {
                //     title: '横幅ID',
                //     dataIndex: 'id',
                //     key: 'id'
                // },
                {
                    title: '横幅标题',
                    dataIndex: 'title',
                    key: 'title',
                }, {
                    title: '优先级',
                    dataIndex: 'serialNumber',
                    key: 'serialNumber'
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
                        return <span
                            className="word_break"
                               >{record.startTime && record.endTime ? format(text) + '-' + format(record.endTime) : '——'}</span>
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
                        return isEmpty(text)
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
                                this.addBanner(record)
                            }
                        })
                    }
                }],
            tableData: [],
            width: 177,
            loading: true,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                title: store.getState().firstInput,
                displayState: store.getState().firstSelect !== "" ? store.getState().firstSelect : '0',
                sysType: store.getState().secondSelect !== "" ? store.getState().secondSelect : '-1'
            }
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
            findRewardActivityList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
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

    addBanner (record) {
        inputFirstFrame(this.state.query.title)
        selectFirstFrame(this.state.query.displayState)
        selectSecondFrame(this.state.query.sysType)
        this.props.history.push({
            pathname: 'children/AddBanner',
            query: { id: record ? record.id : '', title: record ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }

    // 操作 停止
    handleStop (text, record) {
        const params = { id: record.id }
        stopShowRewardActivity(params).then(res => {
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
        deleteRewardActivityById(params).then(res => {
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

    // 横幅名称
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { title: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { title: '', curPage: 1 })
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
                <BreadcrumbCustom first="推广管理" second="横幅管理" />

                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="横幅标题:">
                                <Input defaultValue={this.state.query.title} placeholder="请输入横幅标题"
                                    onBlur={this.handleTitle.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="系统">
                                <SystemSelect defaultValue={this.state.query.sysType} width={this.state.width}
                                    getSystem={this.handleSelected.bind(this, 'sysType')}
                                />
                            </Form.Item>
                            <Form.Item label="状态:">
                                <StatusSelect defaultValue={this.state.query.displayState} width={this.state.width}
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
                            onClick={this.addBanner.bind(this)}
                        >新建横幅</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Banners;

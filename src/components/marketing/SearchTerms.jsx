/**
 * Created by smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { StatusSelect, LocationSelect } from '../marketing/common'
import { findByList, stopSearch, deleteSearch } from '../../api/marketing/searchTerms'
import { getStatusText, getSearchLocation, getTableHandle } from "../../utils/marketing";
import { handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils/index";
import store from '../../store'
import {
    changeCurPage,
    changePageSize,
    inputFirstFrame,
    selectFirstFrame,
    selectSecondFrame
} from '../../store/actionCreators'

class SearchTerms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '搜索词ID',
                dataIndex: 'id',
                key: 'id'
            }, {
                title: '搜索词位置',
                dataIndex: 'type',
                key: 'type',
                width: 180,
                render: text => {
                    return <span>{getSearchLocation(text)}</span>
                }
            }, {
                title: '搜索词名词',
                dataIndex: 'searchContent',
                key: 'searchContent',
            },
            {
                title: '优先级',
                dataIndex: 'sequence',
                key: 'sequence',
            },
            {
                title: '有效期',
                dataIndex: 'startTime',
                key: 'startTime',
                render: (text, record) => {
                    return <span className="word_break">{record.startTime && record.endTime ? text + '-' + record.endTime : '——'}</span>
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
            },
            {
                title: '操作人',
                dataIndex: 'operateBy',
                key: 'operateBy',
                render: text => {
                    return <span>{text ? text : 'ᅳ'}</span>
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
                            this.addSeeker(record)
                        }
                    })
                }
            }],
            tableData: [],
            width: 177,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                searchContent: store.getState().firstInput,
                status: store.getState().firstSelect !== "" ? store.getState().firstSelect : '0',
                type: store.getState().secondSelect !== "" ? store.getState().secondSelect : '0',
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
            findByList(this.state.query).then((res) => {
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

    addSeeker (record) {
        inputFirstFrame(this.state.query.searchContent)
        selectFirstFrame(this.state.query.status)
        selectSecondFrame(this.state.query.type)
        this.props.history.push({ pathname: 'children/AddSeeker', query: { id: record ? record.id : '', title: record ? '编辑' : '新增' } })
        handleScrollTop(2)
    }
    // 操作 停止
    handleStop (text, record) {
        const params = { id: record.id }
        stopSearch(params).then(res => {
            if (res && res.success) {
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
        deleteSearch(params).then(res => {
            if (res && res.success) {
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
    // 广告名称
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { searchContent: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { searchContent: '', curPage: 1 })
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
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="推广管理" second="搜索词管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="搜索词位置:">
                                <LocationSelect width={this.state.width} defaultValue={this.state.query.type}
                                    getLocation={this.handleSelected.bind(this, 'type')}
                                />
                            </Form.Item>
                            <Form.Item label="搜索词名词:">
                                <Input defaultValue={this.state.query.searchContent} placeholder="请输入搜索词关键字" onBlur={this.handleTitle.bind(this)} />
                            </Form.Item>
                            <Form.Item label="状态:">
                                <StatusSelect width={this.state.width} defaultValue={this.state.query.status}
                                    getStatus={this.handleSelected.bind(this, 'status')}
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
                            onClick={this.addSeeker.bind(this)}
                        >新增搜索词</Button>
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

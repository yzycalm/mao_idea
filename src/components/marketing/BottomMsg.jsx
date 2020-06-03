/**
 * Created by Yzy on 2020/4/9.
 */
import React from 'react';
import {Card, Form, Input, Button, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {StatusSelectBottom, SystemSelect} from '../marketing/common'
import {bottomMsgList,stopBottom,deleteBottom} from '../../api/marketing/bottomMsg'
import {getStatusBottom, getSystemTypeText, getTableHandleBottom} from "../../utils/marketing";
import {format, handleScrollTop, openNotificationWithIcon, paginationProps} from "../../utils";
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
                title: '消息条内容',
                dataIndex: 'message',
                width: 450,
                key: 'message'
            }, {
                title: '优先级',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
            }, {
                title: '系统',
                dataIndex: 'sysType',
                key: 'sysType',
                render: text => {
                    return <span>{getSystemTypeText(text)}</span>
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
                    dataIndex: 'status',
                    key: 'id',
                    render: text => {
                        return <span>{getStatusBottom(text)}</span>
                    }
                },
                
                {
                    title: '操作人',
                    dataIndex: 'updateBy',
                    key: 'updateBy',
                    render: text => {
                        return <span>{text && parseInt(text) !== 0?text:'ᅳ'}</span>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'status',
                    key: 'status',
                    width: 180,
                    fixed: 'right',
                    render: (text, record) => {
                        return getTableHandleBottom(text, record, (item) => {
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
                message: store.getState().firstInput,
                status:   store.getState().firstSelect !== "" ? store.getState().firstSelect : '-1',
                sysType: store.getState().secondSelect !== "" ? store.getState().secondSelect : '-1'
            },
            loading: false
        }
    }

    componentDidMount() {
        this.initData()
        handleScrollTop(1)
    }

    // 初始化数据
    initData() {
        const that = this
        this.setState({
            loading: true
        }, () => {
            bottomMsgList(this.state.query).then((res) => {
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

    addActivity(record) {
        inputFirstFrame(this.state.query.message)
        selectFirstFrame(this.state.query.status)
        selectSecondFrame(this.state.query.sysType)
        this.props.history.push({
            pathname: 'children/addbottom',
            query: {id: record ? record.id : '', title: record ? '编辑' : '新增'}
        })
        handleScrollTop(2)
    }
    getTitle(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {message: value, curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, {message: '', curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 操作 停止
    handleStop(text, record) {
        const params = {id: record.id}
        console.log(1)
        stopBottom(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    // 操作 删除
    handleDelete(text, record) {
        console.log(2)
        const params = {id: record.id}
        deleteBottom(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.curPage > 1) {
                    const current = parseInt(this.state.query.curPage - 1)
                    let data = Object.assign({}, this.state.query, {curPage: current})
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
    handleSelected(param, val) {
        let data = Object.assign({}, this.state.query, {[param]: val, curPage: 1})
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    render() {
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, {pageSize: pageSize, curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, {curPage: current})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="推广管理" second="底部消息条" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="消息条内容:">
                                <Input defaultValue={this.state.query.message} placeholder="请输入消息条内容" onBlur={this.getTitle.bind(this)} style={{width: this.state.width}} />
                            </Form.Item>
                            <Form.Item label="系统">
                                <SystemSelect width={this.state.width} defaultValue={this.state.query.sysType}
                                              getSystem={this.handleSelected.bind(this, 'sysType')}
                                />
                            </Form.Item>
                            <Form.Item label="状态:">
                                <StatusSelectBottom width={this.state.width} defaultValue={this.state.query.status}
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
                        <Button type={"primary"} style={{marginBottom: '10px'}}
                                onClick={this.addActivity.bind(this)}
                        >新增</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                               loading={this.state.loading} pagination={pagination} scroll={{x: 1600}}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default ActivityDialog;

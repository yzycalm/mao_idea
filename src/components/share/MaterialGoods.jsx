/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShowSpecial } from "../../utils/marketing";
import { getShareList, deleteShareItem } from '../../api/share/shareList'
import {
    openNotificationWithIcon,
    paginationProps,
    format,
    getContent,
    handleScrollTop, isEmpty
} from '../../utils/index'
import moment from "moment";
import { SendStatus, TabType } from '../share/common';
import { showStopOrDelete } from "../../utils/share";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;
class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 80,
                    key: 'index',
                    render: text => {
                        return <span>{(this.state.query.curPage - 1) * this.state.query.pageSize + text}</span>
                    }
                },
                {
                    title: '素材分类',
                    dataIndex: 'tabType',
                    width: 120,
                    key: 'tabType',
                    render: (text, record) => {
                        if (text == "0") {
                            return <span>全部</span>
                        } else if (text == "1") {
                            return <span>早安签到</span>
                        } else if (text == "2") {
                            return <span>公司实力</span>
                        } else if (text == "3") {
                            return <span>红人说</span>
                        } else if (text == "4") {
                            return <span>红人公益</span>
                        } else {
                            return <span>热门活动</span>
                        }
                    }
                },
                {
                    title: '分享文案',
                    dataIndex: 'content',
                    textWrap: 'word-break',
                    width: 420,
                    key: 'content',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '图片预览',
                    dataIndex: 'firstImg',
                    width: 100,
                    key: 'firstImg',
                    render: (url, record) => {
                        return getTableImgShowSpecial(url, record)
                    }
                }, {
                    title: '实际分享次数',
                    dataIndex: 'realShareNum',
                    width: 120,
                    key: 'realShareNum'
                }, {
                    title: '虚拟分享次数',
                    dataIndex: 'virtualShareNum',
                    width: 120,
                    key: 'virtualShareNum'
                }, {
                    title: '小编昵称',
                    dataIndex: 'nickName',
                    width: 120,
                    key: 'nickName'
                }, {
                    title: '发送状态',
                    dataIndex: 'sendStatus',
                    width: 120,
                    key: 'sendStatus',
                    render: (text, record) => {
                        if (text == "1") {
                            return <span>已发送</span>
                        } else {
                            return <span>待发送</span>
                        }
                    }
                }, {
                    title: '发布时间',
                    dataIndex: 'sendTime',
                    width: 130,
                    key: 'sendTime',
                    render: text => {
                        return format(text)
                    }
                }, {
                    title: '操作人',
                    dataIndex: 'updateBy',
                    width: 260,
                    key: 'updateBy',
                    render: text => {
                        return isEmpty(text)
                    }
                }, {
                    title: '操作',
                    dataIndex: 'sendStatus',
                    fixed: 'right',
                    key: "id",
                    width: 180,
                    render: (text, record) => {

                        return <span>
                            <Button type={"primary"}
                                onClick={() => {
                                    this.AddOrEditMaterial(record)
                                }}
                            >编辑</Button>
                            <Button type={"primary"}
                                onClick={() => {
                                    showStopOrDelete('删除', record, () => {
                                        this.handleDelete('删除', record)
                                    })
                                }}
                            >删除</Button>
                        </span>
                    }
                }
            ]
            ,
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                burstingMustType: 1,
                content: "",
                curPage: store.getState().curPage,
                endTime: "",
                pageSize: store.getState().pageSize,
                platform: 0,
                productId: "",
                sendStatus: 0,
                TabType: 0,
                startTime: ""
            },
            width: 100,
            selectedRowKeys: [],
            fileList: [],
            toLeadLoading: false,
            exportLoading: false,
            deleteLoading: false,
            soldOutLoading: false,
            collect: {
                audit: 0,
                notPassed: 0,
                settlement: 0,
                upperShelf: 0
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
            getShareList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id
                            item.index = index + 1
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


    //删除数据
    handleDelete (text, record) {
        const params = { id: record.id }
        deleteShareItem(params).then(res => {
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

    //新增素材
    AddOrEditMaterial (record) {
        this.props.history.push({
            pathname: 'children/AddMaterial',
            query: { id: record ? record.id : '', title: record.id ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }
    // 平台系统
    handleSysType (val) {
        let data = Object.assign({}, this.state.query, { platform: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 买家信息
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { productMsg: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { productMsg: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 订单状态
    handleDisplayState (val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 时间范围
    handleTimeHorizon (value) {
        let data = Object.assign({}, this.state.query, { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime(), curPage: 1 })
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
    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 商品文案
    handleContent (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { content: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { content: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
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
                <BreadcrumbCustom first="分享管理" second="必发素材" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="素材类型">
                                <TabType width={this.state.width}
                                    getStatus={this.handleSelected.bind(this, 'tabType')}
                                />
                            </Form.Item>
                            <Form.Item label="分享文案">
                                <Input placeholder="请输入分享文案关键词"
                                    onBlur={this.handleContent.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="发送状态">
                                <SendStatus width={this.state.width}
                                    getStatus={this.handleSelected.bind(this, 'sendStatus')}
                                />
                            </Form.Item>
                            <Form.Item label="发布时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleTimeHorizon.bind(this)} onChange={this.removeTime.bind(this)}
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.AddOrEditMaterial.bind(this)}
                                >新增素材</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.initData.bind(this)}
                                >刷新分享数据</Button>
                            </div>

                        </div>

                        <Table columns={this.state.tableColumns}

                            dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;

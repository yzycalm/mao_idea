/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { GoodsPlatform } from '../commodity/common'
import { SendStatus } from '../share/common'
import { getShareList, deleteShareItem } from '../../api/share/shareList'
import { format, openNotificationWithIcon, paginationProps, handleScrollTop } from '../../utils/index'
import moment from "moment";
import { getTableImgShowSpecial } from "../../utils/marketing";
import { showStopOrDelete } from "../../utils/share";
import { getContent } from "../../utils/index";
import { getPlatformIcon } from "../../utils/commodity";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'
const { RangePicker } = DatePicker;
class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '分享文案',
                dataIndex: 'content',
                key: 'content',
                width: 300,
                render: (text => {
                    return <span className="word_break">{text ? getContent(text) : 'ᅳ'}</span>
                })
            }, {
                title: '第三方商品ID',
                dataIndex: 'productId',
                key: 'productId',
                width: 150
            }, {
                title: '商品名称',
                dataIndex: 'productName',
                key: 'productName',
                width: 270,
                render: (text, record) => {
                    return !record.productUrl ? <span>{getPlatformIcon(record.platform)} {text}</span> : <a href={record.productUrl} target="_blank">{getPlatformIcon(record.platform)} {text}</a>
                }
            }, {
                title: '分享图片',
                dataIndex: 'firstImg',
                key: 'firstImg',
                width: 100,
                render: (url, record) => {
                    return getTableImgShowSpecial(url, record)
                }
            },
            {
                title: '实际分享次数',
                dataIndex: 'realShareNum',
                key: 'realShareNum',
                width: 120
            }, {
                title: '虚拟分享次数',
                dataIndex: 'virtualShareNum',
                key: 'virtualShareNum',
                width: 120
            }, {
                title: '小编昵称',
                dataIndex: 'nickName',
                key: 'nickName',
                width: 120
            }, {
                title: '发送状态',
                dataIndex: 'sendStatus',
                key: 'sendStatus',
                width: 100,
                render: (text, record) => {
                    return text === 1 ? '已发送' : '待发送'
                }
            },
            {
                title: '发送时间',
                dataIndex: 'sendTime',
                width: 120,
                key: 'sendTime',
                render: (text, record) => {
                    return <span >{record.sendTime ? format(text) : '——'}</span>
                }
            },
            {
                title: '操作人',
                dataIndex: 'updateBy',
                key: 'updateBy',
                render: text => {
                    return text ? <span>{text}</span> : <span>ᅳ</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'displayState',
                key: 'action',
                width: 80,
                fixed: 'right',
                render: (text, record) => {
                    return <span>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={() => {
                                this.addGoods(record)
                            }}
                        >编辑</Button>
                        <br />
                        <Button type={"primary"}
                            onClick={() => {
                                showStopOrDelete('删除', record, () => {
                                    this.handleDeleteItem(record)
                                })
                            }}
                        >删除</Button>
                    </span>
                }
            }],
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                burstingMustType: 0,
                content: '',
                curPage: store.getState().curPage,
                endTime: '',
                pageSize: store.getState().pageSize,
                platform: 0,
                productId: '',
                sendStatus: 0,
                startTime: ''
            },
            width: 177,
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
    handleDeleteItem (record) {
        const params = { id: record.id }
        deleteShareItem(params).then(res => {
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
    // 下拉框选中值
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    // 输入框
    handleInput (param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { [param]: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { [param]: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 平台
    handleDisplayState (val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    // 发送时间
    handleOrderTime (value) {
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
    // 新增商品
    addGoods (record, tag) {
        this.props.history.push({
            pathname: 'children/AddRecommendGoods',
            query: { id: record ? record.id : '', title: record ? '编辑' : '新增' }
        })
        handleScrollTop(2)
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
                <BreadcrumbCustom first="分享管理" second="商品推荐" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="分享文案">
                                <Input placeholder="请输入分享文案关键词"
                                    onBlur={this.handleInput.bind(this, 'content')}
                                />
                            </Form.Item>
                            <Form.Item label="平台">
                                <GoodsPlatform width={this.state.width}
                                    getPlatform={this.handleSelected.bind(this, 'platform')}
                                />
                            </Form.Item>
                            <Form.Item label="第三方商品ID">
                                <Input placeholder="请输入商品名称或商品ID"
                                    onBlur={this.handleInput.bind(this, 'productId')}
                                />
                            </Form.Item>
                            <Form.Item label="发送状态">
                                <SendStatus width={this.state.width}
                                    getStatus={this.handleSelected.bind(this, 'sendStatus')}
                                />
                            </Form.Item>
                            <Form.Item label="发送时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleOrderTime.bind(this)} onChange={this.removeTime.bind(this)}
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
                        <Button type={"primary"} style={{ marginBottom: '10px' }} onClick={this.addGoods.bind(this)}>新增推荐</Button>
                        <Button type={"primary"} onClick={this.initData.bind(this)}>刷新分享数据</Button>
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

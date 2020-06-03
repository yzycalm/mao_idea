/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Popover } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { OrderStatus, OrderPlatform, CustomDatePicker } from '../orders/common'
import { getOrderList, getOrderDetail, getProductUrl } from '../../api/orders/orderList'
import { paginationProps, openNotificationWithIcon, isEmpty } from '../../utils/index'
import { getColumnOrderStatus, getUserLevel } from '../../utils/order'
import { getTableImgShowSpecial } from "../../utils/marketing";
import { getPlatformIcon } from "../../utils/commodity";
import store from '../../store'
import { changeCurPage } from '../../store/actionCreators'

class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: text => {
                    return <span>{(this.state.query.curPage - 1) * this.state.query.pageSize + text}</span>
                }
            }, {
                title: '下单时间',
                dataIndex: 'orderTime',
                key: 'orderTime',
                render: text => {
                    return isEmpty(text)
                }
            }, {
                title: '第三方订单号',
                dataIndex: 'parentOrderNo',
                key: 'parentOrderNo',
                render: text => {
                    return isEmpty(text)
                }
            },
            {
                title: '买家信息',
                dataIndex: 'account',
                key: 'account',
                render: (text, record) => {
                    if (record.account) {
                        return <span>
                            <span>{record.account.username}</span><br />
                            <span>{record.account.phone}</span><br />
                            <span>{getUserLevel(record.account.level)}</span>
                        </span>
                    } else {
                        return <span>ᅳ</span>
                    }
                }
            },
            {
                title: '买家收益',
                dataIndex: 'profit',
                key: 'profit',
                render: (text, record) => {
                    const profit = record.profit
                    if (profit) {
                        const content = (
                            <div>
                                {
                                    record.nextProfit.map((item, index) => {
                                        return <p
                                            key={item + index}
                                               >{item.username}&nbsp;{item.status === 0 ? '未入账' : '已结算'}金额({item.percent})
                                                : {item.balance}</p>
                                    })
                                }
                            </div>
                        );
                        return <div>
                            <span>{profit.username}</span>&nbsp;
                                <span>{profit.status === 0 ? '未入账' : '已结算'}金额({profit.percent}) : {profit.balance}</span>
                            <Popover placement="bottom" content={content} trigger="click">&nbsp;&nbsp;
                                    <a style={{ color: '#578EBE' }} type="link">详情</a>
                            </Popover>
                        </div>
                    } else {
                        return <span>ᅳ</span>
                    }
                }
            },
            {
                title: '商品名称',
                dataIndex: 'productTitle',
                width: 300,
                key: 'productTitle',
                render: (text, record) => {
                    return <span className="word_break"
                        onClick={this.handleProductUrl.bind(this, record)}
                           ><a>{getPlatformIcon(record.platform)} {text}</a></span>
                }
            },
            {
                title: '商品图片',
                dataIndex: 'productImg',
                key: 'productImg',
                render: (url, record) => {
                    return getTableImgShowSpecial(url, record)
                }
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                render: text => {
                    return <span>{getColumnOrderStatus(text)}</span>
                }
            },
            {
                title: '订单金额(元)',
                dataIndex: 'orderAmount',
                key: 'orderAmount',
            }],
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                curPage: store.getState().curPage,
                endTime: '',
                orderNo: '',
                orderStatus: 0,
                pageSize: 10,
                phone: '',
                platform: 0,
                startTime: ''
            },
            width: 177,
            defaultValue: 'all'
        }
    }

    componentDidMount () {
        this.initData()
    }

    // 初始化数据
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            const { ...params } = this.state.query
            if (!params.phone) {
                delete params.phone
            }
            getOrderList(params).then((res) => {
                this.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.map((item, index) => {
                            item.key = index + item.id
                            item.index = index + 1
                            item.nextProfit = []
                            that.handleDetail(item).then(result => {
                                item.nextProfit = result
                            })
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

    // 平台系统
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 商品链接
    handleProductUrl (record) {
        const params = { platform: record.platform, productId: record.productId }
        getProductUrl(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                const a = document.createElement('a'); // 创建a标签
                a.setAttribute('href', data.productUrl);// href链接
                a.target = '_blank';
                a.click();// 自执行点击事件
                a.remove()
            } else {
                openNotificationWithIcon('warning', res.message)
            }
        })
    }

    // 输入框信息
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
    async handleDetail (record) {
        const params = {
            orderId: record.id,
            platform: record.platform
        }
        let data = {}
        await getOrderDetail(params).then(res => {
            if (res && res.success) {
                data = res.data
            }
        })
        return data
    }
    // 时间范围
    handleTimeHorizon (val) {
        let data = Object.assign({}, this.state.query, {
            startTime: val[0] ? val[0].format('X') : '',
            endTime: val[1] ? val[1].format('X') : '',
            curPage: 1
        })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    render () {
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changeCurPage(current)
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
                <BreadcrumbCustom first="订单管理" second="订单列表" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="买家信息">
                                <Input placeholder="买家昵称/手机号"
                                    onBlur={this.handleInput.bind(this, 'phone')}
                                />
                            </Form.Item>
                            <Form.Item label="第三方订单号">
                                <Input placeholder="第三方订单号"
                                    onBlur={this.handleInput.bind(this, 'orderNo')}
                                />
                            </Form.Item>
                            <Form.Item label="平台">
                                <OrderPlatform width={this.state.width}
                                    getPlatform={this.handleSelected.bind(this, 'platform')}
                                />
                            </Form.Item>
                            <Form.Item label="订单状态">
                                <OrderStatus width={this.state.width}
                                    getStatus={this.handleSelected.bind(this, 'orderStatus')}
                                />
                            </Form.Item>
                            <Form.Item label="下单时间">
                                <CustomDatePicker getTimeHorizon={this.handleTimeHorizon.bind(this)} />
                            </Form.Item>
                            <Form.Item>
                                <Button type={"primary"} onClick={this.initData.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div className="gutter-box">
                    <Card bordered>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;
